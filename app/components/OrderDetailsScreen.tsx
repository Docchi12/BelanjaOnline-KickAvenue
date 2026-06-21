import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function OrderDetailsScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const orderId = route.params?.orderId;

  useEffect(() => {
    const fetchOrderDetail = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
                *,
                order_items (*),
                profiles:user_id (full_name)
            `,
    )
    .eq("id", orderId)
    .single(); // <-- TANPA titik koma sebelum ini, langsung nyambung jadi satu chain

  if (data) setOrder(data);
  setLoading(false);
};
    fetchOrderDetail();
  }, [orderId]);

  const handlePayment = async () => {
    setLoading(true);
    // Memperbarui dua kolom agar status di admin sinkron dan otomatis berpindah
    const { data, error } = await supabase
        .from('orders')
        .update({
            order_status: 'Dikemas',
            status: 'Dikemas',
            payment_status: 'Dibayar'
        })
        .eq('id', orderId)
        .select(); // <-- TANPA titik koma sebelum ini, langsung nyambung

    if (error) {
        console.error("Gagal update pembayaran:", error);
        Alert.alert("Error", error.message || "Gagal memproses pembayaran");
    } else if (!data || data.length === 0) {
        Alert.alert("Gagal", "Update ditolak sistem (kemungkinan izin akses). Hubungi admin.");
    } else {
        Alert.alert("Berhasil", "Pembayaran diterima, pesanan akan dikemas.");
        navigation.goBack();
    }
    setLoading(false);
};

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.orderCode}>Kode: {order.order_code}</Text>
          <Text style={styles.status}>Status: {order.status}</Text>

          <View style={styles.divider} />

          {/* Informasi Pembeli & Pengiriman */}
          <Text style={styles.sectionTitle}>Informasi Pembeli</Text>
          <Text style={styles.infoText}>
            Nama: {order.profiles?.full_name || "Tidak ada nama"}
          </Text>
          <Text style={styles.infoText}>
            Alamat: {order.shipping_address || "Belum diatur"}
          </Text>
          <Text style={styles.infoText}>
            Kurir: {order.courier || "Belum dipilih"}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <Text style={styles.infoText}>
            {order.payment_method || "Belum dipilih"}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Daftar Produk</Text>
          {order.order_items?.map((item: any, index: number) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productName}>{item.product_name}</Text>
              <Text style={styles.productDetail}>
                Ukuran: {item.selected_size || "-"} | Qty: {item.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.totalAmount}>
  Total Bayar: Rp {order.total_amount?.toLocaleString("id-ID")}
</Text>

{order.status === 'Belum Bayar' && (
    <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Saya Bayar</Text>
    </TouchableOpacity>
)}

{order.status === 'Selesai' && (
    <TouchableOpacity
        style={[styles.payButton, { backgroundColor: '#FF9500' }]}
        onPress={() => navigation.goToReview?.(order.id)}
    >
        <Text style={styles.payButtonText}>Beri Rating & Ulasan</Text>
    </TouchableOpacity>
)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007AFF",
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  scrollContent: { padding: 15 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  orderCode: { fontSize: 16, fontWeight: "bold" },
  status: { color: "#007AFF", fontWeight: "600", marginBottom: 10 },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 15,
    fontSize: 15,
    color: "#333",
  },
  infoText: { color: "#555", marginTop: 5 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  productItem: { marginBottom: 8 },
  productName: { fontWeight: "600", color: "#333" },
  productDetail: { color: "#777", fontSize: 13 },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
