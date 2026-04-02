import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// ✅ Navigation typing FIX
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Restaurant {
    id: string;
    name: string;
    menu?: { name: string; price: number }[];
}

const SearchScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [query, setQuery] = useState('');
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [results, setResults] = useState<Restaurant[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // 🔹 Load data
    useEffect(() => {
        fetchRestaurants();
        loadRecentSearches();
    }, []);

    // 🔹 Fetch restaurants
    const fetchRestaurants = async () => {
        try {
            const snapshot = await firestore().collection('restaurants').get();

            const list: Restaurant[] = [];
            snapshot.forEach(doc => {
                list.push({
                    id: doc.id,
                    ...(doc.data() as any),
                });
            });

            setRestaurants(list);
        } catch (err) {
            console.log('Error fetching:', err);
        }
    };

    // 🔹 Load recent searches
    const loadRecentSearches = async () => {
        try {
            const data = await AsyncStorage.getItem('recentSearches');
            if (data) setRecentSearches(JSON.parse(data));
        } catch (err) {
            console.log(err);
        }
    };

    // 🔹 Save search
    const saveRecentSearch = async (text: string) => {
        try {
            let updated = [text, ...recentSearches.filter(i => i !== text)];
            updated = updated.slice(0, 3); // only 3 items

            setRecentSearches(updated);
            await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
        } catch (err) {
            console.log(err);
        }
    };

    // 🔹 Clear history
    const clearRecent = async () => {
        setRecentSearches([]);
        await AsyncStorage.removeItem('recentSearches');
    };

    // 🔹 Search logic
    const handleSearch = (text: string) => {
        setQuery(text);

        if (!text) {
            setResults([]);
            return;
        }

        const lower = text.toLowerCase();

        const filtered = restaurants.filter(rest => {
            // Restaurant name match
            if (rest.name?.toLowerCase().includes(lower)) return true;

            // Menu match
            if (rest.menu) {
                return rest.menu.some(item =>
                    item.name.toLowerCase().includes(lower)
                );
            }

            return false;
        });

        setResults(filtered);
    };

    // 🔹 Select recent search
    const onSelectSearch = (text: string) => {
        setQuery(text);
        handleSearch(text);
    };

    // 🔹 Navigate to restaurant
    const onRestaurantPress = (id: string, name: string) => {
        saveRecentSearch(name);
        navigation.navigate('RestaurantDetail', { restaurantId: id });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff4f4" />

            {/* 🔍 Search Bar */}
            <View style={styles.searchBox}>
                <Icon name="search" size={20} color="#a06773" />
                <TextInput
                    placeholder="What are you craving?"
                    placeholderTextColor="#814c58"
                    value={query}
                    onChangeText={handleSearch}
                    style={styles.input}
                />
            </View>

            {/* 🕘 Recent Searches */}
            {!query && recentSearches.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.title}>Recent Searches</Text>
                        <TouchableOpacity onPress={clearRecent}>
                            <Text style={styles.clear}>Clear All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chips}>
                        {recentSearches.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.chip}
                                onPress={() => onSelectSearch(item)}
                            >
                                <Icon name="time-outline" size={14} color="#814c58" />
                                <Text style={styles.chipText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* 🔥 Results */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => onRestaurantPress(item.id, item.name)}
                    >
                        <Text style={styles.resultText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    query ? (
                        <Text style={styles.empty}>No results found</Text>
                    ) : null
                }
            />
            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {/* Explore */}
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon name="restaurant" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>

                {/* Search (ACTIVE) */}
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="search" size={24} color="#b6112a" />
                    <Text style={[styles.navLabel, { color: '#b6112a' }]}>Search</Text>
                </TouchableOpacity>

                {/* Orders */}
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="receipt-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Orders</Text>
                </TouchableOpacity>

                {/* Profile */}
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="person-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff4f4',
        padding: 16,
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffecee',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        color: '#4c212c',
    },

    section: {
        marginTop: 24,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#4c212c',
    },

    clear: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b6112a',
    },

    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffd9df',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },

    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4c212c',
    },

    resultItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#ffd1d9',
    },

    resultText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4c212c',
    },

    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#814c58',
        fontWeight: '600',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 244, 244, 0.95)',
        height: 70,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ffd1d9',
    },

    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },

    navLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4c212c',
        opacity: 0.6,
    },
});