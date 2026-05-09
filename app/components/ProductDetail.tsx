import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView, 
    Dimensions, 
    Platform, 
    StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface ProductDetailProps {
    product: any;
    onBack: () => void;
    onAddToCart: (product: any) => void; // Menambahkan prop untuk handle tambah ke keranjang
}

export default function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);

    const handleAddToCart = () => {
        if (selectedSize) {
            // Mengirim data produk beserta ukuran yang dipilih
            onAddToCart({
                ...product,
                selectedSize: selectedSize
            });
            onBack(); // Kembali ke halaman utama setelah menambah
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Produk</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="share-outline" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* GAMBAR PRODUK */}
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: product.image }} style={styles.mainImage} resizeMode="contain" />
                </View>

                <View style={styles.content}>
                    {/* BRAND & BADGE */}
                    <View style={styles.metaRow}>
                        <Text style={styles.brandText}>{product.brand}</Text>
                        <View style={styles.badgeGroup}>
                            <View style={styles.blueBadge}>
                                <Text style={styles.blueBadgeText}>{product.gender}</Text>
                            </View>
                            <View style={styles.blueBadge}>
                                <Text style={styles.blueBadgeText}>{product.category}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>

                    <View style={styles.divider} />

                    {/* PILIHAN UKURAN */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Pilih Ukuran (EUR)</Text>
                            <TouchableOpacity>
                                <Text style={styles.sizeGuide}>Panduan Ukuran</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.sizeGrid}>
                            {(product.sizes || [39, 40, 41, 42, 43]).map((size: number) => (
                                <TouchableOpacity 
                                    key={size}
                                    style={[
                                        styles.sizeBox,
                                        selectedSize === size && styles.sizeBoxSelected
                                    ]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <Text style={[
                                        styles.sizeLabel,
                                        selectedSize === size && styles.sizeLabelSelected
                                    ]}>
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* DESKRIPSI */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tentang Produk</Text>
                        <Text style={styles.description}>
                            Sepatu {product.name} koleksi {product.category} dari {product.brand}. 
                            Didesain khusus untuk memberikan kenyamanan maksimal bagi {product.gender} 
                            dengan material premium yang tahan lama untuk penggunaan harian.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* BOTTOM BAR / ACTION */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Harga Satuan</Text>
                    <Text style={styles.totalPrice}>{product.price}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.buyBtn, !selectedSize && styles.btnDisabled]}
                    disabled={!selectedSize}
                    onPress={handleAddToCart}
                >
                    <Text style={styles.buyBtnText}>
                        {selectedSize ? 'Tambah ke Keranjang' : 'Pilih Ukuran'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    iconButton: { padding: 8 },
    scrollContent: { paddingBottom: 120 },
    imageWrapper: {
        width: width,
        height: 320,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: { width: '85%', height: '85%' },
    content: { padding: 20 },
    metaRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 10 
    },
    brandText: { fontSize: 13, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
    badgeGroup: { flexDirection: 'row', gap: 6 },
    blueBadge: { 
        backgroundColor: '#EBF5FF',
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 6 
    },
    blueBadgeText: { 
        color: '#007AFF',
        fontSize: 11, 
        fontWeight: 'bold' 
    },
    productName: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 6 },
    productPrice: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
    section: { marginBottom: 25 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    sizeGuide: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
    sizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    sizeBox: {
        width: (width - 70) / 4,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    sizeBoxSelected: { borderColor: '#007AFF', backgroundColor: '#EBF5FF' },
    sizeLabel: { fontSize: 15, fontWeight: '600', color: '#4B5563' },
    sizeLabelSelected: { color: '#007AFF', fontWeight: 'bold' },
    description: { fontSize: 14, color: '#666', lineHeight: 22 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: width,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? 35 : 25,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    priceContainer: { flex: 1 },
    totalLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
    totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    buyBtn: {
        flex: 1.5,
        backgroundColor: '#007AFF',
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDisabled: { backgroundColor: '#E5E7EB' },
    buyBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});