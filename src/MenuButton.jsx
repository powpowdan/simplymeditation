import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

const MenuButton = ({ onPress }) => {
  return (
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
      <Item
        title="Menu"
        iconName="ios-menu"
        onPress={onPress}
      />
    </HeaderButtons>
  );
};

const CustomHeaderButton = (props) => (
  <TouchableOpacity
    {...props}
    style={styles.button}
    onPress={props.onPress}
  />
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default MenuButton;
