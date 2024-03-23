import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import React from 'react';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const GaugeSpeedometer = ({ value, minValue, maxValue }) => {
  const calculateRotation = () => {
    const percentValue = (value - minValue) / (maxValue - minValue);

    let rotationDegrees = percentValue * 90;

    rotationDegrees = Math.min(rotationDegrees, 90);

    return rotationDegrees.toString() + 'deg';
  };
  return (
    <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
      <Image source={require('../assets/images/speedometer.png')} alt="gauge" />
      <View
        style={{
          ...styles.radioButton,
          bottom: screenHeight / (screenWidth / 10),
          right: screenHeight / ((screenHeight / screenWidth) * screenWidth),
        }}
      ></View>
      <View
        style={[
          styles.pointer,
          {
            top: screenHeight / (screenWidth / 18),
            left: screenWidth / ((screenHeight / screenWidth) * 1.4),
          },
          { transform: [{ rotate: calculateRotation() }] },
        ]}
      ></View>
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
