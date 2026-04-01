import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';

const HomeScreen = () => {
    const user = getAuth().currentUser;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome 🎉</Text>
            <Text>{user?.displayName}</Text>
            <Text>{user?.email}</Text>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});