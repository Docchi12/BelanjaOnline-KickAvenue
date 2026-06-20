import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Product } from './productsData'; 

const { width } = Dimensions.get('window');

interface FreshDropsProps {
    products: Product[]; 
    onProductPress: (product: Product) => void;
}

export default function FreshDrops({ products, onProductPress }: FreshDropsProps) {
    // Ambil 5 produk terbaru
    const freshItems = products.slice(0, 5);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>🔥 Just Landed</Text>
                <Text style={styles.subtitle}>Fresh from the box</Text>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {freshItems.map((item) => {
                    const isOutOfStock = (item as any).stock === 0;

                    return (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[styles.card, isOutOfStock && { opacity: 0.5 }]} 
                            activeOpacity={isOutOfStock ? 1 : 0.8}
                            onPress={() => !isOutOfStock && onProductPress(item)}
                        >
                            <View style={styles.imageContainer}>
                                <Image 
                                    source={{ uri: item.image_url }} 
                                    style={styles.img} 
                                    resizeMode="contain" 
                                />
                                {isOutOfStock && (
                                    <View style={styles.outOfStockBadge}>
                                        <Text style={styles.outOfStockText}>Habis</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.info}>
                                <View style={styles.brandRow}>
                                    <Text style={styles.brand}>{item.brand}</Text>
                                    <View style={styles.genderBadge}>
                                        <Text style={styles.genderText}>{item.gender}</Text>
                                    </View>
                                </View>
                                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                                
                                <Text style={styles.price}>
                                    {isOutOfStock ? "Stok Habis" : `Rp ${item.price.toLocaleString('id-ID')}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20, marginBottom: 20 },
    headerRow: { paddingHorizontal: 20, marginBottom: 15 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 12, color: '#888', marginTop: 2 },
    scrollContent: { paddingLeft: 20, paddingRight: 10 },
    card: { 
        width: width * 0.45, 
        backgroundColor: '#fff', 
        borderRadius: 20, 
        marginRight: 15, 
        padding: 12, 
        elevation: 4, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 5 
    },
    imageContainer: { width: '100%', height: 120, backgroundColor: '#f9f9f9', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    img: { width: '85%', height: '85%' },
    outOfStockBadge: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    outOfStockText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    info: { marginTop: 12 },
    brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    brand: { fontSize: 10, color: '#888', fontWeight: 'bold', textTransform: 'uppercase' },
    genderBadge: { backgroundColor: '#EBF5FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    genderText: { fontSize: 8, color: '#007AFF', fontWeight: 'bold' },
    name: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 2 },
    price: { fontSize: 13, fontWeight: 'bold', color: '#007AFF' },
});