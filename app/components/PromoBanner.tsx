import React from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');
// Kita tentukan lebar banner supaya pas di tengah
const BANNER_WIDTH = width * 0.85; 
const SPACING = 10;

const banners = [
    { id: 1, image: 'https://www.blj.co.id/wp-content/uploads/2023/03/Nike.jpg' },
    { id: 2, image: 'https://images.tokopedia.net/img/KRMmCm/2024/7/24/b9af516b-658d-41cb-83ba-fa31e49e8609.jpg' },
    { id: 3, image: 'https://blog.bankmega.com/wp-content/uploads/2024/04/Promo-Lebaran-2024-Bank-Mega-1170x585.jpg' },
];

export default function PromoBanner() {
    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                snapToInterval={BANNER_WIDTH + SPACING} // KUNCI UTAMA: Agar berhenti tepat di tengah
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
            >
                {banners.map((item) => (
                    <TouchableOpacity key={item.id} activeOpacity={0.9}>
                        <Image 
                            source={{ uri: item.image }} 
                            style={styles.bannerImage} 
                            resizeMode="cover" // Pakai cover agar gambar memenuhi kotak
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginBottom: 20,
    },
    scrollContent: {
        // Padding horizontal agar gambar pertama tidak mepet kiri
        paddingHorizontal: (width - BANNER_WIDTH) / 2, 
    },
    bannerImage: {
        width: BANNER_WIDTH,
        height: 180,
        borderRadius: 20,
        marginRight: SPACING,
        backgroundColor: '#eee', // Placeholder jika gambar loading
    }
});