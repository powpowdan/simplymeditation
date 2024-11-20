import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import LogoImg from '../../android/app/src/img/QQ4.png';
 
const Logo = ({ sliderDisabled, onPress,  headerText }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={sliderDisabled} onPress={onPress}>
        <Image source={LogoImg} style={styles.LogoImg} />
      </TouchableOpacity> 
        <Text style={styles.headerText}>{headerText}</Text> 
    </View>
  );  
}; 

const styles = StyleSheet.create({ 
    container: {
        alignItems: 'center', // Center children horizontally
        justifyContent: 'center', // Center children vertically (if needed)
      },
  LogoImg: {
    width: 170,
    height: 170,
    marginTop: -30,
    marginBottom: -18, 
  },
  headerText: {
    fontSize: 25,
    color: '#74aff7',
    paddingTop: 1,  
  },
});

export default Logo;