'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WindowProduct, productsData, searchProducts, filterProducts } from '@/lib/data/productsData';

export interface SelectedProduct extends WindowProduct {
    selectedQuantity: number;
    subtotal: number;
}

export interface CatalogQuotation {
    products: SelectedProduct[];
    subtotal: number;
    transportation: number;
    loading: number;
    taxable: number;
    gst: number;
    grandTotal: number;
}

interface CatalogContextType {
    // Products
    allProducts: WindowProduct[];
    filteredProducts: WindowProduct[];

    // Filters
    searchQuery: string;
    locationFilter: string;
    profileFilter: string;

    // Selected items
    selectedProducts: SelectedProduct[];
    quotation: CatalogQuotation;

    // Actions
    setSearchQuery: (query: string) => void;
    setLocationFilter: (location: string) => void;
    setProfileFilter: (profile: string) => void;
    addProduct: (product: WindowProduct) => void;
    removeProduct: (code: string) => void;
    updateQuantity: (code: string, quantity: number) => void;
    clearSelection: () => void;
    isProductSelected: (code: string) => boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
    const [allProducts] = useState<WindowProduct[]>(productsData);
    const [filteredProducts, setFilteredProducts] = useState<WindowProduct[]>(productsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');
    const [profileFilter, setProfileFilter] = useState('All');
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [quotation, setQuotation] = useState<CatalogQuotation>({
        products: [],
        subtotal: 0,
        transportation: 5000,
        loading: 2000,
        taxable: 0,
        gst: 0,
        grandTotal: 0,
    });

    // Apply filters whenever search or filter values change
    useEffect(() => {
        let results = allProducts;

        // Apply search
        if (searchQuery.trim()) {
            results = searchProducts(searchQuery);
        }

        // Apply filters
        results = results.filter(p => {
            if (locationFilter !== 'All' && p.location !== locationFilter) return false;
            if (profileFilter !== 'All' && p.profile !== profileFilter) return false;
            return true;
        });

        setFilteredProducts(results);
    }, [searchQuery, locationFilter, profileFilter, allProducts]);

    // Recalculate quotation whenever selected products change
    useEffect(() => {
        const subtotal = selectedProducts.reduce((sum, p) => sum + p.subtotal, 0);
        const transportation = 5000;
        const loading = 2000;
        const taxable = subtotal + transportation + loading;
        const gst = taxable * 0.18;
        const grandTotal = taxable + gst;

        setQuotation({
            products: selectedProducts,
            subtotal,
            transportation,
            loading,
            taxable,
            gst,
            grandTotal,
        });
    }, [selectedProducts]);

    const addProduct = (product: WindowProduct) => {
        if (isProductSelected(product.code)) return;

        const newProduct: SelectedProduct = {
            ...product,
            selectedQuantity: product.quantity,
            subtotal: product.price * product.quantity,
        };

        setSelectedProducts(prev => [...prev, newProduct]);
    };

    const removeProduct = (code: string) => {
        setSelectedProducts(prev => prev.filter(p => p.code !== code));
    };

    const updateQuantity = (code: string, quantity: number) => {
        if (quantity <= 0) {
            removeProduct(code);
            return;
        }

        setSelectedProducts(prev =>
            prev.map(p =>
                p.code === code
                    ? { ...p, selectedQuantity: quantity, subtotal: p.price * quantity }
                    : p
            )
        );
    };

    const clearSelection = () => {
        setSelectedProducts([]);
    };

    const isProductSelected = (code: string): boolean => {
        return selectedProducts.some(p => p.code === code);
    };

    return (
        <CatalogContext.Provider
            value={{
                allProducts,
                filteredProducts,
                searchQuery,
                locationFilter,
                profileFilter,
                selectedProducts,
                quotation,
                setSearchQuery,
                setLocationFilter,
                setProfileFilter,
                addProduct,
                removeProduct,
                updateQuantity,
                clearSelection,
                isProductSelected,
            }}
        >
            {children}
        </CatalogContext.Provider>
    );
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog must be used within a CatalogProvider');
    }
    return context;
}
