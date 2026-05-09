import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    Dimensions,
    Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// 1. DEFINISI PROPS (Penting agar tidak error di index.tsx)
interface ProfileScreenProps {
    onLogout: () => void;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
    
    // 2. MODIFIKASI LOGIKA LOGOUT
    const handleLogoutPress = () => {
        Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            { 
                text: "Keluar", 
                style: "destructive",
                onPress: () => onLogout() // Memanggil fungsi logout dari state utama di index.tsx
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
            {/* HEADER FIXED */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AKUN SAYA</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* 1. GREETING SECTION */}
                <View style={styles.paddingContainer}>
                    <Text style={styles.greetingText}>Hai M.Muhdor Al Fatih,</Text>
                    
                    <TouchableOpacity style={styles.vipBanner} activeOpacity={0.8}>
                        <View style={styles.vipBadge}>
                            <Text style={styles.vipBadgeText}>VIP</Text>
                        </View>
                        <View style={styles.vipInfo}>
                            <Text style={styles.vipTitle}>Nikmati Pengiriman Gratis selama masa berlangganan</Text>
                            <Text style={styles.vipSub}>hanya <Text style={styles.strikethrough}>Rp 149.000</Text> Rp 99.000 untuk wilayah Anda.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#6a1b9a" />
                    </TouchableOpacity>
                </View>

                {/* 2. UPDATE PESANAN */}
                <View style={styles.sectionMargin}>
                    <View style={[styles.paddingContainer, styles.rowBetween]}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Update Pesanan</Text>
                            <View style={styles.newBadge}><Text style={styles.newBadgeText}>BARU</Text></View>
                        </View>
                        <TouchableOpacity><Text style={styles.linkText}>Pesanan Saya {'>'}</Text></TouchableOpacity>
                    </View>
                    
                    {/* Status Icons */}
                    <View style={styles.orderStatusRow}>
                        <StatusIcon icon="wallet-outline" label="Belum Bayar" />
                        <StatusIcon icon="cube-outline" label="Dikemas" />
                        <StatusIcon icon="airplane-outline" label="Dikirim" />
                        <StatusIcon icon="star-outline" label="Penilaian" />
                    </View>

                    <View style={styles.emptyOrderBox}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={32} color="#ccc" />
                        <Text style={styles.emptyOrderText}>Update pesanan kosong. Yuk mulai belanja untuk terima update!</Text>
                    </View>
                </View>

                {/* 3. WALLET SECTION */}
                <View style={[styles.paddingContainer, styles.rowContainer]}>
                    <View style={styles.walletCard}>
                        <View style={styles.row}>
                            <Ionicons name="color-filter-outline" size={16} color="#f1c40f" />
                            <Text style={styles.walletLabel}>Cashback</Text>
                        </View>
                        <Text style={styles.walletValue}>Rp 20.000</Text>
                    </View>
                    <View style={styles.walletCard}>
                        <View style={styles.row}>
                            <Ionicons name="wallet-outline" size={16} color="#8e44ad" />
                            <Text style={styles.walletLabel}>Wallet</Text>
                        </View>
                        <Text style={styles.walletValue}>Rp 0</Text>
                    </View>
                </View>

                {/* 4. AKTIVITAS & PEMBAYARAN */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuGroupTitle}>Aktivitas</Text>
                    <View style={styles.gridMenu}>
                        <GridItem icon="person-outline" label="Rincian" />
                        <GridItem icon="settings-outline" label="Preferensi" />
                        <GridItem icon="pricetag-outline" label="Brand" />
                        <GridItem icon="cube-outline" label="Pesanan" />
                        <GridItem icon="star-outline" label="Ulasan" />
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.menuGroupTitle}>Pembayaran</Text>
                    <ListMenuItem icon="business-outline" label="Konfirmasi Pembayaran" />
                    <ListMenuItem icon="aperture-outline" label="Konfigurasi Shoppepay" color="#4a148c" />
                    <ListMenuItem icon="wallet-outline" label="Konfigurasi Gopay" color="#00a8ff" />
                </View>

                {/* 5. BANTUAN */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuGroupTitle}>Bantuan</Text>
                    <View style={styles.gridMenu}>
                        <GridItem icon="help-circle-outline" label="Bantuan" />
                        <GridItem icon="headset-outline" label="Live Chat" />
                        <GridItem icon="shield-checkmark-outline" label="Kebijakan Privasi" />
                        <GridItem icon="information-circle-outline" label="Tentang Kami" />
                        <GridItem icon="ribbon-outline" label="Kekayaan Intelektual" />
                        <GridItem icon="person-remove-outline" label="Penghapusan Akun" />
                    </View>
                </View>

                {/* 6. PENGATURAN & LOKASI */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuGroupTitle}>Pengaturan</Text>
                    <TouchableOpacity style={styles.listMenuItem} activeOpacity={0.7}>
                        <View style={styles.row}>
                            <View style={styles.indoFlag} />
                            <Text style={styles.menuItemLabel}>Lokasi</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 7. FOOTER & KELUAR */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.outlineButton} onPress={handleLogoutPress}>
                        <Text style={styles.outlineButtonText}>Keluar</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Versi 21.9.0</Text>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

// Komponen Sub-UI agar lebih bersih
const StatusIcon = ({ icon, label }: any) => (
    <TouchableOpacity style={styles.statusItem}>
        <Ionicons name={icon} size={24} color="#333" />
        <Text style={styles.statusLabel}>{label}</Text>
    </TouchableOpacity>
);

const GridItem = ({ icon, label }: any) => (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.6}>
        <Ionicons name={icon} size={20} color="#333" />
        <Text style={styles.gridItemLabel}>{label}</Text>
    </TouchableOpacity>
);

const ListMenuItem = ({ icon, label, color = "#333" }: any) => (
    <TouchableOpacity style={styles.listMenuItem} activeOpacity={0.6}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.menuItemLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingBottom: 15, 
        alignItems: 'center', 
        borderBottomWidth: 0.5, 
        borderBottomColor: '#eee',
        backgroundColor: '#fff'
    },
    headerTitle: { fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    scrollContent: { paddingTop: 20 },
    paddingContainer: { paddingHorizontal: 20 },
    sectionMargin: { marginTop: 25 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    
    greetingText: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1a1a1a' },
    vipBanner: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f5ff', 
        padding: 12, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#6a1b9a',
        elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2
    },
    vipBadge: { backgroundColor: '#6a1b9a', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, marginRight: 10 },
    vipBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    vipInfo: { flex: 1 },
    vipTitle: { fontSize: 12, fontWeight: '700', color: '#1a1a1a' },
    vipSub: { fontSize: 10, color: '#666', marginTop: 2 },
    strikethrough: { textDecorationLine: 'line-through' },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
    newBadge: { backgroundColor: '#e8f5e9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
    newBadgeText: { fontSize: 10, color: '#2e7d32', fontWeight: 'bold' },
    linkText: { color: '#666', fontSize: 12 },
    orderStatusRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 10 },
    statusItem: { alignItems: 'center', flex: 1 },
    statusLabel: { fontSize: 11, marginTop: 8, color: '#444', textAlign: 'center' },
    emptyOrderBox: { 
        marginHorizontal: 20, marginVertical: 15, padding: 25, backgroundColor: '#fafafa', borderRadius: 12, 
        alignItems: 'center', borderWidth: 1, borderColor: '#eee', borderStyle: 'dashed' 
    },
    emptyOrderText: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 10, lineHeight: 18 },

    rowContainer: { flexDirection: 'row', gap: 12, marginTop: 10 },
    walletCard: { flex: 1, backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#f1f3f5' },
    walletLabel: { fontSize: 12, color: '#666', marginLeft: 6 },
    walletValue: { fontSize: 15, fontWeight: 'bold', marginTop: 8, color: '#1a1a1a' },

    menuSection: { marginTop: 30, paddingHorizontal: 20 },
    menuGroupTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 18, color: '#1a1a1a' },
    gridMenu: { flexDirection: 'row', flexWrap: 'wrap' },
    gridItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
    gridItemLabel: { marginLeft: 12, fontSize: 14, color: '#333' },
    listMenuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
    menuItemLabel: { marginLeft: 15, fontSize: 14, color: '#333' },

    indoFlag: { width: 22, height: 14, backgroundColor: '#f00', borderBottomWidth: 7, borderBottomColor: '#fff', borderWidth: 0.5, borderColor: '#ddd' },

    footerContainer: { 
        marginTop: 20, 
        paddingHorizontal: 20, 
        paddingBottom: 10 
    },

    outlineButton: { 
        borderWidth: 1.5, borderColor: '#1a1a1a', borderRadius: 8, 
        padding: 14, alignItems: 'center', marginTop: 5, 
    },
    outlineButtonText: { fontWeight: 'bold', fontSize: 14, color: '#1a1a1a' },
    versionText: { textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 15 }
});