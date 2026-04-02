import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = getAuth().currentUser;

  const handleLogout = async () => {
    try {
      await getAuth().signOut();
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: user?.photoURL || 'https://i.pravatar.cc/150',
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>
            {user?.displayName || 'Guest User'}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.menu}>
          <MenuItem icon="location-outline" text="My Addresses" />
          <MenuItem icon="card-outline" text="Payments" />
          <MenuItem icon="heart-outline" text="Favorites" />
          <MenuItem icon="settings-outline" text="Settings" />

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="log-out-outline" size={20} color="#b6112a" />
            <Text style={[styles.menuText, { color: '#b6112a' }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
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

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Orders')}
        >
          <Icon name="receipt-outline" size={24} color="#4c212c" style={{ opacity: 0.6 }} />
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#b6112a" />
          <Text style={[styles.navLabel, { color: '#b6112a' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, text }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <Icon name={icon} size={20} color="#4c212c" />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4f4',
  },

  header: {
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4c212c',
  },

  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4c212c',
  },

  email: {
    fontSize: 14,
    color: '#814c58',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },

  statCard: {
    backgroundColor: '#ffecee',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '40%',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#b6112a',
  },

  statLabel: {
    fontSize: 12,
    color: '#814c58',
  },

  menu: {
    backgroundColor: '#ffecee',
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4c212c',
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