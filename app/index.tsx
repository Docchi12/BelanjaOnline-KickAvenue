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
import ProfileScreen from './components/ProfileScreen'; 

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

type PageType = 'home' | 'kategori' | 'cart' | 'brandProducts' | 'profile';

export default function Index() {
    // --- STATE UTAMA ---
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    
    // State userName inilah yang akan dikirim ke ProfileScreen
    const [userName, setUserName] = useState('Guest'); 
    
    // --- STATE NAVIGASI ---
    const [activePage, setActivePage] = useState<PageType>('home'); 
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
    const [selectedBrand, setSelectedBrand] = useState<string>(''); 
    
    // --- STATE KERANJANG ---
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const cartCount = cartItems.length;

    const scrollRef = useRef<ScrollView>(null);
    const [scrollOffset, setScrollOffset] = useState(0); 

    // --- HANDLER NAVIGASI ---
    const navigateToHome = () => { setActivePage('home'); setSelectedProduct(null); };
    const navigateToKategori = () => { setActivePage('kategori'); setSelectedProduct(null); };
    const navigateToCart = () => { setActivePage('cart'); setSelectedProduct(null); };
    const navigateToProfile = () => { setActivePage('profile'); setSelectedProduct(null); };

    const handleOpenDetail = (product: Product) => setSelectedProduct(product);
    const handleBackToDashboard = () => setSelectedProduct(null);

    const handleOpenBrand = (brandName: string) => {
        setSelectedBrand(brandName);
        setActivePage('brandProducts');
    };

    // --- LOGIKA AUTH ---
    const handleLogin = (name: string, pass: string) => {
        if (pass === 'admin123') {
            setUserName(name); // Menyimpan nama dari input login ke state
            setIsLoggedIn(true); 
        } else {
            Alert.alert("Login Gagal", "Password salah.");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('Guest');
        setActivePage('home');
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <SplashScreen />;

    if (!isLoggedIn) {
        return isRegistering ? (
            <RegisterScreen 
                onBackToLogin={() => setIsRegistering(false)} 
                onRegisterSuccess={() => setIsRegistering(false)} 
            />
        ) : (
            <LoginScreen onLogin={handleLogin} onRegisterPress={() => setIsRegistering(true)} />
        );
    }

    if (selectedProduct) {
        return (
            <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackToDashboard} 
                onAddToCart={(p) => setCartItems([...cartItems, p])}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fcfcfc" />

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
                        onRemoveItem={(index) => {
                            const newItems = [...cartItems];
                            newItems.splice(index, 1);
                            setCartItems(newItems);
                        }}
                    />
                )}

                {/* --- PERBAIKAN DI SINI --- */}
                {activePage === 'profile' && (
                    <ProfileScreen 
                        userName={userName} // Sekarang mengirim nama yang login
                        onLogout={handleLogout}
                    />
                )}
            </View>

            {activePage !== 'cart' && (
                <Footer 
                    activePage={activePage === 'brandProducts' ? 'home' : activePage}
                    onHomePress={navigateToHome} 
                    onKategoriPress={navigateToKategori} 
                    onCartPress={navigateToCart}
                    onProfilePress={navigateToProfile} 
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
    mainContent: { flex: 1 },
});