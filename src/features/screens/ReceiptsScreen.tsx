import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorList } from '../types/Navigator';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import RNFS from 'react-native-fs';
import { PhotoFile } from 'react-native-vision-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PopUpImage from '../../components/PopUpImage';
import { ActivityIndicator } from 'react-native';
type Props = NativeStackScreenProps<NavigatorList, 'HomeScreen'>;

const PhotoPreview: React.FC<{ photo: string; onPress: () => void }> = ({ photo, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: photo }} style={{ height: '100%', width: '100%' }} />
    </TouchableOpacity>
  );
};

const ReceiptsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const [newReceiptImages, setNewReceiptImages] = useState<PhotoFile[]>([]);
  const [processedImageNames, setProcessedImageNames] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const isEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  };

  const readAllReceiptsFromDirectory = async () => {
    try {
      const images = await RNFS.readDir(RNFS.DownloadDirectoryPath);

      const currentImageNames = images
        .filter((file) => file.name.startsWith('receipt') && file.name.endsWith('.jpg'))
        .map((file) => file.name);

      if (
        currentImageNames.length !== processedImageNames.length ||
        isEqual(currentImageNames, processedImageNames)
      ) {
        const newImages = currentImageNames.map((imageName) => ({
          path: `${RNFS.DownloadDirectoryPath}/${imageName}`,
        }));
        setNewReceiptImages(
          newImages.map((image) => ({
            path: image.path,
            width: 0,
            height: 0,
            isRawPhoto: false,
            orientation: 'portrait',
            isMirrored: false,
          }))
        );
        setProcessedImageNames(currentImageNames);
      }
    } catch (error) {
      console.error('Error reading images', error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      readAllReceiptsFromDirectory();
    }, 6000);
  }, [isClicked, selectedImage]);

  return (
    <View>
      <View style={styles.innerHeaderContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
          onPress={() => navigation.navigate('HomeScreenFinal')}
        >
          <AntDesign name="arrowleft" size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', fontFamily: 'serif', color: 'white' }}>
          {t('AllReceiptsAppHeaderText')}
        </Text>
      </View>

      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {newReceiptImages.length > 0 ? (
            newReceiptImages.map((image, index) => (
              <View key={index} style={styles.containerForPhoto}>
                <PhotoPreview
                  photo={`file://${image.path}`}
                  onPress={() => {
                    setSelectedImage(`file://${image.path}`);
                    setIsClicked(!isClicked);
                  }}
                />
              </View>
            ))
          ) : (
            <>
              <MaterialIcons
                style={{ marginLeft: 10 }}
                name="image-not-supported"
                size={24}
                color={'black'}
              />
              <ActivityIndicator />
            </>
          )}
        </View>
        {selectedImage && (
          <PopUpImage
            visible={isClicked}
            imageSource={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
        <View style={{ flex: 1, height: 300 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  innerHeaderContainer: {
    flexDirection: 'row',
    padding: '1%',
    width: '100%',
    gap: 10,
    alignItems: 'center',
    height: 60,
    backgroundColor: 'blue',
  },
  containerForPhoto: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
    height: 200,
    width: '45%',
    margin: 8,
    overflow: 'hidden',
  },
});

export default ReceiptsScreen;
