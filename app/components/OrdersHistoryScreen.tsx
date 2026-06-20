import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    SafeAreaView, 
    ActivityIndicator, 
    TouchableOpacity, 
    Platform, 
    StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

interface Order {
    id: string;
    order_code: string;
    total_amount: number;
    status: string;
}

export default function OrdersHistoryScreen({ route, onNavigate }: { route?: any, onNavigate: (page: string, params?: any) => void }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Mengambil filterStatus dari route params
    const filterStatus = route?.params?.filterStatus;

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log("User tidak ditemukan");
                return;
            }

            // Membangun query dasar
            let query = supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id);

            // Jika filterStatus ada, saring datanya.
            if (filterStatus) {
                query = query.eq('status', filterStatus);
            }

            // Eksekusi query
            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;

            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching order history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, [filterStatus]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {filterStatus ? `Pesanan ${filterStatus}` : "Riwayat Pesanan"}
                </Text>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {filterStatus 
                            ? `Belum ada pesanan dengan status "${filterStatus}".` 
                            : "Belum ada riwayat pesanan ditemukan."}
                    </Text>
                }
                renderItem={({ item }: { item: Order }) => (
                    <TouchableOpacity 
                        onPress={() => onNavigate('orderDetail', { 
                            orderId: item.id, 
                            filterStatus: filterStatus // Kirim balik filterStatus agar tetap terjaga
                        })}
                    >
                        <View style={styles.orderCard}>
                            <View style={styles.row}>
                                <Text style={styles.orderCode}>{item.order_code}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </View>
                            </View>
                            <Text style={styles.totalText}>Total: Rp {item.total_amount?.toLocaleString('id-ID') || '0'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 18,
        backgroundColor: '#007AFF',
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    orderCard: { 
        backgroundColor: '#fff', 
        padding: 20, 
        marginHorizontal: 15, 
        marginTop: 15, 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee'
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderCode: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    statusBadge: { backgroundColor: '#e1f5fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
    totalText: { fontSize: 14, color: '#666' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});