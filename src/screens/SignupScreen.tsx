import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignupScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '479173921547-6ar08994r6bjrfjan4mo6ro8a9epv355.apps.googleusercontent.com',
        });

        const backAction = () => {
            navigation.navigate('Landing');
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            const idToken = userInfo.data?.idToken;

            if (!idToken) throw new Error('No ID token');

            const authInstance = getAuth();

            const googleCredential = GoogleAuthProvider.credential(idToken);

            const userCredential = await signInWithCredential(authInstance, googleCredential);

            console.log('User:', {
                name: userCredential.user.displayName,
                email: userCredential.user.email,
                uid: userCredential.user.uid,
            });

            navigation.navigate('Home');

        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.logo}>Cravixy</Text>
                    <Text style={styles.tagline}>CULINARY JOURNEY BEGINS</Text>
                </View>

                {/* CARD */}
                <View style={styles.card}>

                    {/* TITLE */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Create Account</Text>
                        <View style={styles.line} />
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>

                        {/* NAME */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter your name"
                                    placeholderTextColor="#81485880"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* EMAIL */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="name@example.com"
                                    placeholderTextColor="#81485880"
                                    keyboardType="email-address"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* PHONE */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="+91 9876543210"
                                    placeholderTextColor="#81485880"
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* PASSWORD */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor="#81485880"
                                    secureTextEntry
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* TERMS */}
                        <TouchableOpacity
                            style={styles.termsRow}
                            onPress={() => setTermsAccepted(!termsAccepted)}
                        >
                            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.termsText}>
                                I agree to the <Text style={styles.link}>Terms</Text> and{' '}
                                <Text style={styles.link}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>

                        {/* BUTTON */}
                        <TouchableOpacity
                            style={styles.primaryBtn}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.btnText}>Sign Up</Text>
                        </TouchableOpacity>

                        {/* LOGIN LINK */}
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                            <Text
                                onPress={() => navigation.navigate('Login')}
                                style={styles.link}
                            >
                                Log In
                            </Text>
                        </Text>

                    </View>

                    {/* DIVIDER */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR REGISTER WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* SOCIAL BUTTON */}
                    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={handleGoogleSignIn}>
                        <Image
                            source={require('../assets/google-logo.png')}
                            style={styles.googleLogo}
                        />
                        <Text style={styles.socialBtnText}>Continue with Google</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff4f4',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },

    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 42,
        fontWeight: '900',
        color: '#b6112a',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 10,
        fontWeight: '700',
        color: '#814c58',
        marginTop: 4,
        letterSpacing: 1.5,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ffd1d9',
    },

    titleSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#4c212c',
        marginBottom: 8,
    },
    line: {
        width: 48,
        height: 3,
        backgroundColor: '#b6112a',
        borderRadius: 1.5,
    },

    form: {
        marginBottom: 20,
    },

    inputGroup: {
        marginBottom: 16,
    },

    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#814c58',
        marginBottom: 6,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    inputWrapper: {
        borderRadius: 12,
        backgroundColor: '#ffecee',
        overflow: 'hidden',
    },

    input: {
        padding: 14,
        fontSize: 14,
        color: '#4c212c',
        fontWeight: '500',
    },

    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 12,
        marginBottom: 20,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#dc9ca8',
        borderRadius: 4,
        marginRight: 10,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkboxChecked: {
        backgroundColor: '#b6112a',
        borderColor: '#b6112a',
    },

    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    termsText: {
        flex: 1,
        fontSize: 13,
        color: '#814c58',
        fontWeight: '500',
        lineHeight: 20,
    },

    link: {
        color: '#b6112a',
        fontWeight: '700',
    },

    primaryBtn: {
        backgroundColor: '#b6112a',
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#b6112a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },

    btnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },

    loginText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#814c58',
        fontWeight: '500',
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ffd1d9',
    },

    dividerText: {
        marginHorizontal: 10,
        fontSize: 10,
        color: '#814c5880',
        fontWeight: '700',
        letterSpacing: 1,
    },

    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffecee',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
    },

    googleLogo: {
        width: 20,
        height: 20,
    },

    socialBtnText: {
        color: '#4c212c',
        fontWeight: '600',
        fontSize: 14,
    },
});