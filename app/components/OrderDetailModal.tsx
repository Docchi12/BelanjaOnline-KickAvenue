import React from 'react';
import { 
    View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView 
} from 'react-native';

const { height } = Dimensions.get('window');

interface OrderDetailModalProps {
    visible: boolean;
    order: any;
    onClose: () => void;
    onUpdate: (id: string, currentStatus: string) => void;
    getStatusColor: (status: string) => string;
}

export default function OrderDetailModal({ visible, order, onClose, onUpdate, getStatusColor }: OrderDetailModalProps) {
    if (!order) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Detail Transaksi</Text>
                        <View style={[styles.statusTag, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                            <Text style={[styles.statusTagText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
                        <View style={styles.detailSection}>
                            <Text style={styles.label}>ID PESANAN</Text>
                            <Text style={styles.value}>{order.id}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.label}>NAMA PEMBELI</Text>
                            <Text style={styles.value}>{order.customer}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.label}>ALAMAT PENGIRIMAN</Text>
                            <Text style={styles.value}>
                                {order.shipping_address ? order.shipping_address : "Alamat Tidak Ditemukan"}
                            </Text>
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.label}>RINCIAN PRODUK</Text>
                            {order.items.map((it: any, i: number) => (
                                <Text key={i} style={styles.value}>• {it.name} (x{it.qty})</Text>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                            <Text style={styles.btnCloseText}>Tutup</Text>
                        </TouchableOpacity>
                        
                        {order.status !== 'Selesai' && (
                            <TouchableOpacity 
                                style={styles.btnAction} 
                                onPress={() => onUpdate(order.id, order.status)}
                            >
                                <Text style={styles.btnActionText}>
                                    Update Ke {order.status === 'Diproses' ? 'Dikirim' : 'Selesai'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: height * 0.7 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusTagText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    scrollBody: { marginBottom: 20 },
    detailSection: { marginBottom: 15 },
    label: { fontSize: 10, color: '#8E8E93', fontWeight: 'bold', marginBottom: 4 },
    value: { fontSize: 14, color: '#1C1C1E', lineHeight: 20 },
    modalFooter: { flexDirection: 'row', gap: 10 },
    btnClose: { flex: 1, backgroundColor: '#F2F2F7', padding: 16, borderRadius: 12, alignItems: 'center' },
    btnCloseText: { fontWeight: 'bold', color: '#8E8E93' },
    btnAction: { flex: 2, backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
    btnActionText: { fontWeight: 'bold', color: '#fff' }
});