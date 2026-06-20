import React, { useState, useEffect, useMemo } from 'react';
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
    Image,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const FILTER_SECTIONS = [
    { id: 'category', label: 'Kategori', options: ['Lifestyle', 'Running shoes', 'Skate shoes', 'Training shoes', 'Chunky sneakers', 'Walking shoes', 'Basketball shoes', 'Football shoes'] },
    { id: 'gender', label: 'Gender', options: ['Pria', 'Wanita', 'Unisex'] },
    { id: 'size', label: 'Ukuran', options: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] },
    { id: 'rating', label: 'Rating', options: ['5 Bintang', '4+ Bintang', '3+ Bintang'] },
    { id: 'price', label: 'Harga', options: ['Di bawah 1jt', '1jt - 2jt', 'Di atas 2jt'] },
];

export default function BrandProducts({ brandName, onBack, onProductPress }: any) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('category');
    
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        category: [], gender: [], size: [], rating: [], price: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Menambahkan filter .gt('stock', 0) agar produk habis tidak tampil
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('brand', brandName)
                .gt('stock', 0); 
            
            if (error) {
                console.error("Error fetching products:", error);
            } else {
                const formatted = (data || []).map(item => ({
                    ...item,
                    imageUrl: item.image_url, 
                    rating: item.rating || 0,
                    numericPrice: Number(item.price) 
                }));
                setProducts(formatted);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [brandName]);

    const filteredProducts = useMemo(() => {
        let list = products;
        
        if (searchQuery) {
            list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return list.filter(p => {
            const matchCategory = selectedFilters.category.length === 0 || selectedFilters.category.includes(p.category);
            const matchGender = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(p.gender);
            const matchSize = selectedFilters.size.length === 0 || (p.sizes && p.sizes.some((s: any) => selectedFilters.size.includes(s.toString())));
            
            const matchRating = selectedFilters.rating.length === 0 || selectedFilters.rating.some(f => {
                if (f === '5 Bintang') return p.rating >= 5;
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
    }, [products, searchQuery, selectedFilters]);

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
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
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
                <Text style={styles.productPrice}>Rp {item.numericPrice.toLocaleString('id-ID')}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;

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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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