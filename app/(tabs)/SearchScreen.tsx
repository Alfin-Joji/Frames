import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import axios from 'axios';
import { Feather, AntDesign } from '@expo/vector-icons';

interface Photo {
  id: string;
  url_s: string;
  title: string;
}

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim() !== '') {
        searchPhotos(query);
      } else {
        setPhotos([]);
      }
    }, 400);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  useEffect(() => {
 
    const savedHistory = ['Nature', 'Technology', 'Travel']; 
    setSearchHistory(savedHistory);
  }, []);

  const addToHistory = (searchTerm: string) => {
    if (!searchHistory.includes(searchTerm)) {
      const updatedHistory = [...searchHistory, searchTerm];
      setSearchHistory(updatedHistory);
      
    }
  };

  const removeFromHistory = (searchTerm: string) => {
    const updatedHistory = searchHistory.filter(item => item !== searchTerm);
    setSearchHistory(updatedHistory);
  
  };

  const searchPhotos = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s,title&text=${searchQuery}`
      );
      if (response.data.photos && response.data.photos.photo) {
        // Filter photos by checking if the title contains the search query
        const filteredPhotos = response.data.photos.photo.filter((photo: Photo) =>
          photo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPhotos(filteredPhotos);
      } else {
        setPhotos([]);
      }
      addToHistory(searchQuery); 
    } catch (error) {
      console.error('Error searching photos from API:', error);
      setPhotos([]);
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const handleRemoveFromHistory = (searchTerm: string) => {
    removeFromHistory(searchTerm);
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity onPress={() => handlePhotoPress(item)} style={styles.photoContainer}>
      <Image source={{ uri: item.url_s }} style={styles.photo} />
    </TouchableOpacity>
  );

  const renderSearchHistoryItem = ({ item }: { item: string }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity onPress={() => {
        setQuery(item);
        searchPhotos(item);
      }}>
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRemoveFromHistory(item)}>
        <AntDesign name="closecircle" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search photos..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {query.trim() === '' && searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Search History</Text>
          <FlatList
            data={searchHistory}
            renderItem={renderSearchHistoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
      {query.trim() !== '' && photos.length > 0 && (
        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      {selectedPhoto && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedPhoto.url_s }} style={styles.modalPhoto} />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
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
  historyContainer: {
    width: '80%',
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  historyText: {
    fontSize: 16,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  modalPhoto: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default SearchScreen;
