import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from '@react-native-firebase/auth';
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

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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

            const user = userCredential.user;

            console.log('User:', {
                name: user.displayName,
                email: user.email,
            });

            navigation.navigate('Home'); // ✅ go to Home

        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleLogin = async () => {
        if (loading) return;

        setLoading(true);

        try {
            if (!email || !password) {
                throw new Error('Enter email and password');
            }

            const authInstance = getAuth();

            await signInWithEmailAndPassword(
                authInstance,
                email,
                password
            );

            navigation.navigate('Home');

        } catch (error: any) {
            setErrorMsg(error.message || 'Login Failed');
            setTimeout(() => setErrorMsg(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {errorMsg ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            ) : null}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.logo}>Cravixy</Text>
                    <Text style={styles.tagline}>CULINARY JOURNEY BEGINS</Text>
                </View>

                {/* CARD */}
                <View style={styles.card}>

                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Log In</Text>
                        <View style={styles.line} />
                    </View>

                    {/* INPUTS */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="name@example.com"
                                placeholderTextColor="#81485880"
                                style={styles.input}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Password</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgot}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#81485880"
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>
                    </View>

                    {/* LOGIN BUTTON */}
                    <TouchableOpacity
                        style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
                        activeOpacity={0.85}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR CONNECT WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* SOCIAL BUTTON */}
                    <TouchableOpacity
                        style={[styles.socialBtn, loading && { opacity: 0.6 }]}
                        activeOpacity={0.8}
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#b6112a" />
                        ) : (
                            <>
                                <Image
                                    source={require('../assets/google-logo.png')}
                                    style={styles.googleLogo}
                                />
                                <Text style={styles.socialBtnText}>Continue with Google</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* SIGNUP */}
                    <Text style={styles.signupText}>
                        Don't have an account?{' '}
                        <Text onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
                            Sign Up
                        </Text>
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default LoginScreen;

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
        textTransform: 'uppercase',
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

    inputGroup: {
        marginBottom: 18,
    },

    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },

    label: {
        fontSize: 11,
        fontWeight: '700',
        color: '#814c58',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    forgot: {
        fontSize: 11,
        fontWeight: '700',
        color: '#b6112a',
        letterSpacing: 0.5,
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

    primaryBtn: {
        backgroundColor: '#b6112a',
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
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
        textTransform: 'uppercase',
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

    signupText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 13,
        color: '#814c58',
        fontWeight: '500',
    },

    signupLink: {
        color: '#b6112a',
        fontWeight: '700',
    },
    errorContainer: {
        position: 'absolute',
        top: 10,
        left: 16,
        right: 16,
        backgroundColor: '#ff4d4f',
        padding: 12,
        borderRadius: 10,
        zIndex: 999,
    },

    errorText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});