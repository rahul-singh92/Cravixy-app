import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    ActivityIndicator,
    StatusBar,
    BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const doodleImage = require('../assets/doodle.png');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Restaurant {
    id: string;
    name: string;
    image: string | number;
    rating: number;
    deliveryTime: string;
    category: string[];
    distance?: string;
}

const INDIAN_LOCATIONS = [
    { name: 'Mumbai, Maharashtra', coords: '19.0760,72.8777' },
    { name: 'Delhi, Delhi', coords: '28.7041,77.1025' },
    { name: 'Bangalore, Karnataka', coords: '12.9716,77.5946' },
    { name: 'Hyderabad, Telangana', coords: '17.3850,78.4867' },
    { name: 'Chennai, Tamil Nadu', coords: '13.0827,80.2707' },
];

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const user = getAuth().currentUser;
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [location] = useState(INDIAN_LOCATIONS[Math.floor(Math.random() * INDIAN_LOCATIONS.length)]);

    // --- ADDED BACKHANDLER TO EXIT APP ---
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp(); // Exits the app instead of going back to Landing
            return true; // Prevents default navigation behavior
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const snapshot = await firestore().collection('restaurants').get();
            
            const restaurantsList: Restaurant[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                restaurantsList.push({
                    id: doc.id,
                    name: data.name || 'Restaurant',
                    image: data.image || doodleImage,
                    rating: data.rating || 4.5,
                    deliveryTime: data.deliveryTime || '30-40 mins',
                    category: Array.isArray(data.category) ? data.category : [data.category || 'Food'],
                    distance: `${Math.floor(Math.random() * 5) + 0.5} km`,
                });
            });
            
            setRestaurants(restaurantsList);
        } catch (error) {
            console.log('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.some((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
        <TouchableOpacity
            style={styles.restaurantCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                />
                <View style={styles.ratingBadge}>
                    <Icon name="star" size={12} color="#f5c518" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Icon name="time-outline" size={14} color="#814c58" />
                        <Text style={styles.infoLabel}>{item.deliveryTime}</Text>
                    </View>
                    <Text style={styles.divider}>•</Text>
                    <View style={styles.infoItem}>
                        <Icon name="navigate-circle-outline" size={14} color="#814c58" />
                        <Text style={styles.infoLabel}>{item.distance}</Text>
                    </View>
                </View>

                <View style={styles.categoriesRow}>
                    {item.category.slice(0, 2).map((cat, idx) => (
                        <View key={idx} style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>{cat}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff4f4" />
            
            {/* Top App Bar */}
            <View style={styles.topBar}>
                <View style={styles.locationInfo}>
                    <Icon name="location" size={24} color="#b6112a" />
                    <View>
                        <Text style={styles.deliverTo}>Deliver to</Text>
                        <Text style={styles.locationName}>{location.name}</Text>
                    </View>
                </View>
                
                <View style={styles.topBarRight}>
                    <Text style={styles.logo}>Cravixy</Text>
                    {user?.photoURL && (
                        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                    )}
                </View>
            </View>

            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting */}
                <View style={styles.section}>
                    <Text style={styles.greeting}>
                        Morning, {user?.displayName?.split(' ')[0] || 'Guest'}.
                    </Text>
                    <Text style={styles.subGreeting}>What's on the menu for today's story?</Text>
                </View>

                {/* Search */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBox}>
                        <Icon name="search" size={20} color="#a06773" style={{ marginRight: 8 }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for dishes, restaurants..."
                            placeholderTextColor="#814c58"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Restaurant Feed Header */}
                <View style={styles.feedHeader}>
                    <Text style={styles.feedTitle}>Curation for You</Text>
                </View>

                {/* Restaurants List */}
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#b6112a" />
                    </View>
                ) : filteredRestaurants.length > 0 ? (
                    <FlatList
                        data={filteredRestaurants}
                        renderItem={renderRestaurantCard}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Icon name="restaurant-outline" size={48} color="#dc9ca8" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyStateText}>No restaurants found</Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Button */}
            <TouchableOpacity style={styles.cartButton}>
                <Icon name="cart" size={24} color="#fff4f4" />
                <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>0</Text>
                </View>
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="restaurant" size={24} color="#b6112a" />
                    <Text style={[styles.navLabel, { color: '#b6112a' }]}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="search" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="receipt-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="person-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff4f4',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: 'rgba(255, 244, 244, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#ffd1d9',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deliverTo: {
        fontSize: 10,
        color: '#814c58',
        fontWeight: '600',
    },
    locationName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#4c212c',
        marginTop: 2,
    },
    topBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        fontSize: 20,
        fontWeight: '900',
        color: '#b6112a',
        fontStyle: 'italic',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffe1e5',
    },
    scrollContent: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    greeting: {
        fontSize: 32,
        fontWeight: '900',
        color: '#4c212c',
        marginBottom: 4,
    },
    subGreeting: {
        fontSize: 16,
        color: '#814c58',
        marginBottom: 16,
    },
    searchSection: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffecee',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#4c212c',
    },
    feedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    feedTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4c212c',
    },
    viewAll: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b6112a',
        textTransform: 'uppercase',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    restaurantCard: {
        marginBottom: 24,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#ffe1e5',
    },
    ratingBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4c212c',
    },
    cardContent: {
        paddingHorizontal: 4,
    },
    restaurantName: {
        fontSize: 20,
        fontWeight: '900',
        color: '#4c212c',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: '#814c58',
        fontWeight: '500',
    },
    divider: {
        color: '#dc9ca8',
        marginHorizontal: 8,
    },
    categoriesRow: {
        flexDirection: 'row',
        gap: 6,
    },
    categoryTag: {
        backgroundColor: '#ffe1e5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    categoryTagText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#b6112a',
        textTransform: 'capitalize',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyState: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#814c58',
        fontWeight: '600',
    },
    cartButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#b6112a',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4c212c',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff4f4',
    },
    cartBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff4f4',
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