import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Dimensions, 
    KeyboardAvoidingView, 
    Platform, 
    Alert,
    TouchableWithoutFeedback,
    Keyboard 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LoginProps {
    onLogin: (name: string, pass: string, role: 'admin' | 'user') => void;
    onRegisterPress: () => void;
}

export default function LoginScreen({ onLogin, onRegisterPress }: LoginProps) {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSignIn = () => {
        // Trim untuk menghindari error spasi tidak sengaja
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        if (!cleanUsername || !cleanPassword) {
            Alert.alert("Input Kosong", "Harap isi username dan password!");
            return;
        }

        // LOGIKA KEAMANAN KETAT SESUAI INSTRUKSI
        if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === '123') {
            // Pintu masuk Admin
            onLogin(cleanUsername, cleanPassword, 'admin');
        } 
        else if (cleanPassword === 'admin123') {
            // Pintu masuk User Biasa (Username bebas, Pass wajib admin123)
            onLogin(cleanUsername, cleanPassword, 'user');
        } 
        else {
            // Selain kredensial di atas, tidak bisa masuk
            Alert.alert("Akses Ditolak", "Username atau Password salah!");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient colors={['#FDFDFD', '#E1EFFF']} style={styles.container}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                    style={styles.inner}
                >
                    {/* Bagian Logo/Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name="shoe-sneaker" size={50} color="#007AFF" />
                        </View>
                        <Text style={styles.logoText}>KICK AVENUE</Text>
                        <Text style={styles.subText}>Authentic Sneakers & Streetwear</Text>
                    </View>

                    {/* Bagian Form */}
                    <View style={styles.form}>
                        {/* Input Username */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons 
                                name="account-outline" 
                                size={22} 
                                color="#007AFF" 
                                style={styles.inputIcon} 
                            />
                            <TextInput 
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#A0A0A0"
                                autoCapitalize="none"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>

                        {/* Input Password */}
                        <View style={styles.inputWrapper}>
                            <MaterialCommunityIcons 
                                name="lock-outline" 
                                size={22} 
                                color="#007AFF" 
                                style={styles.inputIcon} 
                            />
                            <TextInput 
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#A0A0A0"
                                secureTextEntry={!showPass}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <MaterialCommunityIcons 
                                    name={showPass ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color="#888" 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Tombol Sign In */}
                        <TouchableOpacity activeOpacity={0.8} onPress={handleSignIn}>
                            <LinearGradient colors={['#007AFF', '#005BB5']} style={styles.loginButton}>
                                <Text style={styles.buttonText}>SIGN IN</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Link ke Register */}
                        <TouchableOpacity onPress={onRegisterPress} style={styles.registerLink}>
                            <Text style={styles.forgotText}>
                                {"Don't have an account? "} 
                                <Text style={styles.registerHighlight}>Register</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    inner: { 
        flex: 1, 
        justifyContent: 'center', 
        paddingHorizontal: 30,
        width: width 
    },
    header: { 
        alignItems: 'center', 
        marginBottom: 40 
    },
    iconCircle: { 
        width: 90, 
        height: 90, 
        borderRadius: 45, 
        backgroundColor: '#fff', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    logoText: { 
        fontSize: 26, 
        fontWeight: '900', 
        color: '#0c5394', 
        letterSpacing: 2 
    },
    subText: { 
        fontSize: 12, 
        color: '#666', 
        marginTop: 4 
    },
    form: { 
        width: '100%' 
    },
    inputWrapper: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: '#fff', 
        borderRadius: 15,
        paddingHorizontal: 15, 
        marginBottom: 15,
        height: 60, 
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1
    },
    inputIcon: { 
        marginRight: 10 
    },
    input: { 
        fontSize: 15, 
        color: '#333', 
        flex: 1 
    },
    loginButton: { 
        height: 60, 
        borderRadius: 15, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 10 
    },
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16, 
        letterSpacing: 1 
    },
    registerLink: {
        marginTop: 25,
    },
    forgotText: { 
        textAlign: 'center', 
        color: '#888', 
        fontSize: 13 
    },
    registerHighlight: {
        color: '#007AFF', 
        fontWeight: 'bold'
    }
});