import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View
} from "react-native";

// Import Komponen
import AdminDashboard from "./components/AdminDashboard";
import BrandGrid from "./components/BrandGrid";
import BrandProducts from "./components/BrandProducts";
import CartScreen from "./components/CartScreen";
import CategoryProducts from "./components/CategoryProducts";
import Footer from "./components/Footer";
import FreshDrops from "./components/FreshDrops";
import Header from "./components/Header";
import KategoriPage from "./components/KategoriPage";
import LoginScreen from "./components/LoginScreen";
import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import ProfileScreen from "./components/ProfileScreen";
import PromoBanner from "./components/PromoBanner";
import RegisterScreen from "./components/RegisterScreen";
import SplashScreen from "./components/SplashScreen";
import OrderDetailsScreen from "./components/OrderDetailsScreen";
import OrdersHistoryScreen from "./components/OrdersHistoryScreen"; 

import { Product } from "./components/productsData";

type PageType =
    | "home"
    | "kategori"
    | "cart"
    | "brandProducts"
    | "categoryProducts"
    | "profile"
    | "admin"
    | "ordersHistory"
    | "orderDetail";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [userRole, setUserRole] = useState<"user" | "admin">("user");
    const [userName, setUserName] = useState("Guest");
    const [activePage, setActivePage] = useState<PageType>("home");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [cartItems, setCartItems] = useState<Product[]>([]);
    
    // State tambahan untuk navigasi detail & filter
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [orderFilter, setOrderFilter] = useState<string | undefined>(undefined);
    
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const scrollRef = useRef<ScrollView>(null);
    const cartCount = cartItems.length;

    const navigateToHome = () => { setActivePage("home"); setSelectedProduct(null); setOrderFilter(undefined); };
    const navigateToKategori = () => { setActivePage("kategori"); setSelectedProduct(null); setOrderFilter(undefined); };
    const navigateToCart = () => { setActivePage("cart"); setSelectedProduct(null); setOrderFilter(undefined); };
    const navigateToProfile = () => { setActivePage("profile"); setSelectedProduct(null); setOrderFilter(undefined); };

    const handleOpenCategory = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setActivePage("categoryProducts");
    };

    const handleOpenDetail = (product: Product) => setSelectedProduct(product);
    const handleBackToDashboard = () => setSelectedProduct(null);

    const handleOpenBrand = (brandName: string) => {
        setSelectedBrand(brandName);
        setActivePage("brandProducts");
    };

    const handleLogin = (name: string, pass: string, role: "admin" | "user") => {
        setUserName(name);
        setUserRole(role);
        setIsLoggedIn(true);
        setActivePage(role === "admin" ? "admin" : "home");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName("Guest");
        setUserRole("user");
        setActivePage("home");
    };

    // FUNGSI NAVIGASI PUSAT YANG DIPERBAIKI
    const handleGlobalNavigate = (page: string, params?: any) => {
        if (params?.orderId) setSelectedOrderId(params.orderId);
        
        // Update filter jika ada, jika tidak, pertahankan filter yang ada (untuk navigasi detail)
        if (params?.filterStatus !== undefined) {
            setOrderFilter(params.filterStatus);
        }
        
        setActivePage(page as PageType);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setAllProducts(data);
            }
        };
        fetchProducts();
    }, []);

    if (isLoading) return <SplashScreen />;

    if (!isLoggedIn) {
        if (isRegistering) {
            return <RegisterScreen onBackToLogin={() => setIsRegistering(false)} onRegisterSuccess={() => setIsRegistering(false)} />;
        }
        return <LoginScreen onLogin={handleLogin} onRegisterPress={() => setIsRegistering(true)} />;
    }

    if (userRole === "admin" && activePage === "admin") {
        return <AdminDashboard onLogout={handleLogout} products={allProducts} setProducts={setAllProducts} />;
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
                
                {activePage === "home" && (
                    <>
                        <Header userName={userName} onCartPress={navigateToCart} cartCount={cartCount} />
                        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                            <BrandGrid onBrandPress={handleOpenBrand} />
                            <PromoBanner />
                            <FreshDrops products={allProducts.slice(0, 5)} onProductPress={handleOpenDetail} />
                            <ProductList products={allProducts.slice(5, 13)} onProductPress={handleOpenDetail} />
                        </ScrollView>
                    </>
                )}

                {activePage === "kategori" && <KategoriPage onCategoryPress={handleOpenCategory} />}

                {activePage === "brandProducts" && (
                    <BrandProducts brandName={selectedBrand} onBack={navigateToHome} onProductPress={handleOpenDetail} onCartPress={navigateToCart} />
                )}

                {activePage === "categoryProducts" && (
                    <CategoryProducts categoryName={selectedCategory} products={allProducts} onBack={navigateToKategori} onProductPress={handleOpenDetail} />
                )}

                {activePage === "cart" && (
                    <CartScreen onBack={navigateToHome} userName={userName} items={cartItems} onRemoveItem={(index) => {
                        const newItems = [...cartItems];
                        newItems.splice(index, 1);
                        setCartItems(newItems);
                    }} setItems={setCartItems} />
                )}

                {activePage === "profile" && (
                    <ProfileScreen userName={userName} onLogout={handleLogout} onNavigate={handleGlobalNavigate} />
                )}

                {activePage === "ordersHistory" && (
                    <OrdersHistoryScreen 
                        route={{ params: { filterStatus: orderFilter } }} 
                        onNavigate={handleGlobalNavigate} 
                    />
                )}
                
                {activePage === "orderDetail" && (
                    <OrderDetailsScreen 
                        route={{ params: { orderId: selectedOrderId } }} 
                        navigation={{ goBack: () => setActivePage("ordersHistory") }} 
                    />
                )}
            </View>

            {(activePage === "home" || activePage === "kategori" || activePage === "profile") && (
                <Footer
                    activePage={activePage}
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
    container: { flex: 1, backgroundColor: "#fcfcfc", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
    mainContent: { flex: 1 },
});