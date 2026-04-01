import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    Image,
    BackHandler,
    ActivityIndicator,
} from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LandingScreenProps {
    isCheckingAuth?: boolean;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ isCheckingAuth = false }) => {
    const navigation = useNavigation<NavigationProp>();
    
    useEffect(() => {
        if (isCheckingAuth) {
            const timer = setTimeout(() => {
                navigation.navigate('Home');
            }, 2500);
            
            return () => clearTimeout(timer);
        }
    }, [isCheckingAuth, navigation]);
    
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };
        
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        
        return () => backHandler.remove();
    }, []);
    
    const avatarImages = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBjPzlcuN7tfhfivbx0gBLVht8UiI3R14SG4hM8rso1aphFapmki1VveuPmULbk0K4HxOvplCLN2z2_C1oxj0U2xxY6hIPkJ6svkbthcbmbaVpdn1phpn1nGFlvsydhSTrAHQXEyESBW0fIU1-paiBbk2SSMT7HNvv6QPsENeBgOk9QdUxD5bgElmZkRhqaVeyHx-g0PtoSILr1KmSH9E9fkDyuv_2AUBfVw6-_il8LHJ8KIxn0s5nTvjL9zoFDWsllH4s97_efzKU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBcp0Vuvj94W4HObhMzDMbDskUddLh7r1DBFZvH3p8TtHr5oP2gixGkJKA-yeJkiPIAK-l3UcrfXARfz0_lWuay94ss0Dmi_aL8K3yJ7Ik0VSOcKrsNkfkOWRQ8cNDbjl6QCLELdNLx2WmStJX0UIZxVanK8MUCuV9Y5VMmcRgn09u7crFkFwW2StTOuLqBydXA4dg0_55B0T8rK6VRiP0nBN1i3R5soTrkpV6tVMM7XlNSgHss_AYuDvg-_Ijb7fWvw-fBdopXslw',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASyd2TY4xikboG2nnfhWAiO2pTTOf9Z88bUcrOsg1QliT39U-wZcwpjXoIldea0mJR0nfDHUg4nqpjgGpi1lEOy0SVJqYZLGgMlohTsK1SqKqzQ94iwkBQ-bGrCqU3SvLpHXbJXemeeVagCcgF88UVHES_ZI3xh2EFxME8JfQCTKlMhlqQfFX6n3IQ9FQd-AjvbPCdTsktO8S9qdYDosWwXpRKhg7TNXuALlYAsh3DwDbxBZLo94gLUHy5PSHKClg1mQXXKt8yC-w'
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ImageBackground
                source={require('../assets/landing_page_image.png')}
                style={styles.background}
                resizeMode="cover"
            >
                {/* Gradient Overlay */}
                <View style={styles.overlay} />

                {/* Decorative Blur Circles */}
                <View style={[styles.blurCircle, styles.blurCircleTopLeft]} />
                <View style={[styles.blurCircle, styles.blurCircleBottomRight]} />

                {/* TOP LOGO */}
                <View style={styles.header}>
                    <Text style={styles.logo}>Cravixy</Text>
                    <View style={styles.line} />
                </View>

                {/* CENTER CONTENT */}
                <View style={styles.content}>
                    <Text style={styles.title}>
                        Your favorite meals{'\n'}delivered fast
                    </Text>

                    <Text style={styles.subtitle}>
                        Explore thousands of local restaurants and get your cravings satisfied in minutes.
                    </Text>

                    {/* Buttons Container */}
                    <View style={styles.buttonContainer}>
                        {isCheckingAuth ? (
                            <View style={styles.loaderContainer}>
                                <ActivityIndicator 
                                    size="large" 
                                    color="#b6112a" 
                                />
                                <Text style={styles.loaderText}>Setting up your account...</Text>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity 
                                    style={styles.primaryBtn}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Signup')}
                                >
                                    <Text style={styles.btnText}>Get Started</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.glassBtn}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.btnText}>Sign In</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* User Avatars Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {avatarImages.map((uri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={[
                                        styles.avatar,
                                        { marginLeft: index > 0 ? -12 : 0 }
                                    ]}
                                />
                            ))}
                        </View>
                        <Text style={styles.footerText}>Join 50k+ foodies</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default LandingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'space-between',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    // Decorative Blur Circles
    blurCircle: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.15,
    },
    blurCircleTopLeft: {
        width: 200,
        height: 200,
        backgroundColor: '#b6112a',
        top: -50,
        left: -50,
    },
    blurCircleBottomRight: {
        width: 250,
        height: 250,
        backgroundColor: '#b6112a',
        bottom: -100,
        right: -100,
    },

    header: {
        alignItems: 'center',
        marginTop: 80,
        zIndex: 10,
    },
    logo: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: -1.5,
    },
    line: {
        width: 50,
        height: 4,
        backgroundColor: '#b6112a',
        marginTop: 10,
        borderRadius: 10,
    },

    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50,
        zIndex: 10,
    },
    title: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 28,
        lineHeight: 24,
        fontWeight: '500',
    },

    buttonContainer: {
        width: '100%',
        maxWidth: 320,
        gap: 12,
        marginBottom: 28,
    },

    primaryBtn: {
        backgroundColor: '#b6112a',
        paddingVertical: 16,
        borderRadius: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },

    glassBtn: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 28,
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },

    btnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        gap: 8,
        opacity: 0.8,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#4c212c',
    },
    footerText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        gap: 16,
    },
    loaderText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
    },
});
