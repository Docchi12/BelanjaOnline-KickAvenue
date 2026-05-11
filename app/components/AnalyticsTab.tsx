import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface AnalyticsProps {
    stats: {
        lowStock: number;
        totalValue: number;
        totalSalesCount: number;
    };
    products: any[];
    formatCurrency: (val: number) => string;
}

// PASTIKAN MENGGUNAKAN 'export default' DI SINI
export default function AnalyticsTab({ stats, products, formatCurrency }: AnalyticsProps) {
    
    // Logika perhitungan data Pie Chart berdasarkan Brand
    const brandData = (products || []).reduce((acc: any, item: any) => {
        const existing = acc.find((d: any) => d.name === item.brand);
        if (existing) {
            existing.stock += (item.stock || 0);
        } else {
            acc.push({ name: item.brand, stock: (item.stock || 0) });
        }
        return acc;
    }, []);

    const chartData = brandData.map((b: any, index: number) => ({
        name: b.name,
        population: b.stock,
        color: ['#007AFF', '#FF9500', '#FF2D55', '#5856D6', '#AF52DE'][index % 5],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Performa Penjualan</Text>
                
                <LinearGradient colors={['#0056b3', '#007AFF']} style={styles.analyticsMainCard}>
                    <Text style={styles.analyticsLabel}>Estimasi Nilai Inventaris</Text>
                    <Text style={styles.analyticsValue}>{formatCurrency(stats?.totalValue || 0)}</Text>
                    <View style={styles.analyticsSubRow}>
                        <MaterialCommunityIcons name="trending-up" size={20} color="#4CD964" />
                        <Text style={styles.analyticsSubText}>+12% dari bulan lalu</Text>
                    </View>
                </LinearGradient>

                <Text style={[styles.sectionTitle, {marginTop: 5}]}>Distribusi Stok per Merk</Text>
                
                {/* Bagian Grafik Pie */}
                <View style={styles.chartBox}>
                    {chartData.length > 0 ? (
                        <PieChart
                            data={chartData}
                            width={screenWidth - 60}
                            height={180}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                        />
                    ) : (
                        <Text style={{ textAlign: 'center', padding: 20 }}>Tidak ada data produk</Text>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.miniCard}>
                        <MaterialCommunityIcons name="cart-arrow-right" size={24} color="#007AFF" />
                        <Text style={styles.miniLabel}>Produk Terjual</Text>
                        <Text style={styles.miniValue}>{stats?.totalSalesCount || 0}</Text>
                    </View>
                    <View style={styles.miniCard}>
                        <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                        <Text style={styles.miniLabel}>Rating Toko</Text>
                        <Text style={styles.miniValue}>4.8</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, {marginTop: 10}]}>Produk Terlaris (Top Sales)</Text>
                {[...products].sort((a, b) => b.sales - a.sales).slice(0, 3).map((item) => (
                    <View key={item.id} style={styles.productCard}>
                        <View style={styles.cardInfo}>
                            <Text style={styles.brandTag}>{item.brand}</Text>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.categoryText}>{item.sales} unit terjual</Text>
                        </View>
                        <View style={styles.topBadge}>
                            <MaterialCommunityIcons name="trophy" size={14} color="#FFD700" />
                            <Text style={styles.topText}>TOP</Text>
                        </View>
                    </View>
                ))}
            </View>
            {/* Spacer bawah agar tidak terpotong navbar */}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    analyticsMainCard: { padding: 25, borderRadius: 25, marginBottom: 20, elevation: 5 },
    analyticsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
    analyticsValue: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 8 },
    analyticsSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    analyticsSubText: { color: '#4CD964', fontSize: 12, fontWeight: 'bold' },
    chartBox: { 
        backgroundColor: '#fff', 
        borderRadius: 20, 
        padding: 10, 
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        alignItems: 'center'
    },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 25 },
    miniCard: { flex: 1, backgroundColor: '#fff', padding: 18, borderRadius: 20, elevation: 3 },
    miniLabel: { fontSize: 10, color: '#666', textTransform: 'uppercase', marginTop: 8 },
    miniValue: { fontSize: 22, fontWeight: 'bold', color: '#0056b3' },
    productCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
    cardInfo: { flex: 1 },
    brandTag: { fontSize: 10, color: '#007AFF', fontWeight: 'bold', textTransform: 'uppercase' },
    itemName: { fontSize: 15, fontWeight: 'bold', color: '#222', marginTop: 4 },
    categoryText: { fontSize: 11, color: '#888' },
    topBadge: { backgroundColor: '#FFF9E6', paddingHorizontal: 10, height: 30, justifyContent: 'center', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
    topText: { color: '#FFB800', fontWeight: 'bold', fontSize: 11 }
});