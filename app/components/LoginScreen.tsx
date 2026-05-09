import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Kita pakai width agar warning 'width is declared but never read' hilang
const { width } = Dimensions.get('window');

// Ini adalah 'pintu' agar LoginScreen bisa menerima perintah login dan pindah ke register
interface LoginProps {
    onLogin: (name: string, pass: string) => void;
    onRegisterPress: () => void;
    }

    export default function LoginScreen({ onLogin, onRegisterPress }: LoginProps) {
    const [name, setName] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    return (
        <LinearGradient colors={['#FDFDFD', '#E1EFFF']} style={styles.container}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inner}
        >
            <View style={styles.header}>
            <View style={styles.iconCircle}>
                {/* Pakai shoe-sneaker agar beneran gambar sepatu */}
                <MaterialCommunityIcons name="shoe-sneaker" size={50} color="#007AFF" />
            </View>
            <Text style={styles.logoText}>KICK AVENUE</Text>
            <Text style={styles.subText}>Authentic Sneakers & Streetwear</Text>
            </View>

            <View style={styles.form}>
            <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={22} color="#007AFF" style={styles.inputIcon} />
                <TextInput 
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#A0A0A0"
                value={name}
                onChangeText={setName}
                />
            </View>

            <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={22} color="#007AFF" style={styles.inputIcon} />
                <TextInput 
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <MaterialCommunityIcons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={() => onLogin(name || 'User', password)}>
                <LinearGradient colors={['#007AFF', '#005BB5']} style={styles.loginButton}>
                <Text style={styles.buttonText}>SIGN IN</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Tombol Register: Sekarang sudah bisa diklik karena ada onRegisterPress */}
            <TouchableOpacity onPress={onRegisterPress}>
                <Text style={styles.forgotText}>
                {"Don't have an account? "} 
                <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Register</Text>
                </Text>
            </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </LinearGradient>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 30,
        width: width // Menggunakan width di sini agar warning ts(6133) hilang
    },
    header: { alignItems: 'center', marginBottom: 40 },
    iconCircle: { 
        width: 90, height: 90, borderRadius: 45, 
        backgroundColor: '#fff', justifyContent: 'center', 
        alignItems: 'center', marginBottom: 15,
        elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4
    },
    logoText: { fontSize: 26, fontWeight: '900', color: '#0c5394', letterSpacing: 2 },
    subText: { fontSize: 12, color: '#666', marginTop: 4 },
    form: { width: '100%' },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 15,
        paddingHorizontal: 15, marginBottom: 15,
        height: 60, elevation: 2
    },
    inputIcon: { marginRight: 10 },
    input: { fontSize: 15, color: '#333', flex: 1 },
    loginButton: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    forgotText: { textAlign: 'center', color: '#888', marginTop: 25, fontSize: 13 }
});