import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from './productsData'; // Pastikan path import benar

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

// --- PERBAIKAN: Gunakan Props agar bisa menerima data dari index.tsx ---
interface ProductListProps {
    products: Product[]; // Menerima array produk yang sinkron dengan Admin
    onProductPress: (product: Product) => void;
}

export default function ProductList({ products, onProductPress }: ProductListProps) {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Catalog</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {products.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.card} 
                        activeOpacity={0.8}
                        onPress={() => onProductPress(item)}
                    >
                        <View style={styles.imageContainer}>
                            {/* PERBAIKAN: Gunakan imageUrl sesuai interface Product */}
                            <Image 
                                source={{ uri: item.imageUrl }} 
                                style={styles.productImg} 
                                resizeMode="contain" 
                            />
                        </View>
                        <View style={styles.info}>
                            <View style={styles.brandRow}>
                                <Text style={styles.brandText}>{item.brand}</Text>
                                <Text style={styles.genderLabel}>{item.gender}</Text>
                            </View>
                            <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
                            
                            {/* Format harga ke Rupiah */}
                            <Text style={styles.priceText}>
                                Rp {item.price.toLocaleString('id-ID')}
                            </Text>
                            
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>4.8</Text> 
                                {/* ^ Rating bisa kamu tambahkan di interface jika perlu, sementara hardcoded agar tidak error */}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 10,
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAll: {
        color: '#007AFF',
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        width: CARD_WIDTH,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    productImg: {
        width: '90%',
        height: '90%',
    },
    info: {
        padding: 10,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    brandText: {
        fontSize: 10,
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    genderLabel: {
        fontSize: 9,
        color: '#007AFF',
        backgroundColor: '#EBF5FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
    priceText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 3,
    },
});