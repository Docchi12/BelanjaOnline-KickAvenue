import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 50) / 2;

const products = [
    {
        id: 1,
        name: 'Air Jordan 1 Low',
        brand: 'Jordan',
        category: 'Lifestyle',
        price: 'Rp 2.499.000',
        gender: 'Pria', // Gender ditampilkan diluar
        sizes: [39, 40, 41, 42, 43], 
        image: 'https://image.807garage.com/content/uploads/2024/6/air-jordan-1-low-wolf-grey-8.jpg',
        rating: 4.9,
    },
    {
        id: 2,
        name: 'Samba OG',
        brand: 'Adidas',
        category: 'Skate Shoes',
        price: 'Rp 2.200.000',
        gender: 'Wanita',
        sizes: [38, 39, 40, 41, 42],
        image: 'https://image.807garage.com/content/uploads/2024/6/adidas-samba-og-black-white-gum-8.jpg',
        rating: 4.8,
    },
    {
        id: 3,
        name: '530 Silver Grey',
        brand: 'New Balance',
        category: 'Running Shoes',
        price: 'Rp 1.850.000',
        gender: 'Pria',
        sizes: [40, 41, 42, 43, 44],
        image: 'https://image.807garage.com/content/uploads/2024/7/new-balance-530-white-silver-metallic-8.jpg',
        rating: 4.7,
    },
    {
        id: 4,
        name: 'Chuck Taylor 70s',
        brand: 'Converse',
        category: 'Lifestyle',
        price: 'Rp 999.000',
        gender: 'Wanita',
        sizes: [37, 38, 39, 40, 41],
        image: 'https://preloved.co.id/_ipx/f_webp/https://assets.preloved.co.id/products/378525/a0aa8494-1406-4c19-b279-207aa3a92fc6.jpg',
        rating: 4.6,
    },
    {
        id: 5,
        name: 'Old Skool Black',
        brand: 'Vans',
        category: 'Skate Shoes',
        price: 'Rp 1.100.000',
        gender: 'Pria',
        sizes: [39, 40, 41, 42, 43],
        image: 'https://img.lazcdn.com/g/p/aa4ee0347a47dd381113c4394a1219e2.jpg_720x720q80.jpg',
        rating: 4.5,
    },
    {
        id: 6,
        name: 'Classic Leather',
        brand: 'Reebok',
        category: 'Training Shoes',
        price: 'Rp 1.299.000',
        gender: 'Unisex',
        sizes: [40, 41, 42, 43, 44],
        image: 'https://www.lazone.id/storage/news/Februari%202021/16%20Februari%202021/Reebok%20Classic%20Leather%20Anti%20Basah/rebook%20goretekx%20-%20cover.jpg',
        rating: 4.7,
    },
];

interface ProductListProps {
    onProductPress: (product: any) => void;
}

export default function ProductList({ onProductPress }: ProductListProps) {
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
                            <Image source={{ uri: item.image }} style={styles.productImg} resizeMode="contain" />
                        </View>
                        <View style={styles.info}>
                            <View style={styles.brandRow}>
                                <Text style={styles.brandText}>{item.brand}</Text>
                                {/* Label Gender dikembalikan ke sini */}
                                <Text style={styles.genderLabel}>{item.gender}</Text>
                            </View>
                            <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.priceText}>{item.price}</Text>
                            
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
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