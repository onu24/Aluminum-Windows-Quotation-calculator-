import React from 'react';
import { CalculationResult, ProfileSystemDetails, GlassType, CompanySettings } from '@/lib/constants/windowPricing';

interface QuotationPDFProps {
    id: string; // The print target ID
    data: any; // Calculation result wrapper
    profile: ProfileSystemDetails;
    glass?: GlassType;
    quoteNumber: string;
    companySettings: CompanySettings;
    gstRate: number;
    customer: {
        name: string;
        contact: string;
        email: string;
    };
    dimensions: {
        width: string;
        height: string;
        quantity: string;
    };
}

export const QuotationPDF = React.forwardRef<HTMLDivElement, QuotationPDFProps>(({
    id,
    data,
    profile,
    glass,
    quoteNumber,
    companySettings,
    gstRate,
    customer,
    dimensions
}, ref) => {
    const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    if (!data?.calculation) return null;

    const { calculation } = data;

    return (
        <div
            id={id}
            ref={ref}
            className="bg-white p-12 text-gray-900 font-sans max-w-[800px] mx-auto border border-gray-100 shadow-2xl"
            style={{ width: '800px', minHeight: '1130px' }} // Standard A4 Aspect Ratio at 96dpi
        >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {companySettings.logo ? (
                            <img src={companySettings.logo} alt="Logo" className="w-12 h-12 object-contain rounded-lg" />
                        ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                {companySettings.name.charAt(0)}
                            </div>
                        )}
                        <h1 className="text-3xl font-black tracking-tighter text-blue-900 uppercase">{companySettings.name}</h1>
                    </div>
                    <p className="text-sm text-gray-500 font-medium uppercase">{companySettings.address.split(',').slice(-1)[0] || 'Aluminum Window Solutions'}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 uppercase tracking-widest">Quotation</h2>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-500">ID: <span className="text-blue-600">{quoteNumber}</span></p>
                        <p className="text-xs font-bold text-gray-500">DATE: <span className="text-gray-900">{date}</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-10">
                {/* Company Info */}
                <div>
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">From</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                        <p className="font-bold text-gray-900 text-base">{companySettings.name}</p>
                        <p>{companySettings.address}</p>
                        <p>GSTIN: {companySettings.gstin}</p>
                        <p className="text-blue-600 font-medium pt-1">{companySettings.email}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div>
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Quotation For</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                        <p className="font-bold text-gray-900 text-base">{customer.name || 'Valued Customer'}</p>
                        {customer.contact && <p>Contact: {customer.contact}</p>}
                        {customer.email && <p>Email: {customer.email}</p>}
                        {!customer.contact && !customer.email && <p className="italic text-gray-400">Direct Purchase</p>}
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[.2em] mb-4 border-l-4 border-blue-600 pl-3">
                    Window Specifications
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex justify-between">
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Type</p>
                            <p className="text-sm font-bold text-gray-900">{profile.name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Frame Dimensions</p>
                            <p className="text-sm font-bold text-gray-900">{profile.frameSize}</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-center">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Quantity</p>
                            <p className="text-sm font-bold text-gray-900">{dimensions.quantity || '01'} Pcs</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Glass Specification</p>
                            <p className="text-sm font-bold text-gray-900">{glass?.name || 'Standard Clear'}</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-right">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Size (W x H)</p>
                            <p className="text-sm font-bold text-gray-900">{dimensions.width}mm x {dimensions.height}mm</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Area</p>
                            <p className="text-sm font-bold text-gray-900">{calculation.areaSqFtDisplay} Sq.Ft</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Table */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[.2em] mb-4 border-l-4 border-blue-600 pl-3">
                    Cost Breakdown
                </h3>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-tighter text-[10px] font-black">
                            <th className="py-4 font-black">Description</th>
                            <th className="py-4 font-black text-right">Rate / Sq.Ft</th>
                            <th className="py-4 font-black text-right">Qty / Area</th>
                            <th className="py-4 font-black text-right">Amount (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr>
                            <td className="py-4 pr-10">
                                <p className="font-bold text-gray-900">Aluminum System & Hardware</p>
                                <p className="text-xs text-gray-400 mt-1">{profile.name} casement system including accessories.</p>
                            </td>
                            <td className="py-4 text-right">₹{profile.basePrice.toLocaleString()}</td>
                            <td className="py-4 text-right">{calculation.areaSqFtDisplay}</td>
                            <td className="py-4 text-right font-bold">₹{calculation.basePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td className="py-4 pr-10">
                                <p className="font-bold text-gray-900">Glass Solution</p>
                                <p className="text-xs text-gray-400 mt-1">{glass?.name || 'Standard Glass'}</p>
                            </td>
                            <td className="py-4 text-right">₹{glass?.surcharge.toLocaleString() || 0}</td>
                            <td className="py-4 text-right">{calculation.areaSqFtDisplay}</td>
                            <td className="py-4 text-right font-bold">₹{calculation.glassSurcharge.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr className="bg-blue-50/30">
                            <td className="py-4 pr-10 font-bold text-blue-900">Logistics & Services</td>
                            <td className="py-4 text-right text-xs text-gray-400">Fixed Flat</td>
                            <td className="py-4 text-right">01 Set</td>
                            <td className="py-4 text-right font-bold text-blue-900">₹{(calculation.transportationCharge + calculation.loadingCharge + calculation.installationCharge).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end pt-8 border-t border-gray-100">
                <div className="w-80 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-gray-900 text-lg tracking-normal">₹{calculation.subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <span>GST ({gstRate}%)</span>
                        <span className="text-gray-900 text-lg tracking-normal">₹{calculation.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="bg-blue-600 rounded-xl p-6 text-white shadow-xl shadow-blue-200 mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-black uppercase tracking-widest text-blue-100">Grand Total</span>
                            <span className="text-2xl font-black">₹{calculation.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <p className="text-[10px] font-medium text-blue-200 uppercase tracking-wider">Inclusive of all taxes and services</p>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-12">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Terms & Conditions</h4>
                    <ul className="text-[10px] space-y-2 text-gray-400 font-bold leading-relaxed list-disc pl-3">
                        <li>Quotation validity: 30 days from the date of issue.</li>
                        <li>Payment: 50% advance, balance before installation.</li>
                        <li>Standard installation includes 1st floor level.</li>
                        <li>Warranty: 10 years on aluminum profile finish.</li>
                    </ul>
                </div>
                <div className="flex flex-col justify-end text-right">
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-[.3em] mb-4">Authorized Signature</p>
                    <div className="h-20 flex items-center justify-end">
                        <div className="w-40 border-b-2 border-dashed border-gray-200"></div>
                    </div>
                    <p className="text-xs font-black text-gray-900 mt-4">For {companySettings.name}</p>
                </div>
            </div>
        </div>
    );
});

QuotationPDF.displayName = 'QuotationPDF';

