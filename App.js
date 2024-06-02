import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

// Routes
import Routes from './src/routes';

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#000"} />
      <Routes />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#283747'
  },

});

