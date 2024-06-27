import React from 'react';
import { View, Text, StyleSheet, Linking, ImageBackground } from 'react-native';

const AboutScreen = () => {
  const handleLinkedInLink = () => {
    Linking.openURL('https://www.linkedin.com/in/alfin-joji-736068228/');
  };

  const handleGitHubLink = () => {
    Linking.openURL('https://github.com/Alfin-Joji');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpapers.com/images/high/programming-iphone-orange-self-code-bd86goc4fhvenj72.webp ' }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>About Developer</Text>
          <Text style={styles.content}>Alfin Joji</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} onPress={handleLinkedInLink}>
              LinkedIn Profile
            </Text>
            <Text style={styles.linkText} onPress={handleGitHubLink}>
              GitHub Profile
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: 'rgba(230, 230, 230, 0.8)',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
  content: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
  },
  linkContainer: {
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default AboutScreen;
