import { View, Text, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Fontisto from 'react-native-vector-icons/Fontisto';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
let moveTopPosition = screenWidth * 0.15;
let moveLeftPosition = screenWidth * 0.3;

const GaugeSpeedometer = ({ value, minValue, maxValue }) => {
  const { t, i18n } = useTranslation();
  const calculateRotation = () => {
    const percentValue = (value - minValue) / (maxValue - minValue);
    let rotationDegrees = percentValue * 90;
    rotationDegrees = Math.min(rotationDegrees, 90);
    return rotationDegrees;
  };

  const rotation = calculateRotation();

  switch (true) {
    case rotation === 90:
      moveLeftPosition = 0;
      moveTopPosition = 141 / 1.5;
      break;
    case rotation === 0:
      moveLeftPosition = 0;
      moveTopPosition = 141 / 1.5;
      break;
    default:
      moveLeftPosition = 0;
      moveTopPosition = 141 / 1.5;
      break;
  }

  const isPolish = i18n.language === 'pl';
  const isEnglish = i18n.language === 'en';
  return (
    <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
      <Image
        source={
          isPolish
            ? require('../assets/images/speedometerpl.png')
            : isEnglish
            ? require('../assets/images/speedometeren.png')
            : require('../assets/images/speedometerde.png')
        }
        alt="gauge"
      />
      <View
        style={{
          ...styles.radioButton,
          bottom: screenHeight / (screenWidth / 10),
          right: screenHeight / ((screenHeight / screenWidth) * screenWidth),
        }}
      ></View>
      {/* <ArrowCanvas value={value} minValue={minValue} maxValue={maxValue} /> */}

      <Fontisto
        name="arrow-up-l"
        color={'black'}
        size={75}
        style={{
          position: 'absolute',
          width: 35,
          textAlign: 'center',
          transform: [
            { translateX: moveLeftPosition },
            { translateY: moveTopPosition },
            { rotate: `${rotation}deg` },
          ],
        }}
      />

      {/* <View
        style={[
          styles.pointer,
          {
            top: screenHeight / (screenWidth / 18),
            left: screenWidth / ((screenHeight / screenWidth) * 1.4),
          },
          { transform: [{ rotate: `${rotation}deg` }] },
        ]}
      ></View> */}
    </View>
  );
};

export default GaugeSpeedometer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  gauge: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    backgroundColor: 'red',
  },
  pointer: {
    position: 'absolute',
    width: 2,
    height: 100,
    borderRadius: 10,

    transformOrigin: 'bottom center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,1)',
    borderBottomColor: 'rgba(0,0,255,0.3)',
    borderBottomWidth: 3,
    borderRightColor: 'rgba(0,0,255,0.3)',
    borderRightWidth: 3,
    borderLeftColor: 'rgba(0,0,255,0.3)',
    borderLeftWidth: 2,
  },
  label: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
});
