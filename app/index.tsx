import React, { useState, useEffect, useRef } from 'react';
import { 
    ScrollView, 
    View, 
    StyleSheet, 
    StatusBar, 
    Alert, 
    SafeAreaView, 
    Platform 
} from 'react-native';

// Import Komponen
import SplashScreen from './components/SplashScreen'; 
import LoginScreen from './components/LoginScreen'; 
import RegisterScreen from './components/RegisterScreen'; 
import ProductDetail from './components/ProductDetail'; 
import Header from './components/Header'; 
import BrandGrid from './components/BrandGrid';
import PromoBanner from './components/PromoBanner';
import ProductList from './components/ProductList';
import FreshDrops from './components/FreshDrops';
import Footer from './components/Footer';
import KategoriPage from './components/KategoriPage'; 
import BrandProducts from './components/BrandProducts'; 
import CartScreen from './components/CartScreen'; 
import ProfileScreen from './components/ProfileScreen'; // <-- Import baru

// Definisi Tipe Data
export interface Product {
    id: number;
    name: string;
    brand: string;
    price: string;
    image: string;
    category?: string;
    selectedSize?: number;
}

// Tipe untuk navigasi halaman
type PageType = 'home' | 'kategori' | 'cart' | 'brandProducts' | 'profile';

export default function Index() {
    // --- STATE UTAMA ---
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [userName, setUserName] = useState('Guest'); 
    
    // --- STATE NAVIGASI & KONTEN ---
    const [activePage, setActivePage] = useState<PageType>('home'); 
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
    const [selectedBrand, setSelectedBrand] = useState<string>(''); 
    
    // --- STATE KERANJANG ---
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const cartCount = cartItems.length;

    // --- REFS & SCROLL ---
    const scrollRef = useRef<ScrollView>(null);
    const [scrollOffset, setScrollOffset] = useState(0); 

    // --- LOGIKA KERANJANG ---
    const handleAddToCart = (product: Product) => {
        setCartItems(prev => [...prev, product]);
        Alert.alert("Berhasil", `${product.name} telah masuk ke keranjang.`);
    };

    const handleRemoveFromCart = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    // --- LOGIKA NAVIGASI ---
    const handleOpenDetail = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleOpenBrand = (brandName: string) => {
        setSelectedBrand(brandName);
        setActivePage('brandProducts');
    };

    const handleBackToDashboard = () => {
        setSelectedProduct(null);
        if (activePage === 'home') {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: scrollOffset, animated: false });
            }, 50);
        }
    };

    const navigateToHome = () => {
        setActivePage('home');
        setSelectedProduct(null);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    const navigateToKategori = () => {
        setActivePage('kategori');
        setSelectedProduct(null);
    };

    const navigateToCart = () => {
        setActivePage('cart');
        setSelectedProduct(null);
    };

    const navigateToProfile = () => {
        setActivePage('profile');
        setSelectedProduct(null);
    };

    // --- LOGIKA AUTH ---
    const handleLogin = (name: string, pass: string) => {
        if (pass === 'admin123') {
            setUserName(name); 
            setIsLoggedIn(true); 
        } else {
            Alert.alert("Login Gagal", "Password yang Anda masukkan salah.");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActivePage('home');
    };

    // Efek Splash Screen
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // RENDER: Loading
    if (isLoading) return <SplashScreen />;

    // RENDER: Auth Flow
    if (!isLoggedIn) {
        return isRegistering ? (
            <RegisterScreen 
                onBackToLogin={() => setIsRegistering(false)} 
                onRegisterSuccess={() => {
                    setIsRegistering(false);
                    Alert.alert("Sukses", "Akun berhasil dibuat. Silakan login.");
                }} 
            />
        ) : (
            <LoginScreen 
                onLogin={handleLogin} 
                onRegisterPress={() => setIsRegistering(true)} 
            />
        );
    }

    // RENDER: Overlay Detail
    if (selectedProduct) {
        return (
            <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackToDashboard} 
                onAddToCart={handleAddToCart}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar 
                barStyle={activePage === 'cart' || activePage === 'profile' ? 'dark-content' : 'dark-content'} 
                backgroundColor="#fcfcfc" 
            />

            {/* KONTEN HALAMAN */}
            <View style={styles.mainContent}>
                {activePage === 'home' && (
                <> 
                    <Header 
                            userName={userName} 
                            onCartPress={navigateToCart} 
                            cartCount={cartCount} 
                    />

                    <ScrollView 
                        ref={scrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.y)}
                        scrollEventThrottle={16} 
                    >
                        
                        <BrandGrid onBrandPress={handleOpenBrand} />
                        <PromoBanner />
                        <FreshDrops onProductPress={handleOpenDetail} />
                        <ProductList onProductPress={handleOpenDetail} />
                    </ScrollView>
                    </>
                )}

                {activePage === 'kategori' && <KategoriPage />}

                {activePage === 'brandProducts' && (
                    <BrandProducts 
                        brandName={selectedBrand}
                        onBack={navigateToHome}
                        onProductPress={handleOpenDetail}
                        onCartPress={navigateToCart}
                    />
                )}

                {activePage === 'cart' && (
                    <CartScreen 
                        onBack={navigateToHome} 
                        userName={userName} 
                        items={cartItems}
                        onRemoveItem={handleRemoveFromCart}
                    />
                )}

                {/* HALAMAN PROFIL BARU */}
                {activePage === 'profile' && (
                    <ProfileScreen 
                        onLogout={handleLogout}
                    />
                )}
            </View>

            {/* FOOTER */}
            {activePage !== 'cart' && (
                <Footer 
                    activePage={activePage === 'brandProducts' ? 'home' : activePage}
                    onHomePress={navigateToHome} 
                    onKategoriPress={navigateToKategori} 
                    onCartPress={navigateToCart}
                    onProfilePress={navigateToProfile} // <-- Fungsi baru
                    cartCount={cartCount} 
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fcfcfc',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
    },
    mainContent: {
        flex: 1,
    },
    scrollContent: { 
        paddingBottom: 20 
    }
});