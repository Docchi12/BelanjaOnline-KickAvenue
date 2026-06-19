import React, { useState, useEffect } from 'react'; // useEffect ditambahkan di sini
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import OrderDetailModal from './OrderDetailModal';

export default function OrdersTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // ── AMBIL DATA PESANAN DARI SUPABASE ──────────────────────────────────
    // useEffect dengan [] di akhir = hanya dijalankan sekali saat halaman dibuka
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    order_code,
                    total_amount,
                    order_status,
                    created_at,
                    profiles ( full_name ),
                    order_items ( product_name, quantity )
                `)
                .order('created_at', { ascending: false }); // pesanan terbaru di atas

            if (error) {
                console.error('Gagal ambil orders:', error.message);
                setLoading(false);
                return;
            }

            if (data) {
                // Ubah format data dari Supabase agar cocok dengan tampilan
                const formatted = data.map((item: any) => ({
                    id: item.order_code,            // ditampilkan sebagai "ORD-xxx"
                    customer: item.profiles?.full_name || 'Pengguna',
                    items: (item.order_items || []).map((oi: any) => ({
                        name: oi.product_name,
                        qty: oi.quantity,
                    })),
                    total: item.total_amount,
                    status: item.order_status,
                    time: new Date(item.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    _realId: item.id, // id angka asli dari DB, dipakai saat update status
                }));
                setOrders(formatted);
            }

            setLoading(false);
        };

        fetchOrders();
    }, []);

    // ── WARNA BADGE STATUS ────────────────────────────────────────────────
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Diproses': return '#FFB800';
            case 'Dikirim':  return '#007AFF';
            case 'Selesai':  return '#4CD964';
            default:         return '#8E8E93';
        }
    };

    // ── UPDATE STATUS PESANAN ─────────────────────────────────────────────
    const handleUpdateStatus = (id: string, currentStatus: string) => {
        // Tentukan status berikutnya:
        // Diproses → Dikirim → Selesai
        // Kalau sudah Selesai, tidak bisa diupdate lagi
        if (currentStatus === 'Selesai') {
            Alert.alert('Info', 'Pesanan ini sudah selesai dan tidak bisa diubah.');
            return;
        }

        const nextStatus = currentStatus === 'Diproses' ? 'Dikirim' : 'Selesai';

        Alert.alert("Konfirmasi", `Update status ke "${nextStatus}"?`, [
            { text: "Batal", style: "cancel" },
            {
                text: "Ya, Update",
                onPress: async () => {
                    // Cari _realId dari pesanan yang dipilih
                    const targetOrder = orders.find(o => o.id === id);
                    if (!targetOrder) return;

                    // Kirim perubahan ke Supabase
                    const { error } = await supabase
                        .from('orders')
                        .update({ order_status: nextStatus })
                        .eq('id', targetOrder._realId);

                    if (error) {
                        Alert.alert('Gagal', 'Status gagal diupdate: ' + error.message);
                        return;
                    }

                    // Berhasil → update tampilan tanpa perlu reload
                    setOrders(prev =>
                        prev.map(o => o.id === id ? { ...o, status: nextStatus } : o)
                    );
                    setModalVisible(false);
                },
            },
        ]);
    };

    // ── TAMPILAN SATU KARTU PESANAN ───────────────────────────────────────
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.listRow}
            activeOpacity={0.7}
            onPress={() => { setSelectedOrder(item); setModalVisible(true); }}
        >
            {/* Garis warna di kiri kartu sesuai status */}
            <View style={[styles.statusStrip, { backgroundColor: getStatusColor(item.status) }]} />

            <View style={styles.mainContent}>
                {/* Baris atas: kode pesanan + total harga */}
                <View style={styles.topRow}>
                    <Text style={styles.orderId}>{item.id} • {item.time}</Text>
                    <Text style={styles.priceText}>
                        Rp {(item.total / 1000).toLocaleString('id-ID')}rb
                    </Text>
                </View>

                {/* Nama pelanggan */}
                <Text style={styles.customerName}>{item.customer}</Text>

                {/* Daftar produk dalam pesanan */}
                <View style={styles.itemBox}>
                    {item.items.map((prod: any, index: number) => (
                        <Text key={index} style={styles.productText}>
                            • {prod.name}{' '}
                            <Text style={styles.qtyText}>x{prod.qty}</Text>
                        </Text>
                    ))}
                </View>

                {/* Status di bawah */}
                <View style={styles.bottomRow}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // ── RENDER UTAMA ──────────────────────────────────────────────────────
    return (
        <View style={styles.container}>

            {/* Header: judul + jumlah pesanan */}
            <View style={styles.listHeader}>
                <Text style={styles.headerTitle}>Monitor Transaksi</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{orders.length}</Text>
                </View>
            </View>

            {/* Tampilkan loading spinner saat data masih diambil */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Memuat pesanan...</Text>
                </View>
            ) : orders.length === 0 ? (
                // Tampilkan pesan kalau belum ada pesanan sama sekali
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Belum ada pesanan masuk.</Text>
                </View>
            ) : (
                // Tampilkan daftar pesanan
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Modal detail pesanan */}
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

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 15,
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#666' },
    countBadge: {
        backgroundColor: '#E1EFFF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    countText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: { color: '#888', fontSize: 14 },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: { color: '#aaa', fontSize: 14 },
    listRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F2F2F7',
        elevation: 1,
    },
    statusStrip: { width: 4 },
    mainContent: { flex: 1, padding: 12 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    orderId: { fontSize: 11, color: '#8E8E93', fontWeight: 'bold' },
    customerName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1C1C1E',
        marginBottom: 6,
    },
    itemBox: {
        paddingLeft: 4,
        marginBottom: 8,
        borderLeftWidth: 1,
        borderLeftColor: '#F2F2F7',
    },
    productText: { fontSize: 12, color: '#444', lineHeight: 18 },
    qtyText: { fontWeight: 'bold', color: '#007AFF' },
    priceText: { fontSize: 14, fontWeight: 'bold', color: '#1C1C1E' },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 0.5,
        borderTopColor: '#F2F2F7',
        paddingTop: 6,
    },
    statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
});