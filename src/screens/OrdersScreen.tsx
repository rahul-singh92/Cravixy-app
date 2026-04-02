import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const orders = [
  {
    id: '1',
    restaurant: 'Burger Hub',
    items: 'Cheese Burger, Fries',
    price: '₹220',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
    date: '2 Apr 2026',
  },
  {
    id: '2',
    restaurant: 'Pizza Palace',
    items: 'Pepperoni Pizza',
    price: '₹450',
    image: 'https://images.unsplash.com/photo-1601924582975-7e2b8c7c3c92',
    date: '1 Apr 2026',
  },
  {
    id: '3',
    restaurant: 'Biryani House',
    items: 'Chicken Biryani',
    price: '₹300',
    image: 'https://images.unsplash.com/photo-1604908176997-431b8d1d2f83',
    date: '30 Mar 2026',
  },
  {
    id: '4',
    restaurant: 'Healthy Bowl',
    items: 'Veg Salad Bowl',
    price: '₹180',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    date: '28 Mar 2026',
  },
];


const OrdersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.restaurant}>{item.restaurant}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        <Text style={styles.items}>{item.items}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{item.price}</Text>

          <TouchableOpacity style={styles.reorderBtn}>
            <Text style={styles.reorderText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="restaurant" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
          <Text style={styles.navLabel}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="receipt-outline" size={24} color="#b6112a" />
          <Text style={[styles.navLabel, { color: '#b6112a' }]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4f4',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4c212c',
    marginVertical: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffecee',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  restaurant: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4c212c',
  },
  date: {
    fontSize: 12,
    color: '#814c58',
  },
  items: {
    fontSize: 13,
    color: '#814c58',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#b6112a',
  },
  reorderBtn: {
    backgroundColor: '#ffd1d9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reorderText: {
    color: '#b6112a',
    fontWeight: '700',
    fontSize: 12,
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