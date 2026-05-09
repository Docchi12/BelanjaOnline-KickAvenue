import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView,
    Image,
    Platform,
    StatusBar,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CartScreenProps {
    userName: string;
    onBack: () => void;
    items: any[]; 
    onRemoveItem: (index: number) => void;
}

export default function CartScreen({ userName, onBack, items, onRemoveItem }: CartScreenProps) {
    const [selectedPayment, setSelectedPayment] = useState('Gopay');
    const [selectedCourier, setSelectedCourier] = useState('J&T Express');
    const [isVoucherChecked, setIsVoucherChecked] = useState(false);

    // --- LOGIKA PERHITUNGAN ---
    const subtotal = items.reduce((sum, item) => {
        const price = typeof item.price === 'string' 
            ? parseInt(item.price.replace(/[^0-9]/g, '')) 
            : item.price;
        return sum + (price || 0);
    }, 0);

    const shippingFee = items.length > 0 ? 25000 : 0;
    
    // Potongan Voucher (Hanya aktif jika dicentang)
    const voucherOngkir = (isVoucherChecked && items.length > 0) ? 15000 : 0;
    const totalVoucherProduct = isVoucherChecked ? (items.length * 20000) : 0;

    const total = subtotal + shippingFee - voucherOngkir - totalVoucherProduct;

    const formatIDR = (amount: number) => {
        const safeAmount = amount < 0 ? 0 : amount;
        return `Rp ${safeAmount.toLocaleString('id-ID')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Konfirmasi Pesanan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* ALAMAT */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={20} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    </View>
                    <View style={styles.addressBox}>
                        <Text style={styles.userNameText}>{userName} <Text style={styles.tagLabel}>(Utama)</Text></Text> 
                        <Text style={styles.addressText}>Jl. Sudirman No. 123, Jakarta Barat</Text>
                    </View>
                </View>

                {/* PRODUK */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produk Dipesan</Text>
                    {items.map((item, index) => (
                        <View key={index} style={styles.productItem}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <View style={styles.rowBetween}>
                                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => onRemoveItem(index)}>
                                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.productPrice}>{typeof item.price === 'number' ? formatIDR(item.price) : item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* VOUCHER (MODEL CENTANG) */}
                <View style={styles.section}>
                    <TouchableOpacity 
                        style={styles.rowBetween} 
                        onPress={() => setIsVoucherChecked(!isVoucherChecked)}
                    >
                        <View style={styles.rowAlign}>
                            <Ionicons name="pricetag" size={20} color="#007AFF" />
                            <Text style={styles.voucherText}>Gunakan Voucher Potongan</Text>
                        </View>
                        <Ionicons 
                            name={isVoucherChecked ? "checkbox" : "square-outline"} 
                            size={24} 
                            color={isVoucherChecked ? "#007AFF" : "#CCC"} 
                        />
                    </TouchableOpacity>
                </View>

                {/* KURIR */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Pilihan Pengiriman</Text>
                    {['J&T Express', 'SiCepat Reg'].map((courier) => (
                        <TouchableOpacity 
                            key={courier} 
                            style={[styles.optionRow, selectedCourier === courier && styles.activeOptionRow]} 
                            onPress={() => setSelectedCourier(courier)}
                        >
                            <Text style={[styles.optionText, selectedCourier === courier && styles.activeOptionText]}>{courier}</Text>
                            <Ionicons 
                                name={selectedCourier === courier ? "checkmark-circle-sharp" : "ellipse-outline"} 
                                size={22} 
                                color={selectedCourier === courier ? "#007AFF" : "#ccc"} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* METODE PEMBAYARAN (SUDAH KEMBALI) */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Metode Pembayaran</Text>
                    <View style={styles.paymentGrid}>
                        {['Gopay', 'ShopeePay', 'Bank Transfer', 'COD'].map((method) => (
                            <TouchableOpacity 
                                key={method} 
                                style={[styles.paymentBtn, selectedPayment === method && styles.activePaymentBtn]}
                                onPress={() => setSelectedPayment(method)}
                            >
                                <Text style={selectedPayment === method ? styles.activePaymentText : styles.paymentText}>
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* RINCIAN */}
                <View style={styles.billingSection}>
                    <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Subtotal Produk</Text>
                        <Text style={styles.billingValue}>{formatIDR(subtotal)}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Biaya Pengiriman</Text>
                        <Text style={styles.billingValue}>{formatIDR(shippingFee)}</Text>
                    </View>

                    {isVoucherChecked && (
                        <>
                            <View style={styles.billingRow}>
                                <Text style={styles.discountLabel}>Voucher Ongkir</Text>
                                <Text style={styles.discountValue}>- {formatIDR(voucherOngkir)}</Text>
                            </View>
                            <View style={styles.billingRow}>
                                <Text style={styles.discountLabel}>Voucher Produk</Text>
                                <Text style={styles.discountValue}>- {formatIDR(totalVoucherProduct)}</Text>
                            </View>
                        </>
                    )}

                    <View style={[styles.billingRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>{formatIDR(total)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerLabel}>Total Tagihan</Text>
                    <Text style={styles.footerPrice}>{formatIDR(total)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => Alert.alert("Berhasil", "Pesanan diproses!")}>
                    <Text style={styles.checkoutText}>Bayar Sekarang</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 25, backgroundColor: '#007AFF', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    backBtn: { width: 40 },
    scrollContent: { padding: 15, paddingBottom: 120 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
    addressBox: { paddingLeft: 28 },
    userNameText: { fontWeight: 'bold' },
    tagLabel: { color: '#007AFF', fontSize: 11 },
    addressText: { color: '#666', fontSize: 13 },
    productItem: { flexDirection: 'row', marginBottom: 15 },
    productImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#EEE' },
    productInfo: { flex: 1, marginLeft: 12 },
    productName: { fontWeight: '600', fontSize: 14, width: '80%' },
    productPrice: { color: '#007AFF', fontWeight: 'bold' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowAlign: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    voucherText: { fontSize: 14, fontWeight: '600' },
    optionRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
    activeOptionRow: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
    activeOptionText: { color: '#007AFF', fontWeight: 'bold' },
    optionText: { fontSize: 14 },
    paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    paymentBtn: { width: '48%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
    activePaymentBtn: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
    paymentText: { color: '#666', fontSize: 13 },
    activePaymentText: { color: '#007AFF', fontWeight: 'bold' },
    billingSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    billingLabel: { color: '#888', fontSize: 13 },
    billingValue: { fontWeight: '600', fontSize: 13 },
    discountLabel: { color: '#2E7D32', fontSize: 13 },
    discountValue: { color: '#2E7D32', fontWeight: 'bold', fontSize: 13 },
    totalRow: { borderTopWidth: 1, borderColor: '#EEE', paddingTop: 10, marginTop: 10 },
    totalLabel: { fontWeight: 'bold', fontSize: 15 },
    totalValue: { fontWeight: 'bold', fontSize: 17, color: '#FF3B30' },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 35 : 20 },
    footerLabel: { fontSize: 12, color: '#888' },
    footerPrice: { fontSize: 19, fontWeight: 'bold', color: '#FF3B30' },
    checkoutBtn: { backgroundColor: '#007AFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
    checkoutText: { color: '#fff', fontWeight: 'bold' }
});