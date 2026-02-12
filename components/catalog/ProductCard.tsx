'use client';

import React from 'react';
import { WindowProduct } from '@/lib/data/productsData';
import { FaPlus, FaCheck } from 'react-icons/fa';

interface ProductCardProps {
    product: WindowProduct;
    onAdd: (product: WindowProduct) => void;
    isAdded: boolean;
}

export default function ProductCard({ product, onAdd, isAdded }: ProductCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-700">{product.code}</span>
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                        {product.location}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[48px]">
                    {product.name}
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Dimensions:</span>
                        <span className="font-medium text-gray-900">{product.dimensions} mm</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Profile:</span>
                        <span className="font-medium text-gray-900">{product.profile}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Glass:</span>
                        <span className="font-medium text-gray-900 text-xs">{product.glassType}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="pt-3 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </div>
                    {product.quantity > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Default Qty: {product.quantity}
                        </div>
                    )}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => onAdd(product)}
                    disabled={isAdded}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all min-h-[48px] ${isAdded
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                        }`}
                >
                    {isAdded ? (
                        <>
                            <FaCheck className="w-4 h-4" />
                            Added to Quotation
                        </>
                    ) : (
                        <>
                            <FaPlus className="w-4 h-4" />
                            Add to Quotation
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
