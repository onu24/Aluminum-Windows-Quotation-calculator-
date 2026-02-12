'use client';

import React from 'react';
import { SelectedProduct, CatalogQuotation } from '@/context/CatalogContext';
import { FaPlus, FaMinus, FaTimes, FaFileDownload, FaEnvelope, FaCopy, FaSave } from 'react-icons/fa';

interface QuotationPanelProps {
    selectedProducts: SelectedProduct[];
    quotation: CatalogQuotation;
    onUpdateQuantity: (code: string, quantity: number) => void;
    onRemoveProduct: (code: string) => void;
    onClearAll: () => void;
    onDownloadPDF?: () => void;
    onEmailQuote?: () => void;
    onCopyDetails?: () => void;
    onSaveQuote?: () => void;
}

export default function QuotationPanel({
    selectedProducts,
    quotation,
    onUpdateQuantity,
    onRemoveProduct,
    onClearAll,
    onDownloadPDF,
    onEmailQuote,
    onCopyDetails,
    onSaveQuote,
}: QuotationPanelProps) {
    const hasProducts = selectedProducts.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                        Selected Items ({selectedProducts.length})
                    </h3>
                    {hasProducts && (
                        <button
                            onClick={onClearAll}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {!hasProducts ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-sm">
                            No products selected yet.
                            <br />
                            Add products from the catalog.
                        </div>
                    </div>
                ) : (
                    selectedProducts.map((product) => (
                        <div
                            key={product.code}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                        >
                            {/* Product Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">
                                        {product.code} • {product.location}
                                    </div>
                                    <div className="text-xs text-gray-600 line-clamp-1">
                                        {product.name}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRemoveProduct(product.code)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onUpdateQuantity(product.code, product.selectedQuantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    >
                                        <FaMinus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-sm">
                                        {product.selectedQuantity}
                                    </span>
                                    <button
                                        onClick={() => onUpdateQuantity(product.code, product.selectedQuantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100"
                                    >
                                        <FaPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Subtotal */}
                            <div className="mt-2 pt-2 border-t border-gray-200 text-right">
                                <span className="text-xs text-gray-500">Subtotal: </span>
                                <span className="font-semibold text-sm text-gray-900">
                                    ₹{product.subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Totals Section */}
            {hasProducts && (
                <div className="border-t border-gray-200 p-4 space-y-2 bg-gray-50">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">
                            ₹{quotation.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Transportation:</span>
                        <span className="font-medium text-gray-900">
                            ₹{quotation.transportation.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Loading:</span>
                        <span className="font-medium text-gray-900">
                            ₹{quotation.loading.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 flex justify-between text-sm">
                        <span className="text-gray-600">Taxable Amount:</span>
                        <span className="font-medium text-gray-900">
                            ₹{quotation.taxable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GST (18%):</span>
                        <span className="font-medium text-gray-900">
                            ₹{quotation.gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="border-t-2 border-gray-400 pt-2 flex justify-between">
                        <span className="font-bold text-gray-900">GRAND TOTAL:</span>
                        <span className="font-bold text-xl text-blue-700">
                            ₹{quotation.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {hasProducts && (
                <div className="border-t border-gray-200 p-4 grid grid-cols-2 gap-2">
                    <button
                        onClick={onDownloadPDF}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                        <FaFileDownload className="w-4 h-4" />
                        PDF
                    </button>
                    <button
                        onClick={onEmailQuote}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                        <FaEnvelope className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        onClick={onCopyDetails}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                        <FaCopy className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={onSaveQuote}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                        <FaSave className="w-4 h-4" />
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}
