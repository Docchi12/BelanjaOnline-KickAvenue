import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    TextInput,  
    Platform, 
    StatusBar, 
    Modal,
    FlatList,
    SafeAreaView, 
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --- DATABASE TETAP LENGKAP (TIDAK ADA YANG DIHAPUS) ---
const ALL_PRODUCTS_DATA: Record<string, any[]> = {
    'Nike': [
        { id: 101, brand: 'Nike', name: 'Air Jordan 1 Low', price: 'Rp 1.929.000', numericPrice: 1929000, gender: 'Pria', category: 'Lifestyle', rating: 4.9, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=400' },
        { id: 102, brand: 'Nike', name: 'Vaporfly 3', price: 'Rp 3.549.000', numericPrice: 3549000, gender: 'Unisex', category: 'Running shoes', rating: 4.8, sizes: [38, 39, 40], image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400' },
        { id: 103, brand: 'Nike', name: 'Phantom GX 2', price: 'Rp 3.299.000', numericPrice: 3299000, gender: 'Pria', category: 'Football shoes', rating: 5.0, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400' },
        { id: 104, brand: 'Nike', name: 'G.T. Hustle 2', price: 'Rp 2.489.000', numericPrice: 2489000, gender: 'Pria', category: 'Basketball shoes', rating: 4.7, sizes: [42, 43, 44], image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=400' },
    ],
    'Adidas': [
        { id: 201, brand: 'Adidas', name: 'Ultraboost Light', price: 'Rp 3.300.000', numericPrice: 3300000, gender: 'Pria', category: 'Running shoes', rating: 4.9, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=400' },
        { id: 202, brand: 'Adidas', name: 'Samba OG', price: 'Rp 2.200.000', numericPrice: 2200000, gender: 'Wanita', category: 'Lifestyle', rating: 4.8, sizes: [38, 39, 40], image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400' },
        { id: 203, brand: 'Adidas', name: 'Predator Elite', price: 'Rp 4.000.000', numericPrice: 4000000, gender: 'Pria', category: 'Football shoes', rating: 5.0, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?q=80&w=400' },
        { id: 204, brand: 'Adidas', name: 'Dropset 2 Trainer', price: 'Rp 1.900.000', numericPrice: 1900000, gender: 'Wanita', category: 'Training shoes', rating: 4.6, sizes: [37, 38, 39], image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400' },
    ],
    'New Balance': [
        { id: 401, brand: 'New Balance', name: '530 Silver Grey', price: 'Rp 1.850.000', numericPrice: 1850000, gender: 'Pria', category: 'Lifestyle', rating: 4.7, sizes: [39, 40, 41], image: 'https://images.unsplash.com/photo-1636718282214-0b4100576307?q=80&w=400' },
        { id: 402, brand: 'New Balance', name: 'NB 2002R Grey', price: 'Rp 2.599.000', numericPrice: 2599000, gender: 'Pria', category: 'Chunky sneakers', rating: 4.8, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1620138546344-7b2c38517dee?q=80&w=400' },
        { id: 403, brand: 'New Balance', name: 'Fresh Foam X', price: 'Rp 2.799.000', numericPrice: 2799000, gender: 'Pria', category: 'Running shoes', rating: 4.7, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400' },
        { id: 404, brand: 'New Balance', name: 'NB 9060 Blue', price: 'Rp 2.999.000', numericPrice: 2999000, gender: 'Wanita', category: 'Chunky sneakers', rating: 4.9, sizes: [37, 38, 39], image: 'https://images.unsplash.com/photo-1671041926610-85f838639097?q=80&w=400' },
    ],
    'Skechers': [
        { id: 301, brand: 'Skechers', name: 'GoWalk 6', price: 'Rp 999.000', numericPrice: 999000, gender: 'Pria', category: 'Walking shoes', rating: 4.8, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400' },
        { id: 302, brand: 'Skechers', name: 'Max Cushioning', price: 'Rp 1.399.000', numericPrice: 1399000, gender: 'Wanita', category: 'Training shoes', rating: 4.7, sizes: [37, 38, 39], image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=400' },
        { id: 303, brand: 'Skechers', name: 'D-Lites 4.0', price: 'Rp 1.199.000', numericPrice: 1199000, gender: 'Wanita', category: 'Chunky sneakers', rating: 4.6, sizes: [36, 37, 38], image: 'https://images.unsplash.com/photo-1605405748313-a416a1b84491?q=80&w=400' },
        { id: 304, brand: 'Skechers', name: 'Arch Fit Road', price: 'Rp 1.599.000', numericPrice: 1599000, gender: 'Pria', category: 'Running shoes', rating: 4.8, sizes: [42, 43, 44], image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=400' },
    ],
    'Puma': [
        { id: 501, brand: 'Puma', name: 'RS-X Efekt', price: 'Rp 1.999.000', numericPrice: 1999000, gender: 'Unisex', category: 'Chunky sneakers', rating: 4.8, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400' },
        { id: 502, brand: 'Puma', name: 'Suede Classic', price: 'Rp 1.199.000', numericPrice: 1199000, gender: 'Unisex', category: 'Lifestyle', rating: 4.7, sizes: [39, 40, 41], image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=400' },
        { id: 503, brand: 'Puma', name: 'Deviate Nitro', price: 'Rp 2.799.000', numericPrice: 2799000, gender: 'Pria', category: 'Running shoes', rating: 4.9, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1512374382149-4332c6c02151?q=80&w=400' },
        { id: 504, brand: 'Puma', name: 'Future Ultimate', price: 'Rp 3.199.000', numericPrice: 3199000, gender: 'Pria', category: 'Football shoes', rating: 4.8, sizes: [41, 42], image: 'https://images.unsplash.com/photo-1633467433309-84081c741490?q=80&w=400' },
    ],
    'Vans': [
        { id: 601, brand: 'Vans', name: 'Old Skool Black', price: 'Rp 1.100.000', numericPrice: 1100000, gender: 'Pria', category: 'Skate shoes', rating: 4.5, sizes: [38, 39, 40, 41], image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400' },
        { id: 602, brand: 'Vans', name: 'Sk8-Hi High', price: 'Rp 1.299.000', numericPrice: 1299000, gender: 'Pria', category: 'Skate shoes', rating: 4.8, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1565357419076-6abbad3f5924?q=80&w=400' },
        { id: 603, brand: 'Vans', name: 'Slip-On Checker', price: 'Rp 999.000', numericPrice: 999000, gender: 'Unisex', category: 'Lifestyle', rating: 4.7, sizes: [37, 38, 39], image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=400' },
        { id: 604, brand: 'Vans', name: 'Knu Skool', price: 'Rp 1.499.000', numericPrice: 1499000, gender: 'Pria', category: 'Chunky sneakers', rating: 4.9, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?q=80&w=400' },
    ],
    'Converse': [
        { id: 701, brand: 'Converse', name: 'Chuck Taylor 70s', price: 'Rp 999.000', numericPrice: 999000, gender: 'Wanita', category: 'Lifestyle', rating: 4.6, sizes: [39, 40, 41], image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=400' },
        { id: 702, brand: 'Converse', name: 'Run Star Hike', price: 'Rp 1.799.000', numericPrice: 1799000, gender: 'Wanita', category: 'Chunky sneakers', rating: 4.8, sizes: [36, 37, 38], image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=400' },
        { id: 703, brand: 'Converse', name: 'Jack Purcell', price: 'Rp 1.099.000', numericPrice: 1099000, gender: 'Pria', category: 'Lifestyle', rating: 4.7, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=400' },
        { id: 704, brand: 'Converse', name: 'BB Shift', price: 'Rp 1.699.000', numericPrice: 1699000, gender: 'Pria', category: 'Basketball shoes', rating: 4.6, sizes: [42, 43, 44], image: 'https://images.unsplash.com/photo-1533681018184-68bd1d8f39fe?q=80&w=400' },
    ],
    'Reebok': [
        { id: 801, brand: 'Reebok', name: 'Nano X3', price: 'Rp 2.199.000', numericPrice: 2199000, gender: 'Pria', category: 'Training shoes', rating: 4.8, sizes: [41, 42, 43], image: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=400' },
        { id: 802, brand: 'Reebok', name: 'Club C 85', price: 'Rp 1.299.000', numericPrice: 1299000, gender: 'Unisex', category: 'Lifestyle', rating: 4.7, sizes: [39, 40, 41], image: 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?q=80&w=400' },
        { id: 803, brand: 'Reebok', name: 'Classic Leather', price: 'Rp 1.299.000', numericPrice: 1299000, gender: 'Unisex', category: 'Lifestyle', rating: 4.7, sizes: [40, 41], image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400' },
        { id: 804, brand: 'Reebok', name: 'Floatride Energy', price: 'Rp 1.699.000', numericPrice: 1699000, gender: 'Wanita', category: 'Running shoes', rating: 4.8, sizes: [37, 38, 39], image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=400' },
    ]
};

const FILTER_SECTIONS = [
    { id: 'category', label: 'Kategori', options: ['Lifestyle', 'Running shoes', 'Skate shoes', 'Training shoes', 'Chunky sneakers', 'Walking shoes', 'Basketball shoes', 'Football shoes'] },
    { id: 'gender', label: 'Gender', options: ['Pria', 'Wanita', 'Unisex'] },
    { id: 'size', label: 'Ukuran', options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
    { id: 'rating', label: 'Rating', options: ['5 Bintang', '4+ Bintang', '3+ Bintang'] },
    { id: 'price', label: 'Harga', options: ['Di bawah 1jt', '1jt - 2jt', 'Di atas 2jt'] },
];

export default function BrandProducts({ brandName, onBack, onProductPress }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('category');
    
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        category: [], gender: [], size: [], rating: [], price: []
    });

    // FIX: Tambahkan pengecekan null/undefined agar tidak error saat render
    const filteredProducts = useMemo(() => {
        // Jika data merk tidak ada, return array kosong biar gak crash
        let products = ALL_PRODUCTS_DATA[brandName] || [];
        
        if (searchQuery) {
            products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return products.filter(p => {
            const matchCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(p.category);
            const matchGender = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(p.gender);
            // FIX: Cek apakah p.sizes ada sebelum akses .some
            const matchSize = selectedFilters.size.length === 0 || (p.sizes && p.sizes.some((s: any) => selectedFilters.size.includes(s.toString())));
            
            const matchRating = selectedFilters.rating.length === 0 || selectedFilters.rating.some(f => {
                if (f === '5 Bintang') return p.rating === 5;
                if (f === '4+ Bintang') return p.rating >= 4;
                return p.rating >= 3;
            });

            const matchPrice = selectedFilters.price.length === 0 || selectedFilters.price.some(f => {
                if (f === 'Di bawah 1jt') return p.numericPrice < 1000000;
                if (f === '1jt - 2jt') return p.numericPrice >= 1000000 && p.numericPrice <= 2000000;
                return p.numericPrice > 2000000;
            });

            return matchCategory && matchGender && matchSize && matchRating && matchPrice;
        });
    }, [brandName, searchQuery, selectedFilters]);

    const toggleFilter = (sectionId: string, option: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [sectionId]: prev[sectionId].includes(option) 
                ? prev[sectionId].filter(item => item !== option) 
                : [...prev[sectionId], option]
        }));
    };

    const activeFilterCount = Object.values(selectedFilters).flat().length;

    const renderProductItem = ({ item }: any) => (
        <TouchableOpacity style={styles.productCard} onPress={() => onProductPress(item)}>
            <View style={styles.imageBox}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                {item.rating >= 4.9 && (
                    <View style={styles.topRatedBadge}><Text style={styles.topRatedText}>Bestseller</Text></View>
                )}
            </View>
            <View style={styles.productInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.genderBadge}><Text style={styles.genderBadgeText}>{item.gender}</Text></View>
                </View>
                <Text style={styles.categoryLabel}>{item.category}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#888" />
                    <TextInput 
                        placeholder={`Cari di ${brandName}...`} 
                        style={styles.searchInput} 
                        value={searchQuery} 
                        onChangeText={setSearchQuery} 
                    />
                </View>
                <TouchableOpacity style={[styles.filterTrigger, activeFilterCount > 0 && styles.filterActive]} onPress={() => setIsFilterVisible(true)}>
                    <Ionicons name="options-outline" size={22} color={activeFilterCount > 0 ? "#fff" : "#007AFF"} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.scrollPadding}
                ListHeaderComponent={<Text style={styles.resultsText}>{`Menampilkan ${filteredProducts.length} produk ${brandName}`}</Text>}
            />

            <Modal visible={isFilterVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsFilterVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
                        <Text style={styles.modalTitle}>Filter Produk</Text>
                        <TouchableOpacity onPress={() => setSelectedFilters({category: [], gender: [], size: [], rating: [], price: []})}><Text style={styles.resetText}>Reset</Text></TouchableOpacity>
                    </View>
                    <View style={styles.filterBody}>
                        <View style={styles.sidebar}>
                            {FILTER_SECTIONS.map((section) => (
                                <TouchableOpacity 
                                    key={section.id} 
                                    style={[styles.sidebarItem, activeSection === section.id && styles.activeSidebarItem]} 
                                    onPress={() => setActiveSection(section.id)}
                                >
                                    <Text style={[styles.sidebarText, activeSection === section.id && styles.activeSidebarText]}>{section.label}</Text>
                                    {selectedFilters[section.id]?.length > 0 && <View style={styles.dotIndicator} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.contentTitle}>Pilih {FILTER_SECTIONS.find(s => s.id === activeSection)?.label}</Text>
                            <View style={styles.optionsGrid}>
                                {FILTER_SECTIONS.find(s => s.id === activeSection)?.options.map((option) => (
                                    <TouchableOpacity 
                                        key={option} 
                                        style={[styles.optionChip, (selectedFilters[activeSection] || []).includes(option) && styles.selectedChip]} 
                                        onPress={() => toggleFilter(activeSection, option)}
                                    >
                                        <Text style={[styles.optionChipText, (selectedFilters[activeSection] || []).includes(option) && styles.selectedChipText]}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
                            <Text style={styles.applyBtnText}>Tampilkan {filteredProducts.length} Hasil</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    iconButton: { padding: 4 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 40 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
    filterTrigger: { padding: 8, backgroundColor: '#EBF5FF', borderRadius: 10 },
    filterActive: { backgroundColor: '#007AFF' },
    scrollPadding: { padding: 15, paddingBottom: 30 },
    resultsText: { fontSize: 12, color: '#888', marginBottom: 15 },
    gridRow: { justifyContent: 'space-between' },
    productCard: { width: (width - 45) / 2, marginBottom: 20 },
    imageBox: { height: 180, backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden', position: 'relative' },
    productImage: { width: '100%', height: '100%' },
    topRatedBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    topRatedText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    productInfo: { paddingTop: 10, paddingHorizontal: 4 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    productName: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
    genderBadge: { backgroundColor: '#EBF5FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    genderBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#007AFF' },
    categoryLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
    productPrice: { fontSize: 15, fontWeight: '800', color: '#000' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    ratingText: { fontSize: 11, color: '#666' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    resetText: { color: '#FF3B30', fontWeight: '600' },
    filterBody: { flex: 1, flexDirection: 'row' },
    sidebar: { width: 110, backgroundColor: '#F9FAFB' },
    sidebarItem: { paddingVertical: 20, paddingHorizontal: 15, position: 'relative' },
    activeSidebarItem: { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#007AFF' },
    sidebarText: { fontSize: 13, color: '#666' },
    activeSidebarText: { color: '#007AFF', fontWeight: 'bold' },
    dotIndicator: { position: 'absolute', right: 10, top: 20, width: 6, height: 6, borderRadius: 3, backgroundColor: '#007AFF' },
    content: { flex: 1, padding: 20 },
    contentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
    optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    optionChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    selectedChip: { borderColor: '#007AFF', backgroundColor: '#EBF5FF' },
    optionChipText: { fontSize: 12, color: '#333' },
    selectedChipText: { color: '#007AFF', fontWeight: 'bold' },
    modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
    applyBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});