import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PopUpImage = ({ visible, imageSource, onClose }: any) => {
  const [isImageExpanded, setIsImageExpanded] = useState(visible);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const inputRange = [0, 1];
  const outputRange = [1, 0.8];
  const scale = scaleValue.interpolate({ inputRange, outputRange });

  const toggleImageExpansion = () => {
    if (visible) {
      setIsImageExpanded(true);
      Animated.timing(scaleValue, {
        toValue: 2,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setIsImageExpanded(false), 100);
      });
    }
  };

  useEffect(() => {
    toggleImageExpansion();
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { width: screenWidth / 1.3, height: screenHeight / 2 },
          { transform: [{ scale: scale }] },
        ]}
      >
        <Image source={{ uri: imageSource }} style={{ height: '100%', width: '100%' }} />
        <View style={styles.overlay}>
          {isImageExpanded && (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  image: {
    width: 500,
    height: 500,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    elevation: 20,
    height: '80%',
    paddingBottom: '20%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    height: 70,
    width: 200,
    backgroundColor: 'red',
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default PopUpImage;
