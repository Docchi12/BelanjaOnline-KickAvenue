import React, { useEffect, useRef, useState } from "react";
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

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  category?: string;
  selectedSize?: number;
}

type PageType =
  | "home"
  | "kategori"
  | "cart"
  | "brandProducts"
  | "profile"
  | "admin";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [userName, setUserName] = useState("Guest");
  const [activePage, setActivePage] = useState<PageType>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const cartCount = cartItems.length;

  const navigateToHome = () => {
    setActivePage("home");
    setSelectedProduct(null);
  };
  const navigateToKategori = () => {
    setActivePage("kategori");
    setSelectedProduct(null);
  };
  const navigateToCart = () => {
    setActivePage("cart");
    setSelectedProduct(null);
  };
  const navigateToProfile = () => {
    setActivePage("profile");
    setSelectedProduct(null);
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  // --- LOGIKA AUTH (FIXED) ---
  if (!isLoggedIn) {
    if (isRegistering) {
      return (
        <RegisterScreen
          onBackToLogin={() => setIsRegistering(false)}
          onRegisterSuccess={() => setIsRegistering(false)}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegisterPress={() => setIsRegistering(true)}
      />
    );
  }

  if (userRole === "admin" && activePage === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
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
            <Header
              userName={userName}
              onCartPress={navigateToCart}
              cartCount={cartCount}
            />
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            >
              <BrandGrid onBrandPress={handleOpenBrand} />
              <PromoBanner />
              <FreshDrops onProductPress={handleOpenDetail} />
              <ProductList onProductPress={handleOpenDetail} />
            </ScrollView>
          </>
        )}
        {activePage === "kategori" && <KategoriPage />}
        {activePage === "brandProducts" && (
          <BrandProducts
            brandName={selectedBrand}
            onBack={navigateToHome}
            onProductPress={handleOpenDetail}
            onCartPress={navigateToCart}
          />
        )}
        {activePage === "cart" && (
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
        {activePage === "profile" && (
          <ProfileScreen userName={userName} onLogout={handleLogout} />
        )}
      </View>

      {activePage !== "cart" && activePage !== "admin" && (
        <Footer
          activePage={activePage === "brandProducts" ? "home" : activePage}
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
    backgroundColor: "#fcfcfc",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainContent: { flex: 1 },
});
