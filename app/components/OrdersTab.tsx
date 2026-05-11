import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import OrderDetailModal from './OrderDetailModal';

const INITIAL_ORDERS = [
    { 
        id: 'ORD-001', 
        customer: 'Budi Santoso', 
        items: [{ name: 'Nike Air Jordan 1 Low', qty: 1 }],
        total: 1979000, status: 'Diproses', time: '20:45' 
    },
    { 
        id: 'ORD-002', 
        customer: 'Siti Aminah', 
        items: [{ name: 'Adidas Samba OG', qty: 1 }],
        total: 2200000, status: 'Dikirim', time: '19:30' 
    },
    { 
        id: 'ORD-003', 
        customer: 'Andi Wijaya', 
        items: [{ name: 'NB 530 Silver Grey', qty: 1 }, { name: 'Pembersih Sepatu', qty: 1 }],
        total: 1950000, status: 'Selesai', time: '15:20' 
    },
];

export default function OrdersTab() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Diproses': return '#FFB800';
            case 'Dikirim': return '#007AFF';
            case 'Selesai': return '#4CD964';
            default: return '#8E8E93';
        }
    };

    const handleUpdateStatus = (id: string, currentStatus: string) => {
        let nextStatus = currentStatus === 'Diproses' ? 'Dikirim' : 'Selesai';
        
        Alert.alert("Konfirmasi", `Update status ke ${nextStatus}?`, [
            { text: "Batal", style: "cancel" },
            { text: "Ya, Update", onPress: () => {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
                setModalVisible(false);
            }}
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.listRow} 
            activeOpacity={0.7}
            onPress={() => { setSelectedOrder(item); setModalVisible(true); }}
        >
            <View style={[styles.statusStrip, { backgroundColor: getStatusColor(item.status) }]} />
            <View style={styles.mainContent}>
                <View style={styles.topRow}>
                    <Text style={styles.orderId}>{item.id} • {item.time}</Text>
                    <Text style={styles.priceText}>Rp {(item.total / 1000).toLocaleString('id-ID')}rb</Text>
                </View>
                <Text style={styles.customerName}>{item.customer}</Text>
                <View style={styles.itemBox}>
                    {item.items.map((prod: any, index: number) => (
                        <Text key={index} style={styles.productText}>
                            • {prod.name} <Text style={styles.qtyText}>x{prod.qty}</Text>
                        </Text>
                    ))}
                </View>
                <View style={styles.bottomRow}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.listHeader}>
                <Text style={styles.headerTitle}>Monitor Transaksi</Text>
                <View style={styles.countBadge}><Text style={styles.countText}>{orders.length}</Text></View>
            </View>
            
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

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
    container: { padding: 16, flex: 1 },
    listHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#666' },
    countBadge: { backgroundColor: '#E1EFFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    countText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
    listRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#F2F2F7', elevation: 1 },
    statusStrip: { width: 4 },
    mainContent: { flex: 1, padding: 12 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    orderId: { fontSize: 11, color: '#8E8E93', fontWeight: 'bold' },
    customerName: { fontSize: 15, fontWeight: '800', color: '#1C1C1E', marginBottom: 6 },
    itemBox: { paddingLeft: 4, marginBottom: 8, borderLeftWidth: 1, borderLeftColor: '#F2F2F7' },
    productText: { fontSize: 12, color: '#444', lineHeight: 18 },
    qtyText: { fontWeight: 'bold', color: '#007AFF' },
    priceText: { fontSize: 14, fontWeight: 'bold', color: '#1C1C1E' },
    bottomRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 0.5, borderTopColor: '#F2F2F7', paddingTop: 6 },
    statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }
});