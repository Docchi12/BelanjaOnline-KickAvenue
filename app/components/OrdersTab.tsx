import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import OrderDetailModal from './OrderDetailModal';

export default function OrdersTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Menunggu Pembayaran');

    const tabs = ['Menunggu Pembayaran', 'Dikemas', 'Dikirim', 'Selesai'];

    const fetchOrders = async () => {
        setLoading(true);

        // Filter berdasarkan tab yang aktif
        const { data, error } = await supabase
            .from('orders')
            .select(`
                id, total_amount, payment_status, order_status, created_at, shipping_address,
                profiles ( full_name ),
                order_items ( product_name, quantity )
            `)
            .eq('order_status', activeTab) 
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Gagal ambil orders:', error.message);
        } else if (data) {
            const formatted = data.map((item: any) => ({
                id: `ORD-${item.id}`,
                customer: item.profiles?.full_name || 'Pengguna',
                items: (item.order_items || []).map((oi: any) => ({
                    name: oi.product_name,
                    qty: oi.quantity,
                })),
                total: item.total_amount,
                status: item.order_status,
                paymentStatus: item.payment_status,
                shipping_address: item.shipping_address,
                time: new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                _realId: item.id,
            }));
            setOrders(formatted);
        }
        setLoading(false);
    };

    // Jalankan fetch saat tab berubah atau ada update
    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    // Realtime Listener
    useEffect(() => {
        const orderChannel = supabase
            .channel("schema-db-changes-orders")
            .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => { supabase.removeChannel(orderChannel); };
    }, [activeTab]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Menunggu Pembayaran': return '#FF9500';
            case 'Diproses': return '#FFB800';
            case 'Dikemas': return '#8A2BE2';
            case 'Dikirim': return '#007AFF';
            case 'Selesai': return '#4CD964';
            default: return '#8E8E93';
        }
    };

    const handleUpdateStatus = (id: string, currentStatus: string) => {
        if (currentStatus === 'Selesai' || currentStatus === 'Menunggu Pembayaran') return;

        // Logika perpindahan status: Dikemas -> Dikirim -> Selesai
        const nextStatus = currentStatus === 'Dikemas' ? 'Dikirim' : 'Selesai';

        Alert.alert("Konfirmasi", `Pindahkan ke "${nextStatus}"?`, [
            { text: "Batal", style: "cancel" },
            {
                text: "Ya, Update",
                onPress: async () => {
                    // Update order_status (sisi admin) sekaligus status (sisi user) agar selalu sinkron
                    const { data, error } = await supabase
    .from('orders')
    .update({ order_status: nextStatus, status: nextStatus })
    .eq('id', id)
    .select(); // <-- tambahkan ini

if (error) {
    Alert.alert('Gagal', error.message);
} else if (!data || data.length === 0) {
    Alert.alert('Gagal', 'Update ditolak sistem (kemungkinan izin akses admin belum diatur).');
} else {
    setModalVisible(false);
    fetchOrders();
}
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* TAB BAR */}
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listRow} onPress={() => { setSelectedOrder(item); setModalVisible(true); }}>
                            <View style={[styles.statusStrip, { backgroundColor: getStatusColor(item.status) }]} />
                            <View style={styles.mainContent}>
                                <Text style={styles.orderId}>{item.id} • {item.time}</Text>
                                <Text style={styles.customerName}>{item.customer}</Text>
                                <Text style={styles.priceText}>Rp {item.total.toLocaleString('id-ID')}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <OrderDetailModal
                visible={modalVisible}
                order={selectedOrder}
                onClose={() => setModalVisible(false)}
                onUpdate={handleUpdateStatus}
                getStatusColor={getStatusColor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    tabContainer: { flexDirection: 'row', marginBottom: 15, justifyContent: 'space-between' },
    tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#f0f0f0' },
    activeTab: { backgroundColor: '#007AFF' },
    tabText: { fontSize: 11, color: '#666' },
    activeTabText: { color: '#fff', fontWeight: 'bold' },
    listRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F2F2F7', overflow: 'hidden' },
    statusStrip: { width: 4 },
    mainContent: { flex: 1, padding: 12 },
    orderId: { fontSize: 11, color: '#8E8E93' },
    customerName: { fontSize: 15, fontWeight: '800' },
    priceText: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
});