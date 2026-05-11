import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Import Komponen Tab
import AnalyticsTab from "./AnalyticsTab";
import OrdersTab from "./OrdersTab";

// Mengimpor initialProducts sebagai default, dan Product serta ALLOWED_BRANDS sebagai named exports
import initialProducts, { ALLOWED_BRANDS, Product } from "./productsData";

const { height } = Dimensions.get("window");

// --- KONSTANTA BARU: DAFTAR UKURAN ---
const SHOE_SIZES = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
];

const SHOE_CATEGORIES = [
  "Lifestyle",
  "Running Shoes",
  "Skate Shoes",
  "Training Shoes",
  "Chunky Sneakers",
  "Walking Shoes",
  "Basketball Shoes",
  "Football Shoes",
];

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState("inventory");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    brand: "",
    name: "",
    price: "",
    stock: "",
    gender: "Pria",
    category: "",
    sizes: [] as string[], // Tambahan state sizes
  });

  const handleLogoutPress = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun admin?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", style: "destructive", onPress: onLogout },
      ],
    );
  };

  const stats = useMemo(() => {
    const lowStock = products.filter((item) => item.stock < 5).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalSalesCount = products.reduce((sum, p) => sum + p.sales, 0);
    return { lowStock, totalValue, totalSalesCount };
  }, [products]);

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  // Fungsi bantu untuk pilih/hapus ukuran
  const toggleSize = (size: string) => {
    setForm((prev) => {
      const isSelected = prev.sizes.includes(size);
      const newSizes = isSelected
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSave = () => {
    if (
      !form.brand ||
      !form.name ||
      !form.price ||
      !form.stock ||
      !form.category ||
      form.sizes.length === 0
    ) {
      Alert.alert(
        "Data Belum Lengkap",
        "Mohon isi semua data, pilih kategori, dan pilih minimal satu ukuran.",
      );
      return;
    }

    const isBrandValid = ALLOWED_BRANDS.some(
      (b) => b.toLowerCase() === form.brand.trim().toLowerCase(),
    );

    if (!isBrandValid) {
      Alert.alert(
        "Merk Tidak Valid",
        `Hanya boleh merk: ${ALLOWED_BRANDS.join(", ")}.`,
      );
      return;
    }

    const priceNum = parseInt(form.price);
    const stockNum = parseInt(form.stock);

    if (editingId) {
      setProducts(
        products.map((p) =>
          p.id === editingId
            ? { ...p, ...form, price: priceNum, stock: stockNum }
            : p,
        ),
      );
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        brand: form.brand,
        name: form.name,
        price: priceNum,
        stock: stockNum,
        gender: form.gender,
        sales: 0,
        category: form.category,
        sizes: form.sizes, // Simpan ukuran ke data produk
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalVisible(false);
    setForm({
      brand: "",
      name: "",
      price: "",
      stock: "",
      gender: "Pria",
      category: "",
      sizes: [],
    });
  };

  const handleEditStock = (id: number, currentStock: number, name: string) => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Update Stok Cepat",
        `Masukkan jumlah stok baru untuk ${name}:`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Simpan",
            onPress: (val?: string) => {
              if (!val || isNaN(Number(val)) || parseInt(val) < 0) {
                Alert.alert("Gagal", "Masukkan angka stok yang valid.");
                return;
              }
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === id ? { ...p, stock: parseInt(val) } : p,
                ),
              );
            },
          },
        ],
        "plain-text",
        currentStock.toString(),
      );
    } else {
      Alert.alert(
        "Info",
        "Gunakan tombol edit (pensil) untuk mengubah stok di Android.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0056b3" />

      <LinearGradient colors={["#0056b3", "#007AFF"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.roleText}>Super Admin Panel v2.6</Text>
            <Text style={styles.adminName}>Operational Command</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogoutPress}
            style={styles.logoutBtn}
          >
            <MaterialCommunityIcons name="power" size={24} color="#fff" />
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

      <View style={{ flex: 1 }}>
        {activeTab === "inventory" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={styles.content}>
              <View style={styles.statsRow}>
                <View style={styles.miniCard}>
                  <Text style={styles.miniLabel}>Total SKU</Text>
                  <Text style={styles.miniValue}>{products.length}</Text>
                </View>
                <View
                  style={[
                    styles.miniCard,
                    stats.lowStock > 0 && { backgroundColor: "#FFF0F0" },
                  ]}
                >
                  <Text style={styles.miniLabel}>Stok Tipis</Text>
                  <Text
                    style={[
                      styles.miniValue,
                      stats.lowStock > 0 && { color: "#FF3B30" },
                    ]}
                  >
                    {stats.lowStock}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Manajemen Katalog</Text>
                <TouchableOpacity
                  style={styles.bulkBtn}
                  onPress={() => {
                    setEditingId(null);
                    setForm({
                      brand: "",
                      name: "",
                      price: "",
                      stock: "",
                      gender: "Pria",
                      category: "",
                      sizes: [],
                    });
                    setIsModalVisible(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={16}
                    color="#007AFF"
                  />
                  <Text style={styles.bulkText}>Tambah SKU</Text>
                </TouchableOpacity>
              </View>

              {products.map((item) => (
                <View key={item.id} style={styles.productCard}>
                  <View style={styles.cardInfo}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Text style={styles.brandTag}>{item.brand}</Text>
                      <Text style={styles.genderTag}>{item.gender}</Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.stockInfo}
                      onPress={() =>
                        handleEditStock(item.id, item.stock, item.name)
                      }
                    >
                      <Text
                        style={[
                          styles.stockNum,
                          item.stock < 5 && { color: "#FF3B30" },
                        ]}
                      >
                        {item.stock}
                      </Text>
                      <Text style={styles.stockLabel}>Stok</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editBtn, { backgroundColor: "#E1EFFF" }]}
                      onPress={() => {
                        setEditingId(item.id);
                        setForm({
                          brand: item.brand,
                          name: item.name,
                          price: item.price.toString(),
                          stock: item.stock.toString(),
                          gender: item.gender,
                          category: item.category,
                          sizes: item.sizes || [], // Masukkan ukuran yang ada saat edit
                        });
                        setIsModalVisible(true);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={16}
                        color="#007AFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editBtn, { backgroundColor: "#FFF0F0" }]}
                      onPress={() =>
                        Alert.alert("Hapus", `Yakin hapus ${item.name}?`, [
                          { text: "Batal" },
                          {
                            text: "Hapus",
                            style: "destructive",
                            onPress: () =>
                              setProducts(
                                products.filter((p) => p.id !== item.id),
                              ),
                          },
                        ])
                      }
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={16}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            stats={stats}
            products={products}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "orders" && <OrdersTab />}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </Text>

              <Text style={styles.inputLabel}>Informasi Dasar</Text>
              <TextInput
                placeholder="Brand (Contoh: Nike, Adidas)"
                style={styles.input}
                value={form.brand}
                onChangeText={(t) => setForm({ ...form, brand: t })}
              />
              <TextInput
                placeholder="Nama Model"
                style={styles.input}
                value={form.name}
                onChangeText={(t) => setForm({ ...form, name: t })}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  placeholder="Harga"
                  keyboardType="numeric"
                  style={[styles.input, { flex: 2 }]}
                  value={form.price}
                  onChangeText={(t) => setForm({ ...form, price: t })}
                />
                <TextInput
                  placeholder="Stok"
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1 }]}
                  value={form.stock}
                  onChangeText={(t) => setForm({ ...form, stock: t })}
                />
              </View>

              <Text style={styles.inputLabel}>Pilih Kategori</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                <View style={styles.categoryRow}>
                  {SHOE_CATEGORIES.map((catName) => (
                    <TouchableOpacity
                      key={catName}
                      style={[
                        styles.categoryBtn,
                        form.category === catName && styles.categoryBtnActive,
                      ]}
                      onPress={() => setForm({ ...form, category: catName })}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          form.category === catName && { color: "#fff" },
                        ]}
                      >
                        {catName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* --- BAGIAN BARU: PILIHAN UKURAN --- */}
              <Text style={styles.inputLabel}>Ukuran Tersedia (35 - 46)</Text>
              <View style={styles.sizeContainer}>
                {SHOE_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      form.sizes.includes(size) && styles.sizeChipActive,
                    ]}
                    onPress={() => toggleSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        form.sizes.includes(size) && { color: "#fff" },
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Target Gender</Text>
              <View style={styles.genderRow}>
                {["Pria", "Wanita", "Unisex"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderBtn,
                      form.gender === g && styles.genderBtnActive,
                    ]}
                    onPress={() => setForm({ ...form, gender: g })}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        form.gender === g && { color: "#fff" },
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={{ fontWeight: "600" }}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Simpan Perubahan
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: Platform.OS === "android" ? 45 : 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleText: { color: "#E1EFFF", fontSize: 11, fontWeight: "bold" },
  adminName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  logoutBtn: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 25,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 15,
    padding: 5,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#E1EFFF", fontSize: 13, fontWeight: "bold" },
  tabTextActive: { color: "#0056b3" },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  statsRow: { flexDirection: "row", gap: 15, marginBottom: 25 },
  miniCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  miniLabel: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  miniValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0056b3",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E1EFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bulkText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  brandTag: { fontSize: 10, color: "#007AFF", fontWeight: "bold" },
  genderTag: {
    fontSize: 9,
    color: "#888",
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 5,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
    color: "#1C1C1E",
  },
  itemPrice: {
    fontSize: 13,
    color: "#0056b3",
    fontWeight: "700",
    marginTop: 2,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  stockInfo: {
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockNum: { fontSize: 16, fontWeight: "bold" },
  stockLabel: { fontSize: 9, color: "#888" },
  editBtn: { padding: 10, borderRadius: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: height * 0.85,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1C1C1E",
  },
  input: {
    backgroundColor: "#f1f4f9",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    marginBottom: 8,
    marginTop: 5,
    textTransform: "uppercase",
  },
  categoryScroll: { marginBottom: 15 },
  categoryRow: { flexDirection: "row", gap: 8 },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  categoryBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  categoryText: { fontSize: 12, fontWeight: "bold", color: "#666" },

  // Style Baru untuk Ukuran
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 15,
  },
  sizeChip: {
    width: 42,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  sizeChipActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  sizeText: { fontSize: 13, fontWeight: "600", color: "#666" },

  genderRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  genderBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  genderBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  genderText: { fontSize: 12, fontWeight: "bold", color: "#666" },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    paddingBottom: 20,
  },
  btnCancel: {
    flex: 1,
    padding: 18,
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 18,
  },
  btnSave: {
    flex: 2,
    padding: 18,
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 18,
  },
});
