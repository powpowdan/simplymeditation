import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import LogoImg from '../../android/app/src/img/QQ4.png';
 
const Logo = ({headerText }) => {
  return (
    <View style={styles.container}> 
        <Image source={LogoImg} style={styles.LogoImg} /> 
        <Text style={styles.headerText}>{headerText}</Text> 
    </View>
  );  
}; 

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoImg: {
    width: width * 0.45,           // 40% of screen width
    height: width * 0.45,          // keep square shape
    marginTop: -height * 0.015,   // ~ -10px on a 670px height screen
    marginBottom: -height * 0.027,// ~ -18px on a 670px height screen
  },
  headerText: {
    fontSize: width * 0.06,       // 6% of screen width
    color: '#74aff7',
    paddingTop: height * 0.002,   // ~1px on 670px height screen
  },
});

export default Logo;