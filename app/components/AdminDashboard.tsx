import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Supabase
import { supabase } from "../lib/supabase";

// Tipe data produk dan daftar brand yang diizinkan
import { ALLOWED_BRANDS, Product } from "./productsData";

// Komponen pendukung
import AnalyticsTab from "./AnalyticsTab";
import OrdersTab from "./OrdersTab";
import AddProductModal from "./AddProductModal";

const { height } = Dimensions.get("window");

interface AdminDashboardProps {
  onLogout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function AdminDashboard({
  onLogout,
  products,
  setProducts,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // ─── STATISTIK ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const lowStock = products.filter((item) => (item.stock ?? 0) < 5).length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * (p.stock ?? 0),
      0
    );
    const totalSalesCount = products.reduce(
      (sum, p) => sum + (p.sales || 0),
      0
    );
    return { lowStock, totalValue, totalSalesCount };
  }, [products]);

  // ─── FORMAT MATA UANG ─────────────────────────────────────────────────────
  // Satu fungsi, dipakai di mana saja di file ini (termasuk dikirim ke AnalyticsTab)
  const formatCurrency = (val: number) =>
    `Rp ${val.toLocaleString("id-ID")}`;

  // ─── SIMPAN PRODUK (TAMBAH / EDIT) ────────────────────────────────────────
  // Fungsi ini dipanggil oleh AddProductModal saat admin klik "Simpan Produk"
  const handleSaveProduct = async (newProduct: Product) => {
    if (editingProduct) {
      // ── MODE EDIT: perbarui baris yang sudah ada di Supabase ──
      const { error } = await supabase
        .from("products")
        .update({
          brand: newProduct.brand,
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          gender: newProduct.gender,
          category: newProduct.category,
          sizes: newProduct.sizes,
          image_url: newProduct.imageUrl, // kolom di DB: image_url
        })
        .eq("id", editingProduct.id); // hanya update baris dengan id ini

      if (error) {
        Alert.alert("Gagal", "Produk gagal diupdate: " + error.message);
        return;
      }

      // Berhasil → perbarui tampilan tanpa reload
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
      );
    } else {
      // ── MODE TAMBAH BARU: insert baris baru ke Supabase ──
      // (AddProductModal sudah menyiapkan objek newProduct dari form)
      const { data, error } = await supabase
        .from("products")
        .insert({
          brand: newProduct.brand,
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
          sales: 0,
          gender: newProduct.gender,
          category: newProduct.category,
          sizes: newProduct.sizes,
          image_url: newProduct.imageUrl,
        })
        .select()   // minta Supabase kembalikan data yang baru disimpan
        .single();  // karena kita insert 1 baris, ambil sebagai objek tunggal

      if (error) {
        Alert.alert("Gagal", "Produk gagal ditambahkan: " + error.message);
        return;
      }

      // Ganti id sementara (Date.now()) dari modal dengan id asli dari DB
      const savedProduct: Product = {
        ...newProduct,
        id: data.id,
      };

      setProducts((prev) => [savedProduct, ...prev]);
    }

    setIsModalVisible(false);
    setEditingProduct(null);
  };

  // ─── HAPUS PRODUK ─────────────────────────────────────────────────────────
  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus ${name}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("products")
              .delete()
              .eq("id", id);

            if (error) {
              Alert.alert("Gagal", "Produk gagal dihapus: " + error.message);
              return;
            }

            // Berhasil → hapus dari tampilan
            setProducts((prev) => prev.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  // ─── TAMPILAN TAB INVENTORY ───────────────────────────────────────────────
  const renderInventory = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.content}>

        {/* Kartu ringkasan stok */}
        <View style={styles.statsRow}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Total Model</Text>
            <Text style={styles.miniValue}>{products.length}</Text>
          </View>
          <View
            style={[
              styles.miniCard,
              stats.lowStock > 0 && styles.lowStockCard,
            ]}
          >
            <Text style={styles.miniLabel}>Stok Menipis</Text>
            <Text
              style={[
                styles.miniValue,
                stats.lowStock > 0 && styles.lowStockText,
              ]}
            >
              {stats.lowStock}
            </Text>
          </View>
        </View>

        {/* Header + tombol Tambah Produk */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manajemen Inventori</Text>
          <TouchableOpacity
            style={styles.bulkBtn}
            onPress={() => {
              setEditingProduct(null); // pastikan tidak dalam mode edit
              setIsModalVisible(true);
            }}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={18}
              color="#007AFF"
            />
            <Text style={styles.bulkText}>Tambah Produk</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar produk */}
        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.cardInfo}>
              <View style={styles.tagRow}>
                <Text style={styles.brandTag}>{item.brand}</Text>
                <Text style={styles.genderTag}>{item.gender}</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            </View>

            <View style={styles.cardActions}>
              {/* Tampilan stok — merah kalau < 5 */}
              <View style={styles.stockDisplay}>
                <Text
                  style={[
                    styles.stockNum,
                    (item.stock ?? 0) < 5 && { color: "#FF3B30" },
                  ]}
                >
                  {item.stock ?? 0}
                </Text>
                <Text style={styles.stockLabel}>Stok</Text>
              </View>

              {/* Tombol Edit */}
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => {
                  setEditingProduct(item);
                  setIsModalVisible(true);
                }}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>

              {/* Tombol Hapus */}
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={20}
                  color="#FF3B30"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // ─── RENDER UTAMA ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header biru + tab bar */}
      <LinearGradient
        colors={["#0056b3", "#007AFF"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.roleText}>ADMINISTRATOR PANEL</Text>
            <Text style={styles.adminName}>Dashboard Utama</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <MaterialCommunityIcons
              name="logout-variant"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          {["inventory", "analytics", "orders"].map((id) => (
            <TouchableOpacity
              key={id}
              style={[styles.tabItem, activeTab === id && styles.tabActive]}
              onPress={() => setActiveTab(id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === id && styles.tabTextActive,
                ]}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Konten sesuai tab yang aktif */}
      {activeTab === "inventory" && renderInventory()}
      {activeTab === "analytics" && (
        <AnalyticsTab
          stats={stats}
          products={products}
          formatCurrency={formatCurrency}  // nama fungsi sudah konsisten
        />
      )}
      {activeTab === "orders" && <OrdersTab />}

      {/* Modal tambah / edit produk */}
      <AddProductModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: Platform.OS === "android" ? 45 : 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleText: {
    color: "#BFDBFE",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  adminName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 12,
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#BFDBFE", fontSize: 13, fontWeight: "bold" },
  tabTextActive: { color: "#0056b3" },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  statsRow: { flexDirection: "row", gap: 15, marginBottom: 20 },
  miniCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  lowStockCard: { backgroundColor: "#FEF2F2" },
  lowStockText: { color: "#EF4444" },
  miniLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "800" },
  miniValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bulkText: {
    color: "#2563EB",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 13,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  tagRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
  brandTag: { color: "#2563EB", fontWeight: "bold", fontSize: 10 },
  genderTag: {
    color: "#64748B",
    backgroundColor: "#F1F5F9",
    fontSize: 9,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  itemName: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  itemPrice: { fontSize: 14, color: "#2563EB", fontWeight: "600" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  stockDisplay: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 10,
    minWidth: 45,
  },
  stockNum: { fontSize: 14, fontWeight: "bold" },
  stockLabel: { fontSize: 8, color: "#94A3B8" },
  actionIconBtn: { padding: 8, backgroundColor: "#F8FAFC", borderRadius: 10 },
});