import React, { useState, useMemo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    TextInput, 
    SafeAreaView, 
    Platform, 
    StatusBar, 
    Modal,
    FlatList,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// 1. INTERFACE DISESUAIKAN (Menambahkan 'brand' sesuai error di gambar_100.png)
interface Product {
    id: number;
    name: string;
    brand: string; // Wajib ada sesuai kontrak di index.tsx
    price: string;
    gender: string;
    category: string;
    rating: number;
    image: string;
}

interface BrandProductsProps {
    brandName: string;
    onBack: () => void;
    onProductPress: (product: Product) => void;
    onCartPress: () => void;
}

// 2. DATA PRODUK DENGAN PROPERTI 'BRAND' LENGKAP
const ALL_PRODUCTS_DATA: Record<string, Product[]> = {
    'Nike': [
        { id: 101, brand: 'Nike', name: 'Nike Air Jordan 1 Low', price: 'Rp 1.929.000', gender: 'Pria', category: 'Lifestyle', rating: 4.9, image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=400' },
        { id: 102, brand: 'Nike', name: 'Nike Dunk Low Retro', price: 'Rp 1.549.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1600054904350-1d493ae5f922?q=80&w=400' },
        { id: 103, brand: 'Nike', name: 'Nike Air Max Solo', price: 'Rp 1.279.000', gender: 'Wanita', category: 'Running', rating: 4.7, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400' },
        { id: 104, brand: 'Nike', name: 'Nike Pegasus 40', price: 'Rp 1.849.000', gender: 'Pria', category: 'Running', rating: 4.6, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400' },
    ],
    'Adidas': [
        { id: 201, brand: 'Adidas', name: 'Adidas Ultraboost Light', price: 'Rp 3.300.000', gender: 'Pria', category: 'Running', rating: 4.9, image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=400' },
        { id: 202, brand: 'Adidas', name: 'Adidas Samba OG', price: 'Rp 2.200.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400' },
        { id: 203, brand: 'Adidas', name: 'Adidas Gazelle Bold', price: 'Rp 1.900.000', gender: 'Wanita', category: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400' },
        { id: 204, brand: 'Adidas', name: 'Adidas Forum Low', price: 'Rp 1.700.000', gender: 'Pria', category: 'Lifestyle', rating: 4.6, image: 'https://images.unsplash.com/photo-1512374382149-4332c6c02151?q=80&w=400' },
    ],
    'New Balance': [
        { id: 401, brand: 'New Balance', name: 'New Balance 550 White', price: 'Rp 2.099.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.9, image: 'https://images.unsplash.com/photo-1636718282214-0b4100576307?q=80&w=400' },
        { id: 402, brand: 'New Balance', name: 'New Balance 2002R', price: 'Rp 2.599.000', gender: 'Pria', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1620138546344-7b2c38517dee?q=80&w=400' },
        { id: 403, brand: 'New Balance',  name: 'New Balance 530 Metallic', price: 'Rp 1.799.000', gender: 'Wanita', category: 'Running', rating: 4.7, image: 'https://images.unsplash.com/photo-1671041926610-85f838639097?q=80&w=200'},
        { id: 404, brand: 'New Balance',  name: 'New Balance Fresh Foam', price: 'Rp 2.299.000', gender: 'Pria', category: 'Running', rating: 4.6, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=200'},
        
    ], 'Skechers': [ 
            { id: 301, brand: 'Skechers', name: 'Skechers Arch Fit', price: 'Rp 1.199.000', gender: 'Pria', category: 'Walking', rating: 4.8, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=200' },
            { id: 302, brand: 'Skechers', name: 'Skechers Max Cushioning', price: 'Rp 1.399.000', gender: 'Wanita', category: 'Running', rating: 4.7, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=200'  },
            { id: 303, brand: 'Skechers', name: 'Skechers D-Lites 4.0', price: 'Rp 1.099.000', gender: 'Wanita', category: 'Lifestyle', rating: 4.6, image: 'https://images.unsplash.com/photo-1605405748313-a416a1b84491?q=80&w=200' },
            { id: 304, brand: 'Skechers', name: 'Skechers GoWalk 6', price: 'Rp 999.000', gender: 'Pria', category: 'Walking', rating: 4.8, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=200' },
            
    ], 'Puma': [ 
            { id: 501, brand: 'Puma',  name: 'Puma RS-X Efekt', price: 'Rp 1.999.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200'},
            { id: 502, brand: 'Puma', name: 'Puma Suede Classic', price: 'Rp 1.199.000', gender: 'Pria', category: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=200' },
            { id: 503, brand: 'Puma',  name: 'Puma Deviate Nitro', price: 'Rp 2.799.000', gender: 'Pria', category: 'Running', rating: 4.9, image: 'https://images.unsplash.com/photo-1512374382149-4332c6c02151?q=80&w=200' },
            { id: 504, brand: 'Puma',  name: 'Puma Cali Dream', price: 'Rp 1.499.000', gender: 'Wanita', category: 'Lifestyle', rating: 4.6, image: 'https://images.unsplash.com/photo-1633467433309-84081c741490?q=80&w=200'},
            
    ],'Vans': [ 
            { id: 601, brand: 'Vans',  name: 'Vans Old Skool Black', price: 'Rp 1.099.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.9, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=200' },
            { id: 602, brand: 'Vans',  name: 'Vans Sk8-Hi Classic', price: 'Rp 1.299.000', gender: 'Pria', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1565357419076-6abbad3f5924?q=80&w=200' },
            { id: 603, brand: 'Vans',  name: 'Vans Authentic Navy', price: 'Rp 899.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?q=80&w=200' },
            { id: 604, brand: 'Vans', name: 'Vans Slip-On Checker', price: 'Rp 999.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=200' },
    ], 'Converse': [ 
            { id: 701, brand: 'Converse', name: 'Chuck Taylor All Star Hi', price: 'Rp 899.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.9, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=200' },
            { id: 702, brand: 'Converse', name: 'Converse Run Star Hike', price: 'Rp 1.799.000', gender: 'Wanita', category: 'Lifestyle', rating: 4.8, image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=200' },
            { id: 703, brand: 'Converse', name: 'Converse Jack Purcell', price: 'Rp 1.099.000', gender: 'Pria', category: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=200' },
            { id: 704, brand: 'Converse', name: 'Chuck 70 Vintage', price: 'Rp 1.199.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.9, image: 'https://images.unsplash.com/photo-1533681018184-68bd1d8f39fe?q=80&w=200'},
    ],'Reebok': [ 
            { id: 801, brand: 'Reebok', name: 'Reebok Club C 85', price: 'Rp 1.299.000', gender: 'Unisex', category: 'Lifestyle', rating: 4.7, image: 'https://images.unsplash.com/photo-1511551203524-9a24350a5771?q=80&w=200' },
            { id: 802, brand: 'Reebok', name: 'Reebok Nano X3', price: 'Rp 2.199.000', gender: 'Pria', category: 'Training', rating: 4.8, image: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=200'},
            { id: 803, brand: 'Reebok', name: 'Reebok Classic Leather', price: 'Rp 1.199.000', gender: 'Pria', category: 'Lifestyle', rating: 4.6, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200' },
            { id: 804, brand: 'Reebok', name: 'Reebok Floatride Energy', price: 'Rp 1.699.000', gender: 'Wanita', category: 'Running', rating: 4.7, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=200' },
    ],
    // Tambahkan brand lain sesuai kebutuhan dengan pola yang sama...
};

const FILTER_SECTIONS = [
    { id: 'category', label: 'Kategori', options: ['Lifestyle', 'Running', 'Basketball', 'Training', 'Walking'] },
    { id: 'gender', label: 'Gender', options: ['Pria', 'Wanita', 'Unisex'] },
];

export default function BrandProducts({ brandName, onBack, onProductPress }: BrandProductsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('category');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // LOGIKA FILTERING AKTIF
    const filteredProducts = useMemo(() => {
        let products = ALL_PRODUCTS_DATA[brandName] || [];

        if (searchQuery) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedFilters.length > 0) {
            products = products.filter(p => 
                selectedFilters.includes(p.category) || selectedFilters.includes(p.gender)
            );
        }

        return products;
    }, [brandName, searchQuery, selectedFilters]);

    const toggleFilter = (option: string) => {
        setSelectedFilters(prev => 
            prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
        );
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity 
            style={styles.productCard}
            onPress={() => onProductPress(item)}
        >
            <View style={styles.imageBox}>
                <Image 
                    source={{ uri: item.image }} 
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>
            
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.genderBadge}>
                    <Text style={styles.genderBadgeText}>{item.gender}</Text>
                </View>
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
            <StatusBar barStyle="dark-content" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#888" />
                    <TextInput 
                        placeholder={`Cari di ${brandName}...`}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.filterTrigger, selectedFilters.length > 0 && styles.filterActive]} 
                    onPress={() => setIsFilterVisible(true)}
                >
                    <Ionicons 
                        name="options-outline" 
                        size={22} 
                        color={selectedFilters.length > 0 ? "#fff" : "#007AFF"} 
                    />
                </TouchableOpacity>
            </View>

            {/* PRODUCT LIST */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.scrollPadding}
                ListHeaderComponent={
                    <Text style={styles.resultsText}>
                        {`Menampilkan ${filteredProducts.length} produk untuk "${brandName}"`}
                    </Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
                    </View>
                }
            />

            {/* MODAL FILTER */}
            <Modal visible={isFilterVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Filter</Text>
                        <TouchableOpacity onPress={() => setSelectedFilters([])}>
                            <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterBody}>
                        <View style={styles.sidebar}>
                            {FILTER_SECTIONS.map((section) => (
                                <TouchableOpacity 
                                    key={section.id} 
                                    style={[styles.sidebarItem, activeSection === section.id && styles.activeSidebarItem]}
                                    onPress={() => setActiveSection(section.id)}
                                >
                                    <Text style={[styles.sidebarText, activeSection === section.id && styles.activeSidebarText]}>
                                        {section.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.contentTitle}>Pilih {activeSection === 'category' ? 'Kategori' : 'Gender'}</Text>
                            <View style={styles.optionsGrid}>
                                {FILTER_SECTIONS.find(s => s.id === activeSection)?.options.map((option) => (
                                    <TouchableOpacity 
                                        key={option} 
                                        style={[styles.optionChip, selectedFilters.includes(option) && styles.selectedChip]}
                                        onPress={() => toggleFilter(option)}
                                    >
                                        <Text style={[styles.optionChipText, selectedFilters.includes(option) && styles.selectedChipText]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
                            <Text style={styles.applyBtnText}>Tampilkan Hasil</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff', 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingVertical: 12,
        gap: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f0f0' 
    },
    iconButton: { padding: 4 },
    searchBar: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F3F4F6', 
        borderRadius: 12, 
        paddingHorizontal: 12, 
        height: 40 
    },
    searchInput: { 
        flex: 1, 
        marginLeft: 8, 
        fontSize: 14, 
        color: '#333' 
    },
    filterTrigger: { 
        padding: 8, 
        backgroundColor: '#EBF5FF', 
        borderRadius: 10 
    },
    filterActive: {
        backgroundColor: '#007AFF',
    },
    scrollPadding: { 
        padding: 15,
        paddingBottom: 30
    },
    resultsText: { 
        fontSize: 12, 
        color: '#888', 
        marginBottom: 15 
    },
    gridRow: {
        justifyContent: 'space-between'
    },
    productCard: { 
        width: (width - 45) / 2, 
        marginBottom: 20 
    },
    imageBox: { 
        height: 180, 
        backgroundColor: '#F9FAFB', 
        borderRadius: 16, 
        overflow: 'hidden'
    },
    productImage: {
        width: '100%',
        height: '100%'
    },
    productInfo: { 
        paddingTop: 10,
        paddingHorizontal: 4
    },
    productName: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#333'
    },
    genderBadge: { 
        backgroundColor: '#F3F4F6', 
        paddingHorizontal: 8, 
        paddingVertical: 2, 
        borderRadius: 4, 
        alignSelf: 'flex-start', 
        marginVertical: 4
    },
    genderBadgeText: { 
        color: '#666', 
        fontSize: 10, 
        fontWeight: '600' 
    },
    productPrice: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#000' 
    },
    ratingRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4, 
        marginTop: 4 
    },
    ratingText: { 
        fontSize: 12, 
        color: '#666' 
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        color: '#999',
        marginTop: 10,
        fontSize: 16
    },
    modalHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    resetText: { color: '#FF3B30', fontWeight: '600' },
    filterBody: { flex: 1, flexDirection: 'row' },
    sidebar: { width: 110, backgroundColor: '#F9FAFB' },
    sidebarItem: { paddingVertical: 20, paddingHorizontal: 15 },
    activeSidebarItem: { backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#007AFF' },
    sidebarText: { fontSize: 13, color: '#666' },
    activeSidebarText: { color: '#007AFF', fontWeight: 'bold' },
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