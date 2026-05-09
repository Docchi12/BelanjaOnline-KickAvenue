import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Definisi Tipe Data untuk Props agar tidak error di TypeScript
interface BrandGridProps {
    onBrandPress: (brandName: string) => void;
}

const brands = [
    {
        id: 1,
        name: "Nike",
        logo: "https://www.freepnglogos.com/uploads/nike-logo/nike-logo-png-transparent-1.png",
    },
    {
        id: 2,
        name: "Adidas",
        logo: "https://cdn-icons-png.flaticon.com/512/731/731962.png",
    },
    {
        id: 3,
        name: "Skechers",
        logo: "https://e7.pngegg.com/pngimages/786/420/png-clipart-brand-logo-skechers-sneakers-reebok-skechers-logo-text-logo.png",
    },
    {
        id: 4,
        name: "Converse",
        logo: "https://fabrikbrands.com/wp-content/uploads/Converse-Logo-1-1155x770.png",
    },
    {
        id: 5,
        name: "Puma",
        logo: "https://e7.pngegg.com/pngimages/670/927/png-clipart-puma-logo-puma-logo-adidas-swoosh-brand-adidas-text-carnivoran-thumbnail.png",
    },
    {
        id: 6,
        name: "New Balance",
        logo: "https://logodownload.org/wp-content/uploads/2017/07/new-balance-logo-16.png",
    },
    {
        id: 7,
        name: "Reebok",
        logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhm49LDwyxNv3F8kCInJ2Fy9B8j6q6FANxbzgeu_TjHzbV9HdEmGVbAAKbGgtmVzwQV0rZbDNCtn1wmqGMBLs61tl8oPaXM3PB8leUVHLRyQnMzkOFzjbzQJoXB7kXnRTLu5ukNh_OifvmJ2SNIdFUZioqM5Bl1pKjwSrMmuzGjJEfT0kgnsJxspn07/s320/GKL24_Reebok%20-%20Koleksilogo.com.jpg",
    },
    {
        id: 8,
        name: "Vans",
        logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpXGJBDiaFMkzHmXKIhzVR4VsjFW7MN_BOpGQpvtvEWKa6HSxhI1dT0OvJDwJHKPGMeY41zrflvZRWVcIbUVlCemeBlUqKcYKa900kmmy-DjbdyubcX9Ez8uNUksUJW0227vb3iPfsVJPeI3aQewGm-2s-avXTGQU9hW2u5-mqQTzzTPizCPON-C5I/s320/GKL23_Vans%20-%20Koleksilogo.com.jpg",
    },
];

// Menambahkan parameter { onBrandPress }
export default function BrandGrid({ onBrandPress }: BrandGridProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Shop by Brand</Text>
            <View style={styles.grid}>
                {brands.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.brandItem}
                        activeOpacity={0.7}
                        onPress={() => onBrandPress(item.name)} // <--- INI KUNCINYA
                    >
                        <View style={styles.iconContainer}>
                            <Image source={{ uri: item.logo }} style={styles.brandLogo} />
                        </View>
                        <Text style={styles.brandName}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#333",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    brandItem: {
        width: (width - 60) / 4,
        alignItems: "center",
        marginBottom: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    brandLogo: {
        width: "70%",
        height: "70%",
        resizeMode: "contain",
    },
    brandName: {
        fontSize: 10,
        marginTop: 8,
        color: "#555",
        fontWeight: "500",
        textAlign: "center",
    },
});