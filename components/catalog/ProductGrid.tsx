'use client';

import React from 'react';
import { WindowProduct } from '@/lib/data/productsData';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: WindowProduct[];
    onAddProduct: (product: WindowProduct) => void;
    isProductSelected: (code: string) => boolean;
}

export default function ProductGrid({
    products,
    onAddProduct,
    isProductSelected,
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-lg">
                    No products found matching your filters.
                </div>
                <div className="text-gray-500 text-sm mt-2">
                    Try adjusting your search or filters.
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.code}
                    product={product}
                    onAdd={onAddProduct}
                    isAdded={isProductSelected(product.code)}
                />
            ))}
        </div>
    );
}
