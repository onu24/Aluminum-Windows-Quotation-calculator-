'use client';

import React, { forwardRef } from 'react';
import { CatalogQuotation } from '@/context/CatalogContext';
import { usePricing } from '@/context/PricingContext';

interface CatalogQuotationPDFProps {
    quotation: CatalogQuotation;
    quoteNumber: string;
    customerName?: string;
    customerContact?: string;
}

export const CatalogQuotationPDF = forwardRef<HTMLDivElement, CatalogQuotationPDFProps>(
    ({ quotation, quoteNumber, customerName, customerContact }, ref) => {
        const { companySettings } = usePricing();
        const date = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        return (
            <div
                ref={ref}
                className="bg-white p-12 max-w-[800px] mx-auto text-gray-900 font-sans"
                style={{ width: '800px', minHeight: '1100px' }}
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 mb-1">{companySettings.name}</h1>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{companySettings.address}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold">Phone:</span> {companySettings.contact}
                            <br />
                            <span className="font-semibold">Email:</span> {companySettings.email}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-4">Quotation</h2>
                        <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p><span className="text-gray-500">Quote No:</span> <span className="font-bold text-blue-600">{quoteNumber}</span></p>
                            <p><span className="text-gray-500">Date:</span> <span className="font-medium">{date}</span></p>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Attention To:</p>
                            <p className="text-lg font-bold text-gray-900">{customerName || 'Valued Customer'}</p>
                            {customerContact && <p className="text-sm text-gray-600 mt-1">{customerContact}</p>}
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Item / Location</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Rate</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Qty</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {quotation.products.map((item) => (
                                <tr key={item.code} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 align-top">
                                        <div className="font-bold text-blue-600 text-sm whitespace-nowrap">{item.code}</div>
                                        <div className="text-xs text-gray-500 mt-1">{item.location}</div>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <div className="font-semibold text-gray-900 text-sm break-words">{item.name}</div>
                                        <div className="text-[10px] text-gray-500 mt-1">
                                            {item.dimensions}mm • {item.profile} • {item.glassType}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-top text-right text-sm">
                                        ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-4 align-top text-center text-sm font-medium">
                                        {item.selectedQuantity}
                                    </td>
                                    <td className="px-4 py-4 align-top text-right text-sm font-bold">
                                        ₹{item.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <div className="w-72 space-y-3">
                        <div className="flex justify-between text-base">
                            <span className="text-gray-500 font-medium">Subtotal</span>
                            <span className="text-gray-900 font-bold">
                                ₹{quotation.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Transportation Charges</span>
                            <span className="text-gray-900 font-medium">
                                ₹{quotation.transportation.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Loading & Handling</span>
                            <span className="text-gray-900 font-medium">
                                ₹{quotation.loading.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between text-sm">
                            <span className="text-gray-500">Taxable Amount</span>
                            <span className="text-gray-900 font-semibold">
                                ₹{quotation.taxable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">GST (18%)</span>
                            <span className="text-gray-900 font-semibold">
                                ₹{quotation.gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-lg p-4 flex justify-between items-center mt-6">
                            <span className="text-sm font-bold uppercase tracking-tight">Grand Total</span>
                            <span className="text-2xl font-black">
                                ₹{quotation.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] text-gray-400 leading-relaxed">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-gray-600 uppercase mb-2">Terms & Conditions</h4>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Quote is valid for 15 days from the date of issue.</li>
                                <li>50% advance payment required for order confirmation.</li>
                                <li>Estimated delivery: 2-3 weeks from final measurement.</li>
                            </ul>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-600 uppercase mb-4">Authorized Signatory</p>
                            <div className="h-12 w-32 border-b border-gray-300 ml-auto mb-2"></div>
                            <p className="text-gray-500 font-medium">{companySettings.name}</p>
                        </div>
                    </div>
                    <p className="mt-8 text-center italic">Thank you for choosing {companySettings.name}!</p>
                </div>
            </div>
        );
    }
);

CatalogQuotationPDF.displayName = 'CatalogQuotationPDF';
