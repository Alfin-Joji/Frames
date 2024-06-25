import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const WelcomeScreen = () => {
  useEffect(() => {
    // Add any initialization logic or async tasks here
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Text
        animation="fadeIn"
        duration={2500}
        style={styles.welcomeText}
      >
        Welcome to &nbsp;&nbsp;&nbsp;Frames👋
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 44,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
