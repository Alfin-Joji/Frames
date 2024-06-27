import { Entypo } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import UploadImage from './(tabs)/UploadImage';
import HomeScreen from './(tabs)/index';
import SearchScreen from './(tabs)/SearchScreen';
import AboutScreen from './(tabs)/AboutScreen';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { MaterialIcons } from '@expo/vector-icons';

import { responsiveWidth, normalize } from './utils/responsive'; 
import theme from './utils/theme'; 

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const DrawerContent = ({ navigation }: { navigation: any }) => (
  <DrawerContentScrollView>
    <DrawerItem label="Home" onPress={() => navigation.navigate('Home')} />
    <DrawerItem label="Upload Image" onPress={() => navigation.navigate('UploadImage')} />
    <DrawerItem label="Search" onPress={() => navigation.navigate('Search')} />
    <DrawerItem label="About" onPress={() => navigation.navigate('About')} />
  </DrawerContentScrollView>
);
const Drawer = createDrawerNavigator();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'FRAMES',
            headerStyle: { backgroundColor: '#ffffff' }, 
            headerTintColor: '#000000', 
            headerTitleStyle: { 
              fontWeight: 'bold', 
              fontSize: normalize(25),
              marginLeft: responsiveWidth(10), 
            },
          }}
        >
          {() => (
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: theme.colors.primary, 
                tabBarInactiveTintColor: theme.colors.secondary, 
                tabBarLabelStyle: { fontSize: theme.fontSizes.small }, 
                tabBarStyle: { backgroundColor: theme.colors.background }, 
              }}
            >
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
              />
              <Tab.Screen
                name="UploadImage"
                component={UploadImage}
                options={{
                  title: 'UploadImage',
                  tabBarIcon: ({ color }) => <Entypo name="upload" size={24} color={color} />,
                }}
              />
              <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                  title: 'Search',
                  tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
                }}
              />
              <Tab.Screen
                name="About"
                component={AboutScreen}
                options={{
                  title: 'About',
                  tabBarIcon: ({ color }) => <MaterialIcons name="people-alt" size={24} color={color} />,
                }}
              />
            </Tab.Navigator>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </ThemeProvider>
  );
};

export default RootLayout;
