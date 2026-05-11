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
    sizes: string[]; // Menambahkan properti sizes agar sesuai dengan AdminDashboard
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
    { 
        id: 101, 
        brand: 'Nike', 
        name: 'Air Jordan 1 Low', 
        price: 1929000, 
        stock: 12, 
        sales: 150, 
        gender: 'Unisex', 
        category: 'Lifestyle',
        sizes: ['38', '39', '40', '41', '42'] 
    },
    { 
        id: 202, 
        brand: 'Adidas', 
        name: 'Samba OG', 
        price: 2200000, 
        stock: 2, 
        sales: 200, 
        gender: 'Pria', 
        category: 'Casual',
        sizes: ['40', '41', '42', '43'] 
    },
    { 
        id: 401, 
        brand: 'New Balance', 
        name: '530 Silver Grey', 
        price: 1850000, 
        stock: 14, 
        sales: 180, 
        gender: 'Wanita', 
        category: 'Running Shoes',
        sizes: ['36', '37', '38', '39'] 
    },
];

// Menambahkan export default untuk menghilangkan pesan peringatan/error di terminal
export default initialProducts;