"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaEnvelope, FaCopy, FaSave, FaHistory, FaTrash, FaRedo, FaExternalLinkAlt, FaBox } from 'react-icons/fa';
import { CalculationResult, ProfileSystemDetails } from '@/lib/constants/windowPricing';

interface ResultSectionProps {
    calculation: CalculationResult;
    quantity: string;
    width: string;
    height: string;
    selectedProfile: ProfileSystemDetails;
    glassType: string;
    glassTypes: any[];
    premiumFinishing: boolean;
    includeMesh: boolean;
    collapsedSections: {
        specs: boolean;
        materials: boolean;
        cost: boolean;
    };
    toggleSection: (section: 'specs' | 'materials' | 'cost') => void;
    appSettings: any;
    additionalCharges: any;
    isCalculating: boolean;
    isExporting: boolean;
    isEmailing: boolean;
    handleDownloadPDF: () => void;
    handleEmailPDF: () => void;
    showNotification: (message: string, type?: 'success' | 'error') => void;
    saveToHistory: (quoteNumber: string) => void;
    generateQuoteNumber: () => string;
}

const ResultSection: React.FC<ResultSectionProps> = ({
    calculation,
    quantity,
    width,
    height,
    selectedProfile,
    glassType,
    glassTypes,
    premiumFinishing,
    includeMesh,
    collapsedSections,
    toggleSection,
    appSettings,
    additionalCharges,
    isCalculating,
    isExporting,
    isEmailing,
    handleDownloadPDF,
    handleEmailPDF,
    showNotification,
    saveToHistory,
    generateQuoteNumber,
}) => {
    const glass = glassTypes.find(g => g.id === glassType);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            {/* Quotation Header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Quotation Results</h2>
                    <p className="text-sm text-gray-500">Based on your custom specifications</p>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest mb-1">Quote Number</span>
                    <span className="text-lg font-mono font-bold text-gray-700">{generateQuoteNumber()}</span>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-2xl" />}

                {/* Specification Summary Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => toggleSection('specs')}
                        className="w-full text-left"
                    >
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center group">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                                Window Specifications
                            </h3>
                            <span className="md:hidden text-gray-400">
                                {collapsedSections.specs ? 'Show' : 'Hide'}
                            </span>
                        </div>
                    </button>
                    <div className={`p-6 pt-0 md:pt-6 space-y-4 ${collapsedSections.specs ? 'hidden md:block' : 'block'}`}>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">System</span>
                            <span className="text-sm font-medium text-gray-900">{selectedProfile.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Dimensions</span>
                            <span className="text-sm font-medium text-gray-900">{width} × {height} mm</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Area</span>
                            <span className="text-sm font-medium text-gray-900">{calculation.areaSqFt.toFixed(2)} Sq.Ft</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Glass Type</span>
                            <span className="text-sm font-medium text-gray-900">{glass?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Pricing Tier & Breakdown Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Pricing Breakdown
                            </h3>
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                                {calculation.pricingTier}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Profile Rate</span>
                            <span className="text-sm font-semibold text-gray-900">
                                ₹{calculation.profilePricePerSqFt.toLocaleString('en-IN')}/Sq.Ft
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Profile Cost</span>
                            <span className="text-sm font-medium text-gray-900">
                                ₹{calculation.profileCost.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Glass Cost</span>
                            <span className="text-sm font-medium text-gray-900">
                                ₹{calculation.glassCost.toLocaleString('en-IN')}
                            </span>
                        </div>
                        {calculation.accessoryCost > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Accessories</span>
                                <span className="text-sm font-medium text-green-700">
                                    +₹{calculation.accessoryCost.toLocaleString('en-IN')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Material Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => toggleSection('materials')}
                        className="w-full text-left"
                    >
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center group">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Material Specifications
                            </h3>
                            <span className="md:hidden text-gray-400">
                                {collapsedSections.materials ? 'Show' : 'Hide'}
                            </span>
                        </div>
                    </button>
                    <div className={`p-6 pt-0 md:pt-6 space-y-4 ${collapsedSections.materials ? 'hidden md:block' : 'block'}`}>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Frame Profile</span>
                            <span className="text-sm font-medium text-gray-900">{selectedProfile.frameSize}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Weight per unit</span>
                            <span className="text-sm font-medium text-gray-900">{calculation.materialWeight.toFixed(2)} KG</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Color</span>
                            <span className="text-sm font-medium text-gray-900">{premiumFinishing ? 'Dark Grey Powder Coating' : 'Standard White'}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block mb-2">System Accessories</span>
                            <div className="flex flex-wrap gap-2">
                                {selectedProfile.accessories.map((acc, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                        {acc}
                                    </span>
                                ))}
                                {includeMesh && (
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        Pleated Mesh
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost Breakdown Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative">
                {isCalculating && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10" />}
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Cost Breakdown
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unit Price</span>
                        <span className="text-base sm:text-lg font-medium text-gray-900">₹{calculation.unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Total Value ({quantity} units)</span>
                        <span className="text-base sm:text-lg font-medium text-gray-900">₹{calculation.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>

                    {/* Additional Charges - Green */}
                    <div className="space-y-2 bg-green-50/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Transportation</span>
                            <span className="text-sm sm:text-base font-medium text-green-700">₹{calculation.transportationCharge.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Loading/Unloading</span>
                            <span className="text-sm sm:text-base font-medium text-green-700">₹{calculation.loadingCharge.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Installation ({quantity} × ₹{additionalCharges.installationPerWindow})</span>
                            <span className="text-sm sm:text-base font-medium text-green-700">₹{calculation.installationCharge.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">₹{calculation.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>

                    {/* GST - Orange */}
                    <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                        <span className="text-sm text-orange-800">GST ({appSettings.taxes.gstRate}%)</span>
                        <span className="text-base sm:text-lg font-bold text-orange-800">₹{calculation.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>

                    {/* Grand Total - Blue */}
                    <motion.div
                        layout
                        className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-200"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 gap-2">
                            <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Grand Total</span>
                            <span className="text-3xl sm:text-4xl font-bold italic tracking-tight">₹{calculation.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-blue-500/50">
                            <span className="text-xs text-blue-200">Price per Sq.Ft (with GST)</span>
                            <span className="text-sm font-medium">₹{(calculation.grandTotal / calculation.areaSqFt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-2 py-4 sm:py-3 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-base sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-50 min-h-[56px] sm:min-h-0"
                >
                    {isExporting ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FaFilePdf className="w-5 h-5 sm:w-4 sm:h-4" />
                    )}
                    Download PDF
                </button>
                <button
                    onClick={handleEmailPDF}
                    disabled={isEmailing || isExporting}
                    className="flex items-center justify-center gap-2 py-4 sm:py-3 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-base sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors disabled:opacity-50 min-h-[56px] sm:min-h-0"
                >
                    {isEmailing ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FaEnvelope className="w-5 h-5 sm:w-4 sm:h-4" />
                    )}
                    Email Quote
                </button>
                <button
                    onClick={() => {
                        const text = `Quotation for ${selectedProfile.name}\nSize: ${width}x${height}mm\nGrand Total: ₹${calculation.grandTotal.toLocaleString('en-IN')}`;
                        navigator.clipboard.writeText(text);
                        showNotification('Details copied to clipboard');
                    }}
                    className="flex items-center justify-center gap-2 py-4 sm:py-3 px-4 bg-white border border-gray-200 shadow-sm rounded-xl text-base sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors min-h-[56px] sm:min-h-0"
                >
                    <FaCopy className="w-5 h-5 sm:w-4 sm:h-4" />
                    Copy Details
                </button>
                <button
                    onClick={() => saveToHistory(generateQuoteNumber())}
                    className="flex items-center justify-center gap-3 py-4 sm:py-3 px-4 bg-blue-600 shadow-lg shadow-blue-200 rounded-xl text-base sm:text-sm font-bold text-white hover:bg-blue-700 transition-all min-h-[56px] sm:min-h-0"
                >
                    <FaSave className="w-5 h-5 sm:w-4 sm:h-4" />
                    Save Quote
                </button>
            </div>
        </motion.div>
    );
};

export default React.memo(ResultSection);
