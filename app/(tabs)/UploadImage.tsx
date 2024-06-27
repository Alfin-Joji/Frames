import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const UploadImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [viewImage, setViewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchStoredImages();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    if (!image) return;

    try {
      const storedImages = await AsyncStorage.getItem('storedImages');
      const imagesArray = storedImages ? JSON.parse(storedImages) : [];
      imagesArray.push(image);
      await AsyncStorage.setItem('storedImages', JSON.stringify(imagesArray));
      setImage(null);
      fetchStoredImages();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const fetchStoredImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem('storedImages');
      const imagesArray = storedImages ? JSON.parse(storedImages) : [];
      setImages(imagesArray);
    } catch (error) {
      console.error('Error fetching stored images:', error);
    }
  };

  const deleteImage = async (index: number) => {
    try {
      const storedImages = await AsyncStorage.getItem('storedImages');
      let imagesArray: string[] = storedImages ? JSON.parse(storedImages) : [];

      imagesArray = imagesArray.filter((_, i) => i !== index);

      await AsyncStorage.setItem('storedImages', JSON.stringify(imagesArray));
      fetchStoredImages(); 
      setViewImage(null); 
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const openImageView = (img: string) => {
    setViewImage(img);
  };

  const closeImageView = () => {
    setViewImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Images</Text>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity onPress={saveImage} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Image</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.gridContainer}>
          {/* Display images fetched from AsyncStorage */}
          {images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => openImageView(img)} style={styles.gridItem}>
              <Image source={{ uri: img }} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal visible={!!viewImage} transparent={true} onRequestClose={closeImageView}>
        <View style={styles.modalContainer}>
          {viewImage && (
            <>
              <Image source={{ uri: viewImage }} style={styles.modalImage} resizeMode="contain" />
              <TouchableOpacity onPress={closeImageView} style={styles.closeButton}>
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteImage(images.indexOf(viewImage))} style={styles.deleteButton}>
                <AntDesign name="delete" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    margin: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: Dimensions.get('window').width / 3 - 20,
    height: Dimensions.get('window').width / 3 - 20,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 80,
    width: 100,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '95%',
    height: '95%',
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
});

export default UploadImage;
