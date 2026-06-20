import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

// Definisi interface untuk memperbaiki error TypeScript
interface Order {
    id: string;
    order_code: string;
    total_amount: number;
    status: string;
}

export default function MyOrdersScreen() {
    // Memberikan tipe data Order[] pada useState
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Ambil hanya order yang statusnya 'Belum Bayar'
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'Belum Bayar');
        
        if (data) setOrders(data);
    };

    const handleKonfirmasiBayar = async (orderId: string) => {
        // Update status di Supabase
        const { error } = await supabase
            .from('orders')
            .update({ status: 'Dikemas' }) // Pindah ke status Dikemas
            .eq('id', orderId);

        if (!error) {
            Alert.alert("Sukses", "Pembayaran dikonfirmasi! Pesanan sedang dikemas.");
            fetchOrders(); // Refresh daftar
        } else {
            Alert.alert("Error", "Gagal mengonfirmasi pembayaran.");
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }: { item: Order }) => (
                <View style={styles.orderCard}>
                    <Text style={styles.orderText}>Pesanan: {item.order_code}</Text>
                    <Text style={styles.orderText}>Total: Rp {item.total_amount}</Text>
                    <TouchableOpacity 
                        onPress={() => handleKonfirmasiBayar(item.id)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Sudah Bayar</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    orderCard: { 
        padding: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        backgroundColor: '#fff'
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5
    },
    button: { 
        backgroundColor: 'green', 
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: { 
        color: 'white', 
        fontWeight: 'bold' 
    }
});