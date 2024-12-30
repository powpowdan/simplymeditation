import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import LogoImg from '../../android/app/src/img/QQ4.png';
 
const Logo = ({headerText }) => {
  return (
    <View style={styles.container}> 
        <Image source={LogoImg} style={styles.LogoImg} /> 
        <Text style={styles.headerText}>{headerText}</Text> 
    </View>
  );  
}; 

const styles = StyleSheet.create({ 
    container: {
        alignItems: 'center', 
        justifyContent: 'center', 
      },
  LogoImg: {
    width: 170,
    height: 170,
    marginTop: -10,
    marginBottom: -18, 
  },
  headerText: {
    fontSize: 25,
    color: '#74aff7',
    paddingTop: 1,  
  },
});

export default Logo;