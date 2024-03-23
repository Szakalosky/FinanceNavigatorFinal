import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
type Props = {
  images: { uri: string }[];
  isVisible: boolean;
  handleClose: () => void;
  imageIndex: number;
  handleConfirm: () => void;
};

const ImageViewer: React.FC<Props> = ({
  images,
  isVisible,
  handleClose,
  imageIndex,
  handleConfirm,
}) => {
  return (
    <ImageView
      images={images}
      imageIndex={imageIndex}
      visible={isVisible}
      onRequestClose={handleClose}
      FooterComponent={() => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: 'white', padding: 10, borderRadius: 30 }}
            onPress={handleConfirm}
          >
            <FontAwesome name="file-photo-o" size={30} color="green" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default ImageViewer;
