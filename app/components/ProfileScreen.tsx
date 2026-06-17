import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Alert,
    Platform,
    Linking // 1. Import Linking untuk membuka WhatsApp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileScreenProps {
    userName: string; 
    onLogout: () => void;
}

export default function ProfileScreen({ userName, onLogout }: ProfileScreenProps) {
    
    // 2. Fungsi untuk menghubungkan ke WhatsApp dengan nomor kamu
    const handleWhatsApp = () => {
        const phoneNumber = '6285281008856'; // Nomor kamu sudah terpasang
        const message = `Halo Admin, saya ${userName}. Saya ingin bertanya tentang pesanan saya.`;
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    // Jika aplikasi WA tidak ada (misal di simulator), buka via browser
                    return Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
                }
            })
            .catch(() => Alert.alert("Error", "Aplikasi WhatsApp tidak ditemukan"));
    };

    const handleLogoutPress = () => {
        Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { text: "Keluar", style: "destructive", onPress: () => onLogout() }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AKUN SAYA</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                
                <View style={styles.paddingContainer}>
                    <Text style={styles.greetingText}>Hai {userName},</Text>
                    
                    <TouchableOpacity style={styles.vipBanner} activeOpacity={0.8}>
                        <View style={styles.vipBadge}>
                            <Text style={styles.vipBadgeText}>VIP</Text>
                        </View>
                        <View style={styles.vipInfo}>
                            <Text style={styles.vipTitle}>Nikmati Pengiriman Gratis</Text>
                            <Text style={styles.vipSub}>Masa berlaku aktif untuk wilayah Anda.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionMargin}>
                    <View style={[styles.paddingContainer, styles.rowBetween]}>
                        <Text style={styles.sectionTitle}>Update Pesanan</Text>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Lihat Semua {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.orderStatusRow}>
                        <StatusIcon icon="wallet-outline" label="Belum Bayar" />
                        <StatusIcon icon="cube-outline" label="Dikemas" />
                        <StatusIcon icon="airplane-outline" label="Dikirim" />
                        <StatusIcon icon="star-outline" label="Ulasan" />
                    </View>
                </View>

                <View style={[styles.paddingContainer, styles.rowContainer]}>
                    <View style={styles.walletCard}>
                        <Ionicons name="color-filter-outline" size={20} color="#f1c40f" />
                        <Text style={styles.walletValue}>Rp 20.000</Text>
                        <Text style={styles.walletLabel}>Cashback</Text>
                    </View>
                    <View style={styles.walletCard}>
                        <Ionicons name="wallet-outline" size={20} color="#007AFF" />
                        <Text style={styles.walletValue}>Rp 0</Text>
                        <Text style={styles.walletLabel}>Wallet</Text>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.menuGroupTitle}>Aktivitas</Text>
                    
                    <GridItem icon="person-outline" label="Rincian Akun" />
                    
                    {/* Live Chat yang sudah dihubungkan ke fungsi handleWhatsApp */}
                    <GridItem 
                        icon="chatbubbles-outline" 
                        label="Live Chat" 
                        onPress={handleWhatsApp}
                    />
                    
                    <GridItem icon="settings-outline" label="Preferensi" />
                    <GridItem icon="pricetag-outline" label="Brand Favorit" />
                    <GridItem icon="cube-outline" label="Riwayat Pesanan" />
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
                        <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Versi 21.9.0</Text>
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const StatusIcon = ({ icon, label }: { icon: any, label: string }) => (
    <View style={styles.statusItem}>
        <Ionicons name={icon} size={24} color="#333" />
        <Text style={styles.statusLabel}>{label}</Text>
    </View>
);

const GridItem = ({ icon, label, onPress }: { icon: any, label: string, onPress?: () => void }) => (
    <TouchableOpacity 
        style={styles.listMenuItem} 
        onPress={onPress}
        activeOpacity={0.6}
    >
        <Ionicons name={icon} size={20} color="#007AFF" />
        <Text style={styles.menuItemLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color="#eee" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        paddingVertical: 15, 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#f5f5f5' 
    },
    headerTitle: { fontWeight: 'bold', fontSize: 13, letterSpacing: 2 },
    paddingContainer: { paddingHorizontal: 20, marginTop: 20 },
    greetingText: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 15 },
    vipBanner: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F7FF', 
        padding: 15, borderRadius: 12, borderLeftWidth: 5, borderLeftColor: '#007AFF' 
    },
    vipBadge: { backgroundColor: '#007AFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 12 },
    vipBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    vipInfo: { flex: 1 },
    vipTitle: { fontSize: 13, fontWeight: 'bold' },
    vipSub: { fontSize: 11, color: '#666' },
    sectionMargin: { marginTop: 30 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 20 },
    linkText: { fontSize: 12, color: '#888', marginRight: 20 },
    orderStatusRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    statusItem: { alignItems: 'center' },
    statusLabel: { fontSize: 11, marginTop: 8, color: '#666' },
    rowContainer: { flexDirection: 'row', gap: 15, marginTop: 25 },
    walletCard: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
    walletValue: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
    walletLabel: { fontSize: 11, color: '#888' },
    menuSection: { marginTop: 30, paddingHorizontal: 20 },
    menuGroupTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 15 },
    listMenuItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f9f9f9' 
    },
    menuItemLabel: { flex: 1, marginLeft: 15, fontSize: 14, color: '#333' },
    footerContainer: { paddingHorizontal: 20, marginTop: 40 },
    logoutButton: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ff3b30', alignItems: 'center' },
    logoutButtonText: { color: '#ff3b30', fontWeight: 'bold' },
    versionText: { textAlign: 'center', color: '#ccc', fontSize: 10, marginTop: 15 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});