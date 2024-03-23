import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import { Gesture, PinchGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  CameraPermissionRequestResult,
  PhotoFile,
  useCameraDevice,
  CameraProps,
  Point,
} from 'react-native-vision-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CircleFocus from '../../components/CircleFocus';
import ImageViewer from '../../components/ImageViewer';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { Props } from './ExpensesScreen';
import { Resolver, useForm } from 'react-hook-form';
import { receiptsScreenSchema } from '../../schemas/receiptsScreenSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase.config';
import { useDispatch, useSelector } from 'react-redux';
import { setReceiptTotalValuePhotoScreen } from '../../redux/actions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../rootStates/rootState';
import { User as FirebaseUser } from '@react-native-firebase/auth';
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const PhotoPreview: React.FC<{ photo: string }> = ({ photo }) => {
  return <Image source={{ uri: photo }} style={{ height: '100%', width: '100%' }} />;
};

export type ReceiptItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
};

export type ReceiptDataValues = {
  category: string;
  currency: string;
  documentType: string;
  supplierAddress: string;
  supplierName: string;
  totalAmount: number;
  receiptItems: ReceiptItem[];
  createdAt: string;
};

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const camera = useRef<Camera>(null);

  const device = useCameraDevice('back') || null;

  //////
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionRequestResult>('denied');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [showImage, setShowImage] = useState(false);
  const [focusImage, setFocusImage] = useState({ x: 0, y: 0 });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const zoomOffset = useSharedValue(0);

  const zoom = useSharedValue(device?.neutralZoom);

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value !== undefined ? zoom.value : 0;
    })
    .onUpdate((event) => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [
          device?.minZoom ?? 0, //wartość domyślna
          device?.maxZoom ?? 1, //wartość domyślna
        ],
        Extrapolation.CLAMP
      );
    });

  const takePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        enableShutterSound: false,
      });

      if (photo) {
        const timestamp = Date.now();
        const fileName = `receipt${timestamp}.jpg`;
        const directory = RNFS.DownloadDirectoryPath;
        const destPath = `${directory}/${fileName}`;
        await RNFS.copyFile(photo.path, destPath);
        setPhotos((prevPhotos) => [...prevPhotos, { path: destPath } as PhotoFile]);
      }
    } catch (e) {
      Alert.alert(`Error: ${e}`);
    }
  };

  const handleOpenImageViewer = () => {
    if (photos.length > 0) {
      setShowImage(true);
    }
  };

  useEffect(() => {
    async function getPermission() {
      try {
        const cameraPermissionRequest = await Camera.requestCameraPermission();
        setCameraPermission(cameraPermissionRequest);
      } catch (error) {
        Alert.alert('No permission to camera');
      }
    }
    getPermission();
  }, [cameraPermission]);

  const animatedProps = useAnimatedProps<Partial<CameraProps>>(
    () => ({
      zoom: zoom.value,
    }),
    [zoom]
  );

  const pickImageFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('ImagePicker error');
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageFromGallery = response.assets[0].uri;
        setPhotos((prevPhoto: PhotoFile[]) => [
          ...prevPhoto,
          { path: selectedImageFromGallery } as PhotoFile,
        ]);
        setTimeout(() => {
          setShowImage(false);
        }, 1000);
      }
    });
  };

  if (!device) {
    return null;
  }

  const latestPhoto = photos.length > 0 ? photos[photos.length - 1] : null;

  if (latestPhoto) {
    const photoPath = latestPhoto.path;
    console.log('Directory image:', photoPath);
  } else {
    console.log('There is no photos.');
  }

  const { isGoogleUserLoggedIn, userGoogleUId } = useSelector(
    (state: RootState) => state.name.isGoogleUser
  );

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        console.log('You are logged in now');
        Alert.alert('User is logged in');
      } else {
        console.log('You were logged out');
        Alert.alert('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, [userGoogleUId, isGoogleUserLoggedIn]);

  //Receipt image for api

  //set Loading
  const [isLoadingFromAPI, setIsLoadingFromAPI] = useState(false);

  //Save information in state array

  const dispatch = useDispatch();

  const [expensesArrayFromAPI, setExpensesArrayFromAPI] = useState<any[]>([]);
  const parseOcrResponse = (response: string) => {
    try {
      const parsedResponse = JSON.parse(response);
      const createdDate = new Date(Date.now());
      const currentExpenseReceiptHour = createdDate.getUTCHours();
      createdDate.setUTCHours(currentExpenseReceiptHour + 1);
      if (parsedResponse.api_request && parsedResponse.api_request.status === 'success') {
        const document = parsedResponse.document;

        if (
          document &&
          document.inference &&
          document.inference.pages &&
          document.inference.pages.length > 0
        ) {
          const pages = document.inference.pages;

          const updatedExpensesArray = pages.map((page: any) => {
            const receiptFields = page.prediction.line_items.map((item: any) => ({
              description: item.description || '',
              quantity: item.quantity || 0,
              totalAmount: item.total_amount || 0,
              unitPrice: item.unit_price || 0,
            }));

            return {
              category: page.prediction.category.value || '',
              documentType: page.prediction.document_type.value || '',
              currency: page.prediction.locale.currency || '',
              supplierName: page.prediction.supplier_name.value || '',
              supplierAddress: page.prediction.supplier_address.value || '',
              totalAmount: page.prediction.total_amount.value || 0,
              receiptFields,
              createdAt: createdDate.toUTCString(),
            };
          });

          setExpensesArrayFromAPI((prevExpensesArray) => [
            ...prevExpensesArray,
            ...updatedExpensesArray,
          ]);

          return updatedExpensesArray;
        }
      }
    } catch (error) {
      console.error('Error parsing OCR response:', error);
    }

    return [];
  };

  useEffect(() => {
    console.log('CO TO JEST', expensesArrayFromAPI);
  }, [expensesArrayFromAPI]);

  const handleCaptureAndRecognize = async () => {
    try {
      const imageFile = `file://${photos[photos.length - 1].path}`;
      const pathFragment = imageFile.split('/');

      const fileName = pathFragment[pathFragment.length - 1];
      const directory = RNFS.DownloadDirectoryPath;
      const filePath = `${directory}/ReceiptImage.jpg`;
      console.log('Ścieżka: ', filePath);

      const formData = new FormData();
      const imageContent = await RNFS.readFile(imageFile, 'base64');

      formData.append('document', {
        uri: imageFile,
        name: fileName,
        type: 'image/jpg',
        data: imageContent,
      });

      console.log('Form Data:', formData);
      console.log('Filename:', fileName);
      console.log('Nazwa pliku', imageFile);

      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.log('User is not logged in');
        Alert.alert('User is not logged in');
        return;
      } else {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 201) {
              const responseData = parseOcrResponse(xhr.responseText);
              console.log('Receipt OCR result: ', xhr.responseText);
              console.log('Parsed OCR result: ', responseData);

              setIsLoadingFromAPI(false);
            } else {
              console.error('Error in XHR', xhr.statusText);
              Alert.alert('No internet connection');
              setIsLoadingFromAPI(false);
            }
          }
        });
        xhr.open('POST', 'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict');
        xhr.setRequestHeader('Authorization', 'Token d6306679e134f7fc0d22f1d0fc3e528c');
        xhr.send(formData);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Axios Error', axiosError.response?.data);
      } else {
        Alert.alert('There is no image to recognize text');
      }
    }
  };

  //Translation
  const { t } = useTranslation();

  //yup schema receipt data

  const receiptData = useForm<ReceiptDataValues>({
    defaultValues: {
      category: '',
      currency: '',
      documentType: '',
      supplierAddress: '',
      supplierName: '',
      totalAmount: 0,
      receiptItems: [
        {
          description: '',
          quantity: 0,
          unitPrice: 0,
          totalAmount: 0,
        },
      ],
      createdAt: '',
    },
    resolver: yupResolver(receiptsScreenSchema) as Resolver<ReceiptDataValues, any>,
    shouldUnregister: false,
    reValidateMode: 'onBlur',
    criteriaMode: 'all',
    mode: 'all',
  });

  const { register, control, handleSubmit, formState } = receiptData;
  const { errors } = formState;

  const addReceiptDocument = async () => {
    if (expensesArrayFromAPI.length > 0) {
      const lastExpense = expensesArrayFromAPI[expensesArrayFromAPI.length - 1];

      try {
        if (
          !lastExpense ||
          !lastExpense.category ||
          !lastExpense.currency ||
          !lastExpense.documentType ||
          !lastExpense.supplierAddress ||
          !lastExpense.supplierName ||
          !lastExpense.totalAmount ||
          !lastExpense.receiptFields ||
          lastExpense.receiptFields.length === 0 ||
          !lastExpense.createdAt
        ) {
          throw new Error('Last expense is missing required fields');
        }

        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
          console.log('User is not logged in');
          Alert.alert('User is not logged in');
          return;
        }

        await addDoc(collection(db, 'receiptsCollection'), {
          category: lastExpense.category,
          currency: lastExpense.currency,
          documentType: lastExpense.documentType,
          supplierAddress: lastExpense.supplierAddress,
          supplierName: lastExpense.supplierName,
          totalAmount: lastExpense.totalAmount,
          receiptFields: lastExpense.receiptFields.map((field: any) => ({
            description: field.description,
            quantity: field.quantity,
            unitPrice: field.unitPrice,
            totalAmount: field.totalAmount,
          })),
          createdAt: lastExpense.createdAt,
          userId: currentUser?.uid,
        });

        dispatch(setReceiptTotalValuePhotoScreen(lastExpense.totalAmount));
        Alert.alert('Receipt data was added');
        setIsLoadingFromAPI(false);
        console.log('Data added to Firestore database');
      } catch (error) {
        console.log('Error while adding new document', error);
        Alert.alert(`Error while adding new receipt: ${error.message}`);
      }
    } else {
      console.log('Error: expensesArrayFromAPI is empty');
    }
  };

  const receiptTotalValuePhotoScreen = useSelector(
    (state: RootState) => state.name.receiptTotalValuePhotoScreen
  );

  useEffect(() => {
    async function readReceipt() {
      const rData = await AsyncStorage.getItem('receiptValue');
      console.log('Paragon', rData);
    }
    readReceipt();
  }, [receiptTotalValuePhotoScreen]);

  const onSubmit = () => {
    console.log('ON SUBMIT BUTTON');
    const lastExpense = expensesArrayFromAPI[expensesArrayFromAPI.length - 1];
    console.log(lastExpense.category);
    console.log(lastExpense.currency);
    console.log(lastExpense.documentType);
    console.log(lastExpense.supplierAddress);
    console.log(lastExpense.supplierName);
    console.log(lastExpense.totalAmount);
    lastExpense.receiptFields.forEach((field: any) => {
      console.log(field.description);
      console.log(field.quantity);
      console.log(field.unitPrice);
      console.log(field.totalAmount);
    });
    console.log(lastExpense.createdAt);
    addReceiptDocument();
  };

  //Save elements to database

  const saveReceiptDataToDatabase = () => {
    if (photos.length === 0) {
      Alert.alert('There is no recognized image data to store in database');
      setIsLoadingFromAPI(false);
    } else if (expensesArrayFromAPI[expensesArrayFromAPI.length - 1]) {
      onSubmit();
    }
  };

  return (
    <View style={styles.container}>
      {isButtonEnabled ? (
        <>
          <View style={styles.innerHeaderContainer}>
            <Pressable
              style={{
                backgroundColor: 'white',
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <AntDesign name="arrowleft" size={30} color={'black'} />
            </Pressable>
            <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif' }}>
              {t('MakeReceiptPhotosScreenAppBarText')}
            </Text>
          </View>
          <View style={[styles.forText, { display: 'none' }]}>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {t('MakeReceiptPhotosScreenWelcomeText')}
            </Text>
            <Text style={{ fontSize: 18, color: 'black' }}>
              {t('MakeReceiptPhotosScreenWarningReceiptsText')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              margin: 10,
            }}
          >
            <TouchableOpacity style={styles.cameraButtons} onPress={() => setIsButtonEnabled(true)}>
              <Text style={{ color: 'black' }}>{t('MakeReceiptPhotosScreenRunCameraButton')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButtons}
              onPress={() => setIsButtonEnabled(false)}
            >
              <Text style={{ color: 'black' }}>{t('MakeReceiptPhotosScreenHideCameraButton')}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.innerHeaderContainer}>
              <Pressable
                style={{
                  backgroundColor: 'white',
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                }}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <AntDesign name="arrowleft" size={30} color={'black'} />
              </Pressable>
              <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif' }}>
                {t('MakeReceiptPhotosScreenAppBarText')}
              </Text>
            </View>
            <View style={styles.forText}>
              <Text style={{ fontSize: 18, color: 'black' }}>
                {t('MakeReceiptPhotosScreenWelcomeText')}
              </Text>
              <Text style={{ fontSize: 18, color: 'black' }}>
                {t('MakeReceiptPhotosScreenWarningReceiptsText')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: 10,
                padding: 10,
              }}
            >
              <TouchableOpacity
                style={styles.cameraButtons}
                onPress={() => setIsButtonEnabled(true)}
              >
                <Text style={{ color: 'black' }}>
                  {t('MakeReceiptPhotosScreenRunCameraButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButtons}
                onPress={() => setIsButtonEnabled(false)}
              >
                <Text style={{ color: 'black' }}>
                  {t('MakeReceiptPhotosScreenHideCameraButton')}
                </Text>
              </TouchableOpacity>
            </View>
            {photos.length > 0 ? (
              <View collapsable={false} style={styles.containerForPhoto}>
                <PhotoPreview photo={`file://${photos[photos.length - 1].path}`} />
              </View>
            ) : (
              <MaterialIcons
                style={{ marginLeft: 10 }}
                name="image-not-supported"
                size={24}
                color={'black'}
              />
            )}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                margin: 10,
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderRadius: 3,
                  borderWidth: 2,
                  backgroundColor: 'green',
                  width: 100,
                  height: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setTimeout(() => {
                    setIsLoadingFromAPI(!isLoadingFromAPI);
                    if (photos.length === 0) {
                      setIsLoadingFromAPI(false);
                    }
                  }, 500);
                  handleCaptureAndRecognize();
                }}
              >
                <Text style={{ fontSize: 18, color: 'black' }}>
                  {t('MakeReceiptPhotosScreenRecognizeTextButton')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderRadius: 3,
                  borderWidth: 2,
                  backgroundColor: 'orange',
                  width: 100,
                  height: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                onPress={() => {
                  setTimeout(() => {
                    setIsLoadingFromAPI(!isLoadingFromAPI);
                    saveReceiptDataToDatabase();
                  }, 500);
                }}
              >
                <Text style={{ fontSize: 14, color: 'black' }}>
                  {t('MakeReceiptPhotosScreenSaveDataTextButton')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'column', margin: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  justifyContent: 'center',
                }}
              >
                {t('MakeReceiptPhotosScreenTakenDataText')}
              </Text>
              {isLoadingFromAPI ? <ActivityIndicator size={'large'} color={'green'} /> : null}
            </View>
            <View>
              {expensesArrayFromAPI.length > 0 ? (
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 7,
                    height: 'auto',
                    width: '95%',
                    margin: 8,
                    overflow: 'hidden',
                    gap: 5,
                    padding: 10,
                  }}
                >
                  {Object.entries(expensesArrayFromAPI[expensesArrayFromAPI.length - 1]).map(
                    ([key, value], index) => (
                      <View key={index}>
                        <Text style={{ color: 'black', fontSize: 16 }}>{`${key}: ${JSON.stringify(
                          value
                        )}`}</Text>
                      </View>
                    )
                  )}
                </View>
              ) : null}
            </View>
            <View style={{ flex: 1, height: 1000 }} />
          </ScrollView>
        </View>
      )}

      {isButtonEnabled ? (
        <>
          {device && (
            <TapGestureHandler {...gesture} shouldCancelWhenOutside={false}>
              <ReanimatedCamera
                ref={camera}
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                photo={true}
                enableZoomGesture={true}
                animatedProps={animatedProps}
                resizeMode={'cover'}
              />
            </TapGestureHandler>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={handleOpenImageViewer}>
              {photos.length > 0 ? (
                <View style={styles.wrapperImage}>
                  <PhotoPreview photo={`file://${photos[photos.length - 1].path}`} />
                </View>
              ) : (
                <MaterialIcons name="image-not-supported" size={24} color={'black'} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
              <FontAwesome name="file-photo-o" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <MaterialIcons name="camera-alt" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <CircleFocus x={focusImage.x} y={focusImage.y} />

          <ImageViewer
            images={photos.map((p) => ({ uri: `file://${p.path}` }))}
            isVisible={showImage}
            handleClose={() => setShowImage(false)}
            imageIndex={photos.length - 1}
            handleConfirm={pickImageFromGallery}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    right: 0,
    left: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: 'black',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wrapperImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  forText: {
    alignItems: 'center',
  },
  containerForPhoto: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
    height: 400,
    width: '95%',
    margin: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderRadius: 7,
  },
  cameraButtons: {
    borderColor: 'black',
    borderRadius: 3,
    borderWidth: 2,
    backgroundColor: 'lightblue',
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerHeaderContainer: {
    flexDirection: 'row',
    padding: '1%',
    width: '100%',
    gap: 10,
    alignItems: 'center',
    height: 60,
    backgroundColor: 'orange',
  },
});

export default CameraScreen;
