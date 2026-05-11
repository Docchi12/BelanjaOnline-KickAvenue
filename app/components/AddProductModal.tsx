import React, { useState } from 'react';
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
    Platform
} from 'react-native';

const { height } = Dimensions.get('window');

interface AddProductProps {
    visible: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
}

// PERBAIKAN 1: Menggunakan export default agar Expo Router tidak memberikan warning
const AddProductModal = ({ visible, onClose, onSave }: AddProductProps) => {
    const [form, setForm] = useState({
        brand: '',
        name: '',
        price: '',
        stock: '',
        gender: 'Pria',
        category: ''
    });

    const handleSave = () => {
        if (!form.brand || !form.name || !form.price || !form.stock) {
            alert("Harap isi semua data!");
            return;
        }
        
        onSave(form);
        // Reset form setelah simpan
        setForm({ brand: '', name: '', price: '', stock: '', gender: 'Pria', category: '' });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            {/* KeyboardAvoidingView memastikan input tidak tertutup keyboard di iOS/Android */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.overlay}
            >
                <View style={styles.content}>
                    <View style={styles.handleBar} />
                    <Text style={styles.title}>Tambah Koleksi Baru</Text>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>Informasi Produk</Text>
                        <TextInput 
                            placeholder="Brand (contoh: Nike)" 
                            style={styles.input} 
                            value={form.brand}
                            onChangeText={(t) => setForm({...form, brand: t})} 
                        />
                        <TextInput 
                            placeholder="Nama Model Sepatu" 
                            style={styles.input} 
                            value={form.name}
                            onChangeText={(t) => setForm({...form, name: t})} 
                        />
                        <TextInput 
                            placeholder="Kategori (contoh: Running)" 
                            style={styles.input} 
                            value={form.category}
                            onChangeText={(t) => setForm({...form, category: t})} 
                        />
                        
                        <Text style={styles.label}>Harga & Inventaris</Text>
                        <TextInput 
                            placeholder="Harga (Rp)" 
                            keyboardType="numeric"
                            style={styles.input} 
                            value={form.price}
                            onChangeText={(t) => setForm({...form, price: t})} 
                        />
                        <TextInput 
                            placeholder="Stok Awal" 
                            keyboardType="numeric"
                            style={styles.input} 
                            value={form.stock}
                            onChangeText={(t) => setForm({...form, stock: t})} 
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                                <Text style={styles.textCancel}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                                <Text style={styles.textSave}>Simpan Produk</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Spacing tambahan agar tidak mentok navigasi bawah */}
                        <View style={{height: 40}} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        maxHeight: height * 0.85,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0056b3',
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10,
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: '#F5F8FB',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E1E9F1',
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    btnCancel: {
        flex: 1,
        padding: 16,
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    btnSave: {
        flex: 2,
        padding: 16,
        borderRadius: 15,
        alignItems: 'center',
        backgroundColor: '#007AFF',
        elevation: 3,
        shadowColor: '#007AFF',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
    },
    textCancel: {
        color: '#666',
        fontWeight: 'bold',
    },
    textSave: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

// WAJIB: Export default diletakkan di paling bawah
export default AddProductModal;