import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "../lib/supabase";
import { Product } from "./productsData";
import AddProductModal from "./AddProductModal";
import AnalyticsTab from "./AnalyticsTab";
import OrdersTab from "./OrdersTab";

interface AdminDashboardProps {
  onLogout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function AdminDashboard({ onLogout, products, setProducts }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Semua");

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Fetch Error:", error);
    } else if (data) {
      setProducts(data);
    }
  }, [setProducts]);

  useEffect(() => {
    fetchProducts();
    const channel = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => fetchProducts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchProducts]);

  useFocusEffect(useCallback(() => { fetchProducts(); }, [fetchProducts]));

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "Semua" || item.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });
  }, [products, searchQuery, selectedBrand]);

  const stats = useMemo(() => {
    const lowStock = products.filter((item) => (item.stock ?? 0) < 5).length;
    const totalValue = products.reduce((sum, item) => sum + ((item.price ?? 0) * (item.stock ?? 0)), 0);
    const totalSalesCount = products.reduce((sum, item) => sum + (item.sales ?? 0), 0);
    return { lowStock, totalValue, totalSalesCount };
  }, [products]);

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleSaveProduct = async (newProduct: Product) => {
    const payload = {
      brand: newProduct.brand,
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      gender: newProduct.gender,
      image_url: newProduct.image_url,
      category: newProduct.category,
      sizes: newProduct.sizes,
      rating: newProduct.rating ?? 0,
    };

    try {
      if (editingProduct && editingProduct.id) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{ ...payload, sales: 0 }]);
          
        if (error) throw error;
      }
      
      setIsModalVisible(false);
      setEditingProduct(null);
      fetchProducts();
      Alert.alert("Sukses", "Produk berhasil disimpan");
    } catch (err: any) {
      console.error("Save Error:", err);
      Alert.alert("Gagal Menyimpan", err.message || "Terjadi kesalahan sistem");
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Hapus Produk", `Yakin ingin menghapus ${name}?`, [
      { text: "Batal" },
      { text: "Hapus", style: "destructive", onPress: async () => { 
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) Alert.alert("Error", error.message);
        else fetchProducts(); 
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0056b3", "#007AFF"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.roleText}>ADMINISTRATOR PANEL</Text>
            <Text style={styles.adminName}>Dashboard Utama</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <MaterialCommunityIcons name="logout-variant" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar}>
          {["inventory", "analytics", "orders"].map((id) => (
            <TouchableOpacity key={id} style={[styles.tabItem, activeTab === id && styles.tabActive]} onPress={() => setActiveTab(id)}>
              <Text style={[styles.tabText, activeTab === id && styles.tabTextActive]}>{id.charAt(0).toUpperCase() + id.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {activeTab === "inventory" && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <TextInput style={styles.searchBar} placeholder="Cari model produk..." value={searchQuery} onChangeText={setSearchQuery} />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {["Semua", "Nike", "Adidas", "Converse", "Skechers", "New Balance", "Reebok", "Vans", "Puma"].map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={[styles.filterBtn, selectedBrand === brand && styles.filterBtnActive]}
                  onPress={() => setSelectedBrand(brand)}
                >
                  <Text style={[styles.filterText, selectedBrand === brand && styles.filterTextActive]}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manajemen Inventori</Text>
              <TouchableOpacity style={styles.bulkBtn} onPress={() => { setEditingProduct(null); setIsModalVisible(true); }}>
                <MaterialCommunityIcons name="plus-circle" size={18} color="#007AFF" />
                <Text style={styles.bulkText}>Tambah Produk</Text>
              </TouchableOpacity>
            </View>

            {filteredProducts.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <Image source={{ uri: item.image_url }} style={styles.productImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemDetail}>Brand: {item.brand} | Kat: {item.category}</Text>
                  <Text style={styles.itemDetail}>Stok: {item.stock} | Gender: {item.gender}</Text>
                  <Text style={styles.itemDetail}>Size: {item.sizes ? (Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes) : '-'}</Text>
                  <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionIconBtn} onPress={() => { setEditingProduct(item); setIsModalVisible(true); }}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconBtn} onPress={() => handleDelete(item.id, item.name)}>
                    <MaterialCommunityIcons name="trash-can" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {activeTab === "analytics" && <AnalyticsTab stats={stats} products={products} formatCurrency={formatCurrency} />}
      {activeTab === "orders" && <OrdersTab />}

      <AddProductModal 
        visible={isModalVisible} 
        product={editingProduct} 
        onClose={() => { setIsModalVisible(false); setEditingProduct(null); }} 
        onSave={handleSaveProduct} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { paddingHorizontal: 20, paddingBottom: 25, paddingTop: Platform.OS === "android" ? 45 : 10, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roleText: { color: "#BFDBFE", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  adminName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  logoutBtn: { backgroundColor: "rgba(255,255,255,0.15)", padding: 10, borderRadius: 12 },
  tabBar: { flexDirection: "row", marginTop: 20, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 12, padding: 4 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#BFDBFE", fontSize: 13, fontWeight: "bold" },
  tabTextActive: { color: "#0056b3" },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  searchBar: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  filterScroll: { marginBottom: 15 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#fff", borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: "#E2E8F0" },
  filterBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  filterText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  filterTextActive: { color: "#fff" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  bulkBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#DBEAFE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  bulkText: { color: "#2563EB", fontWeight: "bold", marginLeft: 4, fontSize: 13 },
  productCard: { backgroundColor: "#fff", borderRadius: 16, padding: 15, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  cardInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#1E293B" },
  itemDetail: { fontSize: 12, color: "#666", marginTop: 2 },
  itemPrice: { fontSize: 14, color: "#2563EB", fontWeight: "600", marginTop: 4 },
  cardActions: { flexDirection: "column", gap: 8 },
  actionIconBtn: { padding: 8, backgroundColor: "#F8FAFC", borderRadius: 10 },
});