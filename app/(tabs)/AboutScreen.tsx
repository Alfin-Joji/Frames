import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const AboutScreen = () => {
  const handleLinkedInLink = () => {
    Linking.openURL('https://www.linkedin.com/in/alfin-joji-736068228/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About Developer</Text>
      <Text style={styles.content}>Developer Name: Alfin Joji</Text>
      <Text style={styles.content}>
        LinkedIn:{' '}</Text>
        <Text style={styles.link} onPress={handleLinkedInLink}>
          https://www.linkedin.com/in/alfin-joji-736068228/
        </Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default AboutScreen;
