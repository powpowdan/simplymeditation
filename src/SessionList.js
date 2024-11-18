import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SessionContext } from './SessionContext'; // Import the SessionContext

const SessionList = () => {
  const { totalTimeMeditated } = useContext(SessionContext); // Get the totalTimeMeditated from the context

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Full time meditated: {totalTimeMeditated} Minutes</Text>
      {/* Render other session duration items here using FlatList */}
    </View>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121', // Dark background color
  },
  headerText: {
    fontSize: 24,
    color: '#74aff7', // Light text color
    paddingTop: 1,
    paddingLeft: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  durationText: {
    color: '#ededed', // Light text color
    fontSize: 18,
    marginBottom: 5,
  },
});

export default SessionList;
