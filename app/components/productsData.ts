// productsData.ts
// Data pusat untuk katalog produk

export interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    stock: number;
    sales: number;
    gender: string;
    category: string;
    sizes: string[]; 
    imageUrl: string; // PERBAIKAN: Wajib ada agar sinkron dengan handleSave di AdminDashboard
}

// Daftar merk yang diizinkan agar sinkron dengan validasi AdminDashboard
export const ALLOWED_BRANDS = [
    'Nike', 
    'Adidas', 
    'New Balance', 
    'Converse', 
    'Skechers', 
    'Reebok', 
    'Vans', 
    'Puma'
];

export const initialProducts: Product[] = [
    // --- LIFESTYLE ---
    { 
        id: 101, 
        brand: 'Nike', 
        name: 'Air Jordan 1 Low', 
        price: 1929000, 
        stock: 12, 
        sales: 150, 
        gender: 'Unisex', 
        category: 'Lifestyle',
        sizes: ['38', '39', '40', '41', '42'],
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500"
    },
    { 
        id: 102, 
        brand: 'Converse', 
        name: 'Chuck 70 Classic High', 
        price: 1100000, 
        stock: 20, 
        sales: 300, 
        gender: 'Unisex', 
        category: 'Lifestyle',
        sizes: ['37', '38', '39', '40', '41', '42', '43'],
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500"
    },

    // --- CASUAL ---
    { 
        id: 201, 
        brand: 'Adidas', 
        name: 'Samba OG', 
        price: 2200000, 
        stock: 2, 
        sales: 200, 
        gender: 'Pria', 
        category: 'Casual',
        sizes: ['40', '41', '42', '43'],
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=500"
    },
    { 
        id: 202, 
        brand: 'Vans', 
        name: 'Old Skool Core Classics', 
        price: 999000, 
        stock: 15, 
        sales: 450, 
        gender: 'Unisex', 
        category: 'Casual',
        sizes: ['38', '39', '40', '41', '42'],
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500"
    },

    // --- RUNNING SHOES ---
    { 
        id: 301, 
        brand: 'New Balance', 
        name: '530 Silver Grey', 
        price: 1850000, 
        stock: 14, 
        sales: 180, 
        gender: 'Wanita', 
        category: 'Running Shoes',
        sizes: ['36', '37', '38', '39'],
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500"
    },
    { 
        id: 302, 
        brand: 'Nike', 
        name: 'Pegasus 40 Blue', 
        price: 1900000, 
        stock: 8, 
        sales: 90, 
        gender: 'Pria', 
        category: 'Running Shoes',
        sizes: ['40', '41', '42', '43', '44'],
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500"
    },

    // --- TRAINING SHOES ---
    { 
        id: 401, 
        brand: 'Reebok', 
        name: 'Nano X3 Workout', 
        price: 1600000, 
        stock: 10, 
        sales: 75, 
        gender: 'Pria', 
        category: 'Training Shoes',
        sizes: ['40', '41', '42', '43'],
        imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e4621f?q=80&w=500"
    },
    { 
        id: 402, 
        brand: 'Skechers', 
        name: 'Max Cushioning Elite', 
        price: 1300000, 
        stock: 12, 
        sales: 110, 
        gender: 'Wanita', 
        category: 'Training Shoes',
        sizes: ['36', '37', '38', '39'],
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500"
    },

    // --- SKATE SHOES ---
    { 
        id: 501, 
        brand: 'Vans', 
        name: 'Sk8-Hi High Top', 
        price: 1150000, 
        stock: 6, 
        sales: 130, 
        gender: 'Unisex', 
        category: 'Skate Shoes',
        sizes: ['39', '40', '41', '42'],
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=500"
    },
    { 
        id: 502, 
        brand: 'Nike', 
        name: 'SB Dunk Low Pro', 
        price: 1750000, 
        stock: 5, 
        sales: 210, 
        gender: 'Pria', 
        category: 'Skate Shoes',
        sizes: ['40', '41', '42', '43'],
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500"
    }
];

export default initialProducts;