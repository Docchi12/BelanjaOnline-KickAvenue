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

// --- DATABASE INTERNAL (MOCK DATA) ---
const ALL_PRODUCTS_DATA = [
    // NIKE
    { id: 101, brand: 'Nike', name: 'Air Jordan 1 Low', price: 'Rp 1.929.000', numericPrice: 1929000, gender: 'Pria', category: 'Lifestyle', rating: 4.9, reviews: 150, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=400' },
    { id: 102, brand: 'Nike', name: 'Vaporfly 3', price: 'Rp 3.549.000', numericPrice: 3549000, gender: 'Unisex', category: 'Running shoes', rating: 4.8, reviews: 45, sizes: [38, 39, 40], image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400' },
    // ADIDAS
    { id: 201, brand: 'Adidas', name: 'Ultraboost Light', price: 'Rp 3.300.000', numericPrice: 3300000, gender: 'Pria', category: 'Running shoes', rating: 4.9, reviews: 88, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=400' },
    { id: 202, brand: 'Adidas', name: 'Samba OG', price: 'Rp 2.200.000', numericPrice: 2200000, gender: 'Wanita', category: 'Lifestyle', rating: 4.8, reviews: 210, sizes: [38, 39, 40], image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400' },
    // NEW BALANCE
    { id: 401, brand: 'New Balance', name: '530 Silver Grey', price: 'Rp 1.850.000', numericPrice: 1850000, gender: 'Pria', category: 'Lifestyle', rating: 4.7, reviews: 320, sizes: [39, 40, 41], image: 'https://images.unsplash.com/photo-1636718282214-0b4100576307?q=80&w=400' },
    // SKECHERS
    { id: 301, brand: 'Skechers', name: 'GoWalk 6', price: 'Rp 999.000', numericPrice: 999000, gender: 'Pria', category: 'Walking shoes', rating: 4.8, reviews: 56, sizes: [40, 41, 42], image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400' },
];

// Bagian Kategori di file Brand diubah jadi Merk di sini
const FILTER_SECTIONS = [
    { id: 'brand', label: 'Merk', options: ['Nike', 'Adidas', 'New Balance', 'Skechers', 'Puma', 'Vans', 'Converse', 'Reebok'] },
    { id: 'gender', label: 'Gender', options: ['Pria', 'Wanita', 'Unisex'] },
    { id: 'size', label: 'Ukuran', options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
    { id: 'price', label: 'Harga', options: ['Di bawah 1jt', '1jt - 2jt', 'Di atas 2jt'] },
    { id: 'rating', label: 'Rating', options: ['5 Bintang', '4+ Bintang', '3+ Bintang'] },
];

export default function CategoryProducts({ categoryName, onBack, onProductPress }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('brand'); // Default ke merk
    
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        brand: [], gender: [], size: [], rating: [], price: []
    });

    const filteredProducts = useMemo(() => {
        let products = ALL_PRODUCTS_DATA;
        
        // Filter berdasarkan kategori yang dipilih dari home (misal: "Running")
        if (categoryName) {
            products = products.filter(p => p.category.toLowerCase().includes(categoryName.toLowerCase()));
        }

        if (searchQuery) {
            products = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return products.filter(p => {
            const matchBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(p.brand);
            const matchGender = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(p.gender);
            const matchSize = selectedFilters.size.length === 0 || (p.sizes && p.sizes.some((s: any) => selectedFilters.size.includes(s.toString())));
            
            const matchPrice = selectedFilters.price.length === 0 || selectedFilters.price.some(f => {
                if (f === 'Di bawah 1jt') return p.numericPrice < 1000000;
                if (f === '1jt - 2jt') return p.numericPrice >= 1000000 && p.numericPrice <= 2000000;
                return p.numericPrice > 2000000;
            });

            const matchRating = selectedFilters.rating.length === 0 || selectedFilters.rating.some(f => {
                if (f === '5 Bintang') return p.rating === 5;
                if (f === '4+ Bintang') return p.rating >= 4;
                return p.rating >= 3;
            });

            return matchBrand && matchGender && matchSize && matchPrice && matchRating;
        });
    }, [categoryName, searchQuery, selectedFilters]);

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
                <Text style={styles.brandLabel}>{item.brand} • {item.category}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating} <Text style={{color:'#ccc'}}>({item.reviews})</Text></Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header sesuai BrandProducts */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#888" />
                    <TextInput 
                        placeholder={`Cari ${categoryName}...`} 
                        style={styles.searchInput} 
                        value={searchQuery} 
                        onChangeText={setSearchQuery} 
                    />
                </View>
                <TouchableOpacity style={[styles.filterTrigger, activeFilterCount > 0 && styles.filterActive]} onPress={() => setIsFilterVisible(true)}>
                    <Ionicons name="options-outline" size={22} color={activeFilterCount > 0 ? "#fff" : "#2196F3"} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.scrollPadding}
                ListHeaderComponent={<Text style={styles.resultsText}>{`Menampilkan ${filteredProducts.length} hasil untuk "${categoryName}"`}</Text>}
            />

            {/* Modal Filter - Kategori diganti Merk */}
            <Modal visible={isFilterVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsFilterVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
                        <Text style={styles.modalTitle}>Filter Produk</Text>
                        <TouchableOpacity onPress={() => setSelectedFilters({brand: [], gender: [], size: [], rating: [], price: []})}><Text style={styles.resetText}>Reset</Text></TouchableOpacity>
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
    filterTrigger: { padding: 8, backgroundColor: '#E3F2FD', borderRadius: 10 },
    filterActive: { backgroundColor: '#2196F3' },
    scrollPadding: { padding: 15, paddingBottom: 30 },
    resultsText: { fontSize: 12, color: '#888', marginBottom: 15 },
    gridRow: { justifyContent: 'space-between' },
    productCard: { width: (width - 45) / 2, marginBottom: 20 },
    imageBox: { height: 170, backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
    productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    topRatedBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    topRatedText: { fontSize: 10, fontWeight: 'bold' },
    productInfo: { paddingTop: 10 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    productName: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1 },
    genderBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    genderBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#2196F3' },
    brandLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
    productPrice: { fontSize: 15, fontWeight: '800', color: '#2196F3' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    ratingText: { fontSize: 11, color: '#666' },

    // Modal Styles
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    resetText: { color: '#FF3B30', fontWeight: '600' },
    filterBody: { flex: 1, flexDirection: 'row' },
    sidebar: { width: 110, backgroundColor: '#F9FAFB' },
    sidebarItem: { paddingVertical: 20, paddingHorizontal: 15 },
    activeSidebarItem: { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#2196F3' },
    sidebarText: { fontSize: 13, color: '#666' },
    activeSidebarText: { color: '#2196F3', fontWeight: 'bold' },
    dotIndicator: { position: 'absolute', right: 10, top: 20, width: 6, height: 6, borderRadius: 3, backgroundColor: '#2196F3' },
    content: { flex: 1, padding: 20 },
    contentTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
    optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    optionChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    selectedChip: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
    optionChipText: { fontSize: 12, color: '#333' },
    selectedChipText: { color: '#2196F3', fontWeight: 'bold' },
    modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
    applyBtn: { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center' },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});