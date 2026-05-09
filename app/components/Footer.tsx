import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Update Interface agar menerima onProfilePress
interface FooterProps {
    activePage: string;
    onHomePress: () => void;
    onKategoriPress: () => void;
    onCartPress: () => void;
    onProfilePress: () => void; // <-- Ditambahkan
    cartCount: number;
}

export default function Footer({ 
    activePage, 
    onHomePress, 
    onKategoriPress, 
    onCartPress, 
    onProfilePress, // <-- Destructure di sini
    cartCount 
}: FooterProps) {
    
    // Helper function untuk warna yang konsisten
    const getActiveColor = (pageName: string) => 
        activePage === pageName ? "#007AFF" : "#94A3B8";

    return (
        <View style={styles.footerContainer}>
            {/* Navigasi Beranda */}
            <TouchableOpacity 
                style={styles.navItem} 
                onPress={onHomePress}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name={activePage === 'home' ? "home" : "home-outline"} 
                    size={24} 
                    color={getActiveColor('home')} 
                />
                <Text style={[styles.navText, activePage === 'home' && styles.activeText]}>
                    Beranda
                </Text>
            </TouchableOpacity>

            {/* Navigasi Kategori */}
            <TouchableOpacity 
                style={styles.navItem} 
                onPress={onKategoriPress}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name={activePage === 'kategori' ? "grid" : "grid-outline"} 
                    size={24} 
                    color={getActiveColor('kategori')} 
                />
                <Text style={[styles.navText, activePage === 'kategori' && styles.activeText]}>
                    Kategori
                </Text>
            </TouchableOpacity>

            {/* Navigasi Keranjang dengan Badge */}
            <TouchableOpacity 
                style={styles.navItem} 
                onPress={onCartPress}
                activeOpacity={0.7}
            >
                <View style={styles.iconWrapper}>
                    <Ionicons 
                        name={activePage === 'cart' ? "cart" : "cart-outline"} 
                        size={26} 
                        color={getActiveColor('cart')} 
                    />
                    {cartCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {cartCount > 9 ? '9+' : cartCount}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.navText, activePage === 'cart' && styles.activeText]}>
                    Keranjang
                </Text>
            </TouchableOpacity>

            {/* Navigasi Profil - SEKARANG SUDAH TERHUBUNG */}
            <TouchableOpacity 
                style={styles.navItem} 
                activeOpacity={0.7}
                onPress={onProfilePress} // <-- Panggil props di sini
            >
                <Ionicons 
                    name={activePage === 'profile' ? "person" : "person-outline"} 
                    size={24} 
                    color={getActiveColor('profile')} 
                />
                <Text style={[styles.navText, activePage === 'profile' && styles.activeText]}>
                    Profil
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height: Platform.OS === 'ios' ? 85 : 70, 
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10, 
        paddingTop: 10,
        // Shadow agar terlihat premium
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 15, // Ditingkatkan agar lebih terlihat di Android
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navText: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
        fontWeight: '500',
    },
    activeText: {
        color: '#007AFF',
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        right: -6,
        top: -4,
        backgroundColor: '#EF4444', 
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
});