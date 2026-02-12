'use client';

import React, { useRef, useState } from 'react';
import { useCatalog } from '@/context/CatalogContext';
import SearchFilters from './SearchFilters';
import ProductGrid from './ProductGrid';
import QuotationPanel from './QuotationPanel';
import { CatalogQuotationPDF } from './CatalogQuotationPDF';

export default function ProductCatalog() {
    const {
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
    } = useCatalog();

    const pdfRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleClearFilters = () => {
        setSearchQuery('');
        setLocationFilter('All');
        setProfileFilter('All');
    };

    const handleDownloadPDF = async () => {
        if (!pdfRef.current || selectedProducts.length === 0) return;

        try {
            setIsGeneratingPDF(true);

            // Lazy load dependencies
            const [html2canvas, { jsPDF }] = await Promise.all([
                import('html2canvas').then(m => m.default),
                import('jspdf')
            ]);

            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const timestamp = Date.now().toString().slice(-6);
            const quoteNo = `AWC-CAT-${timestamp}`;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${quoteNo}.pdf`);

            alert(`PDF generated successfully: ${quoteNo}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Could not generate PDF, please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleEmailQuote = async () => {
        if (selectedProducts.length === 0) return;

        try {
            await handleDownloadPDF();
            // Basic mailto fallback since we don't have a backend mailer
            const subject = encodeURIComponent('Window Quotation');
            const body = encodeURIComponent(
                `Hello,\n\nPlease find attached the quotation for ${selectedProducts.length} items.\nTotal: ₹${quotation.grandTotal.toLocaleString('en-IN')}\n\nRegards.`
            );
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        } catch (e) {
            alert('Could not prepare email.');
        }
    };

    const handleCopyDetails = () => {
        // TODO: Implement copy to clipboard
        const details = selectedProducts
            .map(
                (p) =>
                    `${p.code} - ${p.name} (${p.dimensions}mm) - Qty: ${p.selectedQuantity} - ₹${p.subtotal.toLocaleString('en-IN')}`
            )
            .join('\n');

        const summary = `
Selected Products:
${details}

Subtotal: ₹${quotation.subtotal.toLocaleString('en-IN')}
Transportation: ₹${quotation.transportation.toLocaleString('en-IN')}
Loading: ₹${quotation.loading.toLocaleString('en-IN')}
GST (18%): ₹${quotation.gst.toLocaleString('en-IN')}
GRAND TOTAL: ₹${quotation.grandTotal.toLocaleString('en-IN')}
    `.trim();

        navigator.clipboard.writeText(summary);
        alert('Quotation details copied to clipboard!');
    };

    const handleSaveQuote = () => {
        // TODO: Implement save to history
        alert('Save functionality coming soon!');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
                    <p className="text-gray-600">
                        Browse and select from {filteredProducts.length} available window products
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                    {/* Left Column: Filters and Products */}
                    <div className="space-y-6">
                        {/* Search and Filters */}
                        <SearchFilters
                            searchQuery={searchQuery}
                            locationFilter={locationFilter}
                            profileFilter={profileFilter}
                            onSearchChange={setSearchQuery}
                            onLocationChange={setLocationFilter}
                            onProfileChange={setProfileFilter}
                            onClearFilters={handleClearFilters}
                        />

                        {/* Products Grid */}
                        <ProductGrid
                            products={filteredProducts}
                            onAddProduct={addProduct}
                            isProductSelected={isProductSelected}
                        />
                    </div>

                    {/* Right Column: Quotation Panel (Desktop) */}
                    <div className="hidden lg:block">
                        <QuotationPanel
                            selectedProducts={selectedProducts}
                            quotation={quotation}
                            onUpdateQuantity={updateQuantity}
                            onRemoveProduct={removeProduct}
                            onClearAll={clearSelection}
                            onDownloadPDF={handleDownloadPDF}
                            onEmailQuote={handleEmailQuote}
                            onCopyDetails={handleCopyDetails}
                            onSaveQuote={handleSaveQuote}
                        />
                    </div>
                </div>

                {/* Mobile Quotation Panel (Fixed Bottom) */}
                {selectedProducts.length > 0 && (
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl p-4 z-50">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <div className="text-sm text-gray-600">
                                    {selectedProducts.length} item{selectedProducts.length !== 1 ? 's' : ''} selected
                                </div>
                                <div className="text-xl font-bold text-blue-700">
                                    ₹{quotation.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    // TODO: Open mobile quotation panel modal
                                    alert('View full quotation details');
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden PDF Template for Export */}
                <div className="hidden">
                    <div className="bg-white">
                        <CatalogQuotationPDF
                            ref={pdfRef}
                            quotation={quotation}
                            quoteNumber="AWC-PREVIEW"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
