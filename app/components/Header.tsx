import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Interface diperbarui untuk menerima userName, fungsi navigasi, dan jumlah keranjang
interface HeaderProps {
    userName: string;
    onCartPress: () => void;
    cartCount: number; // Tambahkan ini agar badge angka bersifat dinamis
}

export default function Header({ userName, onCartPress, cartCount }: HeaderProps) {
    // Logika mengambil inisial nama
    const initial = userName && userName.length > 0 
        ? userName.charAt(0).toUpperCase() 
        : 'G';

    return (
        <View style={styles.headerWrapper}>
            <View style={styles.blueContainer}>
                {/* BAGIAN ATAS: Profil & Icon */}
                <View style={styles.topSection}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initial}</Text>
                        </View>
                        <View>
                            <Text style={styles.greeting}>Halo, {userName}!</Text>
                            <Text style={styles.brandTitle}>KICK AVENUE</Text>
                        </View>
                    </View>

                    <View style={styles.iconGroup}>
                        {/* Tombol Keranjang */}
                        <TouchableOpacity 
                            style={styles.iconBtn} 
                            onPress={onCartPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="cart" size={26} color="white" />
                            {cartCount > 0 && (
                                <View style={styles.notifBadge}>
                                    <Text style={styles.badgeText}>
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Tombol Notifikasi */}
                        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications" size={24} color="white" />
                            <View style={styles.dotBadge} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BAGIAN BAWAH: Search Bar */}
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Cari sepatu impianmu..."
                        placeholderTextColor="#94A3B8"
                        returnKeyType="search"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: '#fff',
    },
    blueContainer: {
        backgroundColor: '#007AFF',
        // Menyesuaikan padding top berdasarkan platform agar tidak menabrak notch
        paddingTop: Platform.OS === 'ios' ? 40 : 25, 
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        // Shadow/Bayangan
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi transparan agar lebih estetik
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF', // Menyesuaikan dengan warna background header
    },
    dotBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        backgroundColor: '#10B981', // Dot hijau untuk indikator notif baru
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#007AFF',
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        height: 50,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
    },
});