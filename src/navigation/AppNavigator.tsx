import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';

import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        
        // Check auth state on app start
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserExists(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#b6112a" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userExists ? (
                    // User is logged in - show all screens with Home as first
                    <>
                        <Stack.Screen 
                            name="Landing" 
                            children={() => <LandingScreen isCheckingAuth={true} />}
                        />
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                    </>
                ) : (
                    // User is not logged in - show auth screens
                    <>
                        <Stack.Screen 
                            name="Landing" 
                            children={() => <LandingScreen isCheckingAuth={false} />}
                        />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
                        <Stack.Screen name="Search" component={SearchScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;