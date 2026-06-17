import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Product } from "./productsData"; 

const { height } = Dimensions.get("window");

interface AddProductProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Product) => void; 
}

const SHOE_SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

// --- PERBAIKAN: Gunakan string[] untuk sizes agar sinkron dengan data produk ---
const INITIAL_STATE = {
  brand: "",
  name: "",
  price: "",
  stock: "",
  gender: "Pria",
  category: "",
  imageUrl: "",
  sizes: [] as string[], 
};

const AddProductModal = ({ visible, onClose, onSave }: AddProductProps) => {
  const [form, setForm] = useState(INITIAL_STATE);

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSave = () => {
    const { brand, name, price, stock, category, imageUrl, sizes } = form;

    // 1. Validasi
    if (!brand || !name || !price || !stock || !category || !imageUrl || sizes.length === 0) {
      Alert.alert("Data Tidak Lengkap", "Harap isi semua kolom.");
      return;
    }

    // 2. Mapping data ke Interface Product (MENGHAPUS MERAH/ERROR)
    const formattedProduct: Product = {
      id: Date.now(), 
      brand: brand.trim(),
      name: name.trim(),
      price: parseInt(price.replace(/[^0-9]/g, "")) || 0,
      stock: parseInt(stock.replace(/[^0-9]/g, "")) || 0,
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      gender: form.gender,
      sizes: sizes, // Sudah berupa string[]
      sales: 0
    };

    onSave(formattedProduct);
    handleClose();
  };

  const handleClose = () => {
    setForm(INITIAL_STATE);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.handleBar} />
          
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Koleksi</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialCommunityIcons name="close-circle" size={28} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.label}>Preview Visual</Text>
            <View style={styles.imagePreviewContainer}>
              {form.imageUrl ? (
                <Image 
                  source={{ uri: form.imageUrl }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <MaterialCommunityIcons name="image-plus" size={40} color="#94A3B8" />
                  <Text style={styles.placeholderText}>Gambar akan muncul di sini</Text>
                </View>
              )}
            </View>

            <TextInput
              placeholder="Tempel URL Gambar (https://...)"
              style={[styles.input, styles.imageInput]} 
              value={form.imageUrl}
              onChangeText={(t) => setForm({ ...form, imageUrl: t })}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Informasi Produk</Text>
            <TextInput
              placeholder="Brand (contoh: Nike)"
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
            <TextInput
              placeholder="Kategori (contoh: Running)"
              style={styles.input}
              value={form.category}
              onChangeText={(t) => setForm({ ...form, category: t })}
            />

            <View style={styles.row}>
              <View style={{ flex: 2, marginRight: 10 }}>
                <Text style={styles.label}>Harga (Rp)</Text>
                <TextInput
                  placeholder="1500000"
                  keyboardType="numeric"
                  style={styles.input}
                  value={form.price}
                  onChangeText={(t) => setForm({ ...form, price: t })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Stok</Text>
                <TextInput
                  placeholder="10"
                  keyboardType="numeric"
                  style={styles.input}
                  value={form.stock}
                  onChangeText={(t) => setForm({ ...form, stock: t })}
                />
              </View>
            </View>

            <Text style={styles.label}>Ukuran Tersedia</Text>
            <View style={styles.sizeContainer}>
              {SHOE_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => toggleSize(size)}
                  style={[
                    styles.sizeChip,
                    form.sizes.includes(size) && styles.sizeChipActive
                  ]}
                >
                  <Text style={[
                    styles.sizeText,
                    form.sizes.includes(size) && { color: "#fff" }
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={handleClose}>
                <Text style={styles.textCancel}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                <LinearGradient 
                  colors={["#007AFF", "#0056B3"]} 
                  style={styles.gradientBtn}
                >
                  <Text style={styles.textSave}>Simpan Produk</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.75)", justifyContent: "flex-end" },
  content: { backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: height * 0.85 },
  handleBar: { width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1E293B" },
  label: { fontSize: 11, fontWeight: "800", color: "#64748B", textTransform: "uppercase", marginBottom: 8, marginTop: 12, letterSpacing: 1 },
  imagePreviewContainer: { width: "100%", height: 150, backgroundColor: "#F8FAFC", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0", borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
  previewImage: { width: "90%", height: "90%" },
  placeholderImage: { alignItems: "center" },
  placeholderText: { fontSize: 12, color: "#94A3B8", marginTop: 8 },
  input: { backgroundColor: "#F1F5F9", padding: 14, borderRadius: 12, fontSize: 15, color: "#1E293B", marginBottom: 10 },
  imageInput: { marginTop: 10, borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  row: { flexDirection: "row" },
  sizeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 10 },
  sizeChip: { width: 45, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 10, backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0" },
  sizeChipActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  sizeText: { fontSize: 13, fontWeight: "bold", color: "#475569" },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 25 },
  btnCancel: { flex: 1, padding: 16, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9" },
  btnSave: { flex: 2, borderRadius: 16, overflow: "hidden" },
  gradientBtn: { padding: 16, alignItems: "center", justifyContent: "center" },
  textCancel: { color: "#64748B", fontWeight: "bold" },
  textSave: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default AddProductModal;