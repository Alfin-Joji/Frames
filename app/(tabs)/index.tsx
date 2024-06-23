import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Photo {
  id: string;
  url_s: string;
}

const HomeScreen = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCachedPhotos();
  }, []);

  const fetchCachedPhotos = async () => {
    try {
      const cachedPhotos = await AsyncStorage.getItem('cachedPhotos');
      if (cachedPhotos) {
        setPhotos(JSON.parse(cachedPhotos));
      } else {
        fetchPhotos();
      }
    } catch (error) {
      console.error('Error fetching cached photos:', error);
      fetchPhotos();
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(
        'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
      );
      const fetchedPhotos = response.data.photos.photo;
      setPhotos(fetchedPhotos);
      AsyncStorage.setItem('cachedPhotos', JSON.stringify(fetchedPhotos));
    } catch (error) {
      console.error('Error fetching photos from API:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.url_s }} style={styles.photo} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FRAMES</Text>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    alignItems: 'center', 
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  flatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    margin: 5,
    alignItems: 'center', 
  },
  photo: {
    width: 150,
    height: 150,
    resizeMode: 'cover', 
    borderRadius: 10, 
  },
});

export default HomeScreen;
