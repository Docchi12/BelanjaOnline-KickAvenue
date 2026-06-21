import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

interface ReviewScreenProps {
    route: any;
    navigation: any;
}

export default function ReviewScreen({ route, navigation }: ReviewScreenProps) {
    const orderId = route.params?.orderId;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [orderCode, setOrderCode] = useState("");
    const [items, setItems] = useState<any[]>([]);
    // key = product_id, value = rating (1-5) / comment
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    // product_id yang sudah pernah diberi ulasan sebelumnya
    const [alreadyReviewed, setAlreadyReviewed] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const { data: orderData } = await supabase
                .from("orders")
                .select("order_code, order_items (product_id, product_name, selected_size)")
                .eq("id", orderId)
                .single();

            if (orderData) {
                setOrderCode(orderData.order_code);
                setItems(orderData.order_items || []);
            }

            const { data: existingReviews } = await supabase
                .from("product_reviews")
                .select("product_id, rating, comment")
                .eq("order_id", orderId);

            if (existingReviews && existingReviews.length > 0) {
                const reviewedSet = new Set<string>();
                const prefilledRatings: { [key: string]: number } = {};
                const prefilledComments: { [key: string]: string } = {};

                existingReviews.forEach((r: any) => {
                    reviewedSet.add(String(r.product_id));
                    prefilledRatings[r.product_id] = r.rating;
                    prefilledComments[r.product_id] = r.comment || "";
                });

                setAlreadyReviewed(reviewedSet);
                setRatings((prev) => ({ ...prev, ...prefilledRatings }));
                setComments((prev) => ({ ...prev, ...prefilledComments }));
            }

            setLoading(false);
        };

        if (orderId) fetchData();
    }, [orderId]);

    const handleSetRating = (productId: string, value: number) => {
        if (alreadyReviewed.has(String(productId))) return;
        setRatings((prev) => ({ ...prev, [productId]: value }));
    };

    const handleSetComment = (productId: string, value: string) => {
        if (alreadyReviewed.has(String(productId))) return;
        setComments((prev) => ({ ...prev, [productId]: value }));
    };

    const handleSubmit = async () => {
        const itemsToSubmit = items.filter(
            (item) => !alreadyReviewed.has(String(item.product_id)),
        );

        if (itemsToSubmit.length === 0) {
            Alert.alert("Info", "Semua produk pada pesanan ini sudah diberi ulasan.");
            return;
        }

        const missingRating = itemsToSubmit.some(
            (item) => !ratings[item.product_id] || ratings[item.product_id] < 1,
        );

        if (missingRating) {
            Alert.alert("Lengkapi Dulu", "Beri rating bintang untuk setiap produk sebelum mengirim ulasan.");
            return;
        }

        setSubmitting(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            Alert.alert("Error", "Sesi login tidak ditemukan, silakan login ulang.");
            setSubmitting(false);
            return;
        }

        const rows = itemsToSubmit.map((item) => ({
            order_id: orderId,
            product_id: item.product_id,
            user_id: user.id,
            rating: ratings[item.product_id],
            comment: comments[item.product_id] || "",
        }));

        const { error } = await supabase.from("product_reviews").insert(rows);

        if (error) {
            console.error("Gagal mengirim ulasan:", error);
            Alert.alert("Gagal", error.message || "Terjadi kesalahan saat mengirim ulasan.");
        } else {
            Alert.alert("Berhasil", "Terima kasih atas ulasan Anda!");
            navigation.goBack();
        }

        setSubmitting(false);
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Beri Rating & Ulasan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.orderCodeText}>Pesanan: {orderCode}</Text>

                {items.map((item, index) => {
                    const isLocked = alreadyReviewed.has(String(item.product_id));
                    const currentRating = ratings[item.product_id] || 0;

                    return (
                        <View key={index} style={styles.card}>
                            <Text style={styles.productName}>{item.product_name}</Text>
                            {item.selected_size && item.selected_size !== "-" && (
                                <Text style={styles.productSize}>Ukuran: {item.selected_size}</Text>
                            )}

                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        disabled={isLocked}
                                        onPress={() => handleSetRating(item.product_id, star)}
                                    >
                                        <Ionicons
                                            name={star <= currentRating ? "star" : "star-outline"}
                                            size={32}
                                            color="#FFB800"
                                            style={{ marginRight: 6 }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                style={[styles.commentInput, isLocked && styles.commentInputLocked]}
                                placeholder="Bagaimana kualitas produknya?"
                                placeholderTextColor="#999"
                                multiline
                                editable={!isLocked}
                                value={comments[item.product_id] || ""}
                                onChangeText={(text) => handleSetComment(item.product_id, text)}
                            />

                            {isLocked && (
                                <Text style={styles.lockedText}>
                                    Anda sudah mengulas produk ini
                                </Text>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && { opacity: 0.5 }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <Text style={styles.submitText}>
                        {submitting ? "Mengirim..." : "Kirim Ulasan"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#007AFF",
    },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
    scrollContent: { padding: 15, paddingBottom: 30 },
    orderCodeText: { color: "#888", fontSize: 13, marginBottom: 10 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
    },
    productName: { fontWeight: "bold", fontSize: 15, color: "#333" },
    productSize: { color: "#888", fontSize: 12, marginTop: 2, marginBottom: 8 },
    starsRow: { flexDirection: "row", marginTop: 10, marginBottom: 12 },
    commentInput: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: "top",
        fontSize: 13,
        color: "#333",
    },
    commentInputLocked: { backgroundColor: "#493e3e", color: "#999" },
    lockedText: { color: "#4CD964", fontSize: 12, marginTop: 8, fontStyle: "italic" },
    footer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
    },
    submitBtn: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});