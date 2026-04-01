import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import firestore from '@react-native-firebase/firestore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProp = any;

interface MenuItem {
    id: string;
    name: string;
    category: string;
    price: string | number;
    description?: string;
    image: string;
    rating?: number;
}

interface Restaurant {
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    distance: string;
}

const RestaurantDetailScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp>();
    const { restaurantId } = route.params;

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [categories, setCategories] = useState<string[]>([]);
    const doodleImage = require('../assets/doodle.png');

    useEffect(() => {
        fetchRestaurantAndMenu();
    }, []);

    const fetchRestaurantAndMenu = async () => {
        try {
            setLoading(true);

            // Fetch restaurant details
            const restaurantDoc = await firestore().collection('restaurants').doc(restaurantId).get();
            if (restaurantDoc.exists()) {
                const data = restaurantDoc.data() as any;
                setRestaurant({
                    name: data.name || 'Restaurant',
                    image: data.image || 'https://via.placeholder.com/300',
                    rating: data.rating || 4.5,
                    deliveryTime: data.deliveryTime || '30-40 mins',
                    distance: `${Math.floor(Math.random() * 5) + 0.5} km`,
                });
            }

            // Fetch menu items
            const menuSnapshot = await firestore()
                .collection('restaurants')
                .doc(restaurantId)
                .collection('menu')
                .get();

            const menuList: MenuItem[] = [];
            const categorySet = new Set<string>();

            menuSnapshot.forEach((doc) => {
                const data = doc.data();
                const menuItem: MenuItem = {
                    id: doc.id,
                    name: data.name || 'Menu Item',
                    category: data.category || 'Other',
                    price: data.price || '0',
                    description: data.description || '',
                    image: data.image || 'https://via.placeholder.com/150',
                    rating: data.rating || 4.0,
                };
                menuList.push(menuItem);
                categorySet.add(data.category || 'Other');
            });

            setMenuItems(menuList);
            const sortedCategories = Array.from(categorySet).sort();

            // ADD "All" at first position
            setCategories(['All', ...sortedCategories]);

            // Default selected = All
            setSelectedCategory('All');
        } catch (error) {
            console.log('Error fetching restaurant/menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMenuItems =
        selectedCategory === 'All'
            ? menuItems
            : menuItems.filter((item) => item.category === selectedCategory);

    const renderMenuItem = ({ item }: { item: MenuItem }) => (
        <View style={styles.menuItemCard}>
            <View style={styles.menuItemContent}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                {item.description && (
                    <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
                )}
                <View style={styles.menuItemFooter}>
                    <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Image
                source={
                    item.image
                        ? { uri: item.image }
                        : doodleImage
                }
                defaultSource={doodleImage}
                style={styles.menuItemImage}
                resizeMode="cover"
            />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#b6112a" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

            {/* Top App Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Cravixy</Text>
                <View style={styles.topBarActions}>
                    <TouchableOpacity>
                        <Text style={styles.iconButton}>🔍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.iconButton}>❤️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Image Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={
                            restaurant?.image
                                ? { uri: restaurant.image }
                                : doodleImage
                        }
                        defaultSource={doodleImage}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                        <View style={styles.heroInfo}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingBadgeText}>⭐ {restaurant?.rating}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoText}>⏱ {restaurant?.deliveryTime}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoText}>📍 {restaurant?.distance}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Category Tabs */}
                <View style={styles.categoryTabs}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContent}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryTab,
                                    selectedCategory === category && styles.categoryTabActive,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text
                                    style={[
                                        styles.categoryTabText,
                                        selectedCategory === category && styles.categoryTabTextActive,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Menu Section Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{selectedCategory}</Text>
                </View>

                {/* Menu Items Grid */}
                {filteredMenuItems.length > 0 ? (
                    <View style={styles.menuItemsContainer}>
                        <FlatList
                            data={filteredMenuItems}
                            renderItem={renderMenuItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.menuItemsList}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No items in this category</Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Bar */}
            <View style={styles.cartBar}>
                <View style={styles.cartBarContent}>
                    <View>
                        <Text style={styles.cartBarLabel}>Your Selection</Text>
                        <Text style={styles.cartBarItems}>View Cart (0 items)</Text>
                    </View>
                    <View style={styles.cartBarRight}>
                        <Text style={styles.cartBarPrice}>₹0</Text>
                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff4f4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff4f4',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: 'rgba(255, 244, 244, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#ffd1d9',
    },
    backButton: {
        fontSize: 28,
        color: '#b6112a',
        fontWeight: 'bold',
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#b6112a',
        fontStyle: 'italic',
    },
    topBarActions: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        fontSize: 20,
    },
    scrollContent: {
        flex: 1,
        paddingBottom: 100,
    },
    heroSection: {
        position: 'relative',
        height: 280,
        marginBottom: 16,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffe1e5',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(76, 33, 44, 0.4)',
    },
    heroContent: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    restaurantName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 12,
    },
    heroInfo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    ratingBadge: {
        backgroundColor: '#b6112a',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    ratingBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    infoItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    infoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    categoryTabs: {
        backgroundColor: 'rgba(255, 244, 244, 0.9)',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffd1d9',
    },
    tabsContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#ffd1d9',
    },
    categoryTabActive: {
        backgroundColor: '#b6112a',
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#814c58',
    },
    categoryTabTextActive: {
        color: '#fff',
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ffe1e5',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4c212c',
    },
    menuItemsContainer: {
        paddingHorizontal: 16,
    },
    menuItemsList: {
        gap: 16,
        paddingBottom: 16,
    },
    menuItemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: 12,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#ffe1e5',
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4c212c',
        marginBottom: 4,
    },
    menuItemDesc: {
        fontSize: 12,
        color: '#814c58',
        marginBottom: 8,
    },
    menuItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#b6112a',
    },
    addButton: {
        backgroundColor: '#ffd1d9',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#b6112a',
    },
    menuItemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#ffe1e5',
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
    cartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 244, 244, 0.95)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#ffd1d9',
    },
    cartBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartBarLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#814c58',
        textTransform: 'uppercase',
    },
    cartBarItems: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4c212c',
        marginTop: 2,
    },
    cartBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cartBarPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: '#b6112a',
    },
    checkoutButton: {
        backgroundColor: '#b6112a',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
