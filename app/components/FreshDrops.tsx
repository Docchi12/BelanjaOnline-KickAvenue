import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface FreshDropsProps {
    onProductPress: (product: any) => void;
}

const freshItems = [
    { 
        id: 1, 
        name: 'Dunk Low Retro', 
        brand: 'Nike', 
        price: 'Rp 1.549.000',
        gender: 'Unisex',
        category: 'Lifestyle',
        rating: '4.8',
        image: 'https://image.807garage.com/content/uploads/2024/6/dunk-low-retro-team-gold-white-6.jpg' 
    },
    { 
        id: 2, 
        name: 'Gazelle Indoor', 
        brand: 'Adidas', 
        price: 'Rp 2.100.000',
        gender: 'Wanita', 
        category: 'Classic',
        rating: '4.7',
        image: 'https://images.jdsports.id/i/jpl/jd_IG1640_b?w=700&resmode=sharp&qlt=70&fmt=webp' 
    },
    { 
        id: 3, 
        name: '9060 Sea Salt', 
        brand: 'New Balance', 
        price: 'Rp 2.899.000',
        gender: 'Wanita',
        category: 'Running',
        rating: '4.9',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4G_AVPv0-7EsrnoMXQup-nEnhwmazc8hjUA&s' 
    },
    {
        id: 4, 
        name: 'Go Walk 6', 
        brand: 'Skechers', 
        price: 'Rp 1.299.000',
        gender: 'Unisex',
        category: 'Walking',
        rating: '4.6',
        image: 'https://img.lazcdn.com/g/ff/kf/S30efd52b206042fdbc2fe798ca6ee261N.jpg_960x960q80.jpg_.webp' 
    },
];

export default function FreshDrops({ onProductPress }: FreshDropsProps) {
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
                {freshItems.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.card} 
                        activeOpacity={0.8}
                        onPress={() => onProductPress(item)}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
                        </View>
                        <View style={styles.info}>
                            <View style={styles.brandRow}>
                                <Text style={styles.brand}>{item.brand}</Text>
                                {/* Badge warna biru muda yang identik */}
                                <View style={styles.genderBadge}>
                                    <Text style={styles.genderText}>{item.gender}</Text>
                                </View>
                            </View>
                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 40, 
    },
    headerRow: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    scrollContent: {
        paddingLeft: 20,
        paddingRight: 10,
        backgroundColor : '#007AFF',
    },
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
        shadowRadius: 5,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '85%',
        height: '85%',
    },
    info: {
        marginTop: 12,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    brand: {
        fontSize: 10,
        color: '#888', 
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    genderBadge: {
        backgroundColor: '#EBF5FF', // Biru muda seragam
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    genderText: {
        fontSize: 8,
        color: '#007AFF', // Teks biru seragam
        fontWeight: 'bold',
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 2,
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#007AFF', // Harga dibuat biru supaya senada
    },
});