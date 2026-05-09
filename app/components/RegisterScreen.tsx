import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Kita ambil lebar layar agar variabel 'width' terpakai (menghilangkan warning)
const { width } = Dimensions.get('window');

interface RegisterProps {
    onBackToLogin: () => void;
    onRegisterSuccess: () => void;
    }

    export default function RegisterScreen({ onBackToLogin, onRegisterSuccess }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleRegister = () => {
        // Logika pengecekan sederhana
        if (!name || !email || !password || !confirmPass) {
        Alert.alert("Data Tidak Lengkap", "Harap isi semua kolom.");
        return;
        }
        if (password !== confirmPass) {
        Alert.alert("Password Salah", "Konfirmasi password tidak cocok!");
        return;
        }

        // Jika berhasil (Simulasi)
        Alert.alert("Registrasi Berhasil", "Silakan login dengan akun baru kamu.", [
        { text: "Lanjut Login", onPress: onRegisterSuccess }
        ]);
    };

    return (
        <LinearGradient colors={['#FDFDFD', '#E1EFFF']} style={styles.container}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
            
            {/* Bagian Logo Sepatu Sneakers */}
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="shoe-sneaker" size={55} color="#007AFF" />
                </View>
                <Text style={styles.logoText}>JOIN KICK AVENUE</Text>
                <Text style={styles.subText}>Daftar untuk mendapatkan update sepatu terbaru</Text>
            </View>

            <View style={styles.form}>
                {/* Input Full Name */}
                <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#A0A0A0"
                    value={name}
                    onChangeText={setName}
                />
                </View>

                {/* Input Email */}
                <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                </View>

                {/* Input Password */}
                <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#007AFF" style={styles.inputIcon} />
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

                {/* Input Confirm Password */}
                <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock-check-outline" size={20} color="#007AFF" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#A0A0A0"
                    secureTextEntry={!showPass}
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                />
                </View>

                {/* Tombol Sign Up */}
                <TouchableOpacity activeOpacity={0.8} onPress={handleRegister}>
                <LinearGradient colors={['#007AFF', '#005BB5']} style={styles.btn}>
                    <Text style={styles.btnText}>SIGN UP</Text>
                </LinearGradient>
                </TouchableOpacity>

                {/* Tombol Balik ke Login */}
                <TouchableOpacity onPress={onBackToLogin}>
                <Text style={styles.footerText}>
                    {"Already have an account? "} 
                    <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Login</Text>
                </Text>
                </TouchableOpacity>
            </View>

            </ScrollView>
        </KeyboardAvoidingView>
        </LinearGradient>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1 },
    inner: { 
        paddingHorizontal: 30, 
        paddingTop: 60, 
        paddingBottom: 40,
        width: width // Menggunakan variabel width supaya tidak ada warning
    },
    header: { alignItems: 'center', marginBottom: 30 },
    iconCircle: { 
        width: 100, height: 100, borderRadius: 50, 
        backgroundColor: '#fff', justifyContent: 'center', 
        alignItems: 'center', marginBottom: 15,
        elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 5
    },
    logoText: { fontSize: 24, fontWeight: '900', color: '#0c5394', letterSpacing: 1 },
    subText: { fontSize: 13, color: '#666', marginTop: 4, textAlign: 'center' },
    form: { width: '100%' },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 15,
        paddingHorizontal: 15, marginBottom: 15,
        height: 60, elevation: 2
    },
    inputIcon: { marginRight: 10 },
    input: { fontSize: 15, color: '#333' },
    btn: { 
        height: 60, borderRadius: 15, 
        justifyContent: 'center', alignItems: 'center', 
        marginTop: 10, elevation: 3
    },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    footerText: { textAlign: 'center', color: '#888', marginTop: 25, fontSize: 14 }
});