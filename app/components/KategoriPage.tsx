import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
    { name: 'Lifestyle', icon: 'shirt-outline' },
    { name: 'Running Shoes', icon: 'walk-outline' },
    { name: 'Skate Shoes', icon: 'accessibility-outline' },
    { name: 'Training Shoes', icon: 'fitness-outline' },
    { name: 'Chunky Sneakers', icon: 'layers-outline' },
    { name: 'Walking Shoes', icon: 'footsteps-outline' },
    { name: 'Basketball Shoes', icon: 'basketball-outline' },
    { name: 'Football Shoes', icon: 'football-outline' },
];

export default function KategoriPage() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Semua Kategori</Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.list}>
                {categories.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.categoryItem}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={item.icon as any} size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.categoryName}>{item.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    list: { padding: 20 },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    iconCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    categoryName: { flex: 1, fontSize: 16, fontWeight: '500', color: '#444' },
});