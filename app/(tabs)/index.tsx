import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

interface Photo {
  id: string;
  url_s: string;
}

const categories = ['All', 'Animals', 'Cars', 'People'];

const HomeScreen = () => {
  const [photos, setPhotos] = useState<Record<number, Photo[]>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(100);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCachedPhotos(page, selectedCategory);
  }, [page, selectedCategory]);

  const fetchCachedPhotos = async (page: number, category: string) => {
    try {
      const cachedPhotos = await AsyncStorage.getItem(`cachedPhotos-${category}-page-${page}`);
      if (cachedPhotos) {
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [page]: JSON.parse(cachedPhotos),
        }));
      } else {
        fetchPhotos(page, category);
      }
    } catch (error) {
      console.error('Error fetching cached photos:', error);
      fetchPhotos(page, category);
    }
  };

  const fetchPhotos = async (page: number, category: string) => {
    try {
      setLoading(true);
      const method = category === 'All' ? 'flickr.photos.getRecent' : 'flickr.photos.search';
      const categoryQuery = category === 'All' ? '' : `&tags=${category.toLowerCase()}`;
      const response = await axios.get(
        `https://api.flickr.com/services/rest/?method=${method}&per_page=20&page=${page}&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s${categoryQuery}`
      );
      
      if (response.data && response.data.photos && response.data.photos.photo) {
        const fetchedPhotos = response.data.photos.photo;
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [page]: fetchedPhotos,
        }));
        AsyncStorage.setItem(`cachedPhotos-${category}-page-${page}`, JSON.stringify(fetchedPhotos));
        setTotalPages(response.data.photos.pages || totalPages);
      } else {
        console.error('Unexpected response structure', response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching photos from API:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const downloadImage = async (photo: Photo) => {
    try {
      const { uri } = await FileSystem.downloadAsync(
        photo.url_s,
        `${FileSystem.documentDirectory}${photo.id}.jpg`
      );
      await AsyncStorage.setItem(`downloadedImage-${photo.id}`, uri);
      console.log('Image downloaded:', uri);
      alert('Image downloaded and saved successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(startPage + 2, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={[
            styles.pageButton,
            page === i && styles.selectedPageButton,
          ]}
        >
          <Text style={page === i ? styles.selectedPageText : styles.pageText}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.pagination}>
        {page > 1 && (
          <TouchableOpacity onPress={() => handlePageChange(page - 1)} style={styles.iconButton}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
        )}
        {pageButtons}
        {page < totalPages && (
          <TouchableOpacity onPress={() => handlePageChange(page + 1)} style={styles.iconButton}>
            <AntDesign name="right" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDownloadButton = () => (
    <TouchableOpacity onPress={() => downloadImage(selectedPhoto!)} style={styles.downloadButtonModal}>
      <Text style={styles.downloadButtonText}>Download</Text>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <Image source={{ uri: selectedPhoto?.url_s }} style={styles.modalPhoto} />
      {/* {renderDownloadButton()} */}
    </View>
  );

  const renderCategoryBubbles = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.categoryContainer, { height: 40 }]}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryBubble,
            selectedCategory === category && styles.selectedCategoryBubble,
          ]}
          onPress={() => {
            setSelectedCategory(category);
            setPage(1); 
          }}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {renderCategoryBubbles()}
      <FlatList
        data={photos[page] || []}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePhotoPress(item)} style={styles.photoContainer}>
            <Image source={{ uri: item.url_s }} style={styles.photo} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={Dimensions.get('window').width > 600 ? 4 : 2} 
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={renderPaginationButtons}
        onEndReachedThreshold={0.5}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          {renderModalContent()}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryBubble: {
    marginHorizontal: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryBubble: {
    backgroundColor: 'black',
  },
  categoryText: {
    fontSize: 16,
    color: 'black',
  },
  selectedCategoryText: {
    color: 'white',
  },
  flatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    margin: 5,
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: Dimensions.get('window').width > 600 ? 150 : Dimensions.get('window').width / 2 - 20,
    height: Dimensions.get('window').width > 600 ? 150 : Dimensions.get('window').width / 2 - 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  downloadButtonModal: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pageButton: {
    marginHorizontal: 6,
    padding: 10,
    borderRadius: 5,
  },
  selectedPageButton: {
    backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 1,
  },
  pageText: {
    fontSize: 16,
    color: 'black',
  },
  selectedPageText: {
    fontSize: 16,
    color: 'white',
  },
  iconButton: {
    marginHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPhoto: {
    width: Dimensions.get('window').width > 600 ? 300 : Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width > 600 ? 300 : Dimensions.get('window').width - 40,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default HomeScreen;
