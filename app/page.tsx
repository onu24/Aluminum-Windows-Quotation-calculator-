"use client";
import { useState, useRef, useEffect } from 'react';
import {
  FaCalculator, FaRuler, FaBox, FaDollarSign, FaCog,
  FaFilePdf, FaEnvelope, FaCopy, FaSave, FaCheckCircle,
  FaUndo, FaExclamationTriangle, FaInfoCircle, FaUser, FaPhone, FaAt,
  FaHistory, FaTrash, FaRedo, FaExternalLinkAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowCalculation } from '@/hooks/useWindowCalculation';
import { QuotationPDF } from '@/components/QuotationPDF';
import { usePricing } from '@/context/PricingContext';
import ResultSection from '@/components/ResultSection';
import { CatalogProvider } from '@/context/CatalogContext';
import ModeSwitcher from '@/components/catalog/ModeSwitcher';
import ProductCatalog from '@/components/catalog/ProductCatalog';
import { productsData } from '@/lib/data/productsData';
import { windowPricingFormulas } from '@/lib/data/pricingFormulas';

interface SavedQuote {
  id: string;
  timestamp: string;
  width: string;
  height: string;
  profileType: string;
  glassType: string;
  quantity: string;
  unitPrice: number;
  grandTotal: number;
  quoteNumber: string;
  customerName: string;
  includeInstallation: boolean;
}

export default function Home() {
  const { profiles, glassTypes, companySettings, appSettings, additionalCharges } = usePricing();

  // Mode state: 'calculator' for the quick calculator, 'catalog' for browsing products
  const [mode, setMode] = useState<'calculator' | 'catalog'>('calculator');

  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [profileType, setProfileType] = useState<string>(Object.keys(profiles)[0]);
  const [quantity, setQuantity] = useState<string>('1');

  // Customer State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerContact, setCustomerContact] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');

  // Glass & Options State
  const [glassType, setGlassType] = useState<string>(glassTypes[1]?.id || glassTypes[0]?.id || ''); // Default to 8mm Clear if exists
  const [includeMesh, setIncludeMesh] = useState<boolean>(false);
  const [includeInstallation, setIncludeInstallation] = useState<boolean>(false);
  const [includeTransportation, setIncludeTransportation] = useState<boolean>(true);
  const [includeLoadingUnloading, setIncludeLoadingUnloading] = useState<boolean>(true);
  const [premiumFinishing, setPremiumFinishing] = useState<boolean>(false);

  // Hybrid Approach State
  const [selectedWindowCode, setSelectedWindowCode] = useState<string>('');
  const [unitPriceOverride, setUnitPriceOverride] = useState<number | undefined>(undefined);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [quoteHistory, setQuoteHistory] = useState<SavedQuote[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const [isEmailing, setIsEmailing] = useState(false);

  // Mobile Collapse State
  const [collapsedSections, setCollapsedSections] = useState({
    specs: false,
    materials: false,
    cost: false
  });

  const toggleSection = (section: 'specs' | 'materials' | 'cost') => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Load history on mount
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('quote_history_v2') || '[]');
      setQuoteHistory(history);
    } catch (e) {
      console.error('Failed to load history', e);
      showNotification('Could not load quotation history', 'error');
    }
  }, []);

  const { calculation, isValid, errors, isCalculating } = useWindowCalculation({
    width: parseFloat(width) || 0,
    height: parseFloat(height) || 0,
    profileType,
    glassType,
    quantity: parseFloat(quantity) || 0,
    includeInstallation,
    includeMesh,
    premiumFinishing,
    includeTransportation,
    includeLoadingUnloading,
    unitPriceOverride
  });

  // Calculation success notification
  useEffect(() => {
    if (isValid && calculation) {
      showNotification('Quotation calculated successfully', 'success');
    }
  }, [isValid, !!calculation]);

  const handleWindowCodeSelect = (code: string) => {
    setSelectedWindowCode(code);
    if (!code) {
      setUnitPriceOverride(undefined);
      return;
    }

    const formula = windowPricingFormulas.find(f => f.code === code);
    if (formula) {
      // 1. Clear dimensions for manual entry
      setWidth('');
      setHeight('');
      if (formula.defaultQuantity) setQuantity(formula.defaultQuantity.toString());

      // 2. Set Profile and Glass
      if (profiles[formula.profile]) {
        setProfileType(formula.profile);
      } else if (formula.profile.includes('MS16')) {
        setProfileType('MS16');
      } else if (formula.profile.includes('MC45')) {
        setProfileType('MC45');
      }

      // Glass Type matching
      const glass = glassTypes.find(g =>
        formula.glassType.toLowerCase().includes(g.id.toLowerCase()) ||
        g.name.toLowerCase().includes(formula.glassType.toLowerCase())
      );
      if (glass) {
        setGlassType(glass.id);
      }

      // 3. Set fixed unit rate directly from the formula
      setUnitPriceOverride(formula.basePricePerSqft);

      showNotification(`✓ Formula loaded for ${code}: ₹${formula.basePricePerSqft.toFixed(2)}/Sq.Ft`, 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const selectedProfile = profiles[profileType];
  const selectedGlass = glassTypes.find(g => g.id === glassType);

  const generateQuoteNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `AWC-QT-${timestamp}`;
  };

  const saveToHistory = (quoteNo: string) => {
    if (!calculation) return;

    try {
      const newQuote: SavedQuote = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        width,
        height,
        profileType,
        glassType,
        quantity,
        unitPrice: calculation.unitPrice,
        grandTotal: calculation.grandTotal,
        quoteNumber: quoteNo,
        customerName,
        includeInstallation
      };

      const updatedHistory = [newQuote, ...quoteHistory];
      const limitedHistory = updatedHistory.slice(0, 50); // Keep last 50
      setQuoteHistory(limitedHistory);
      localStorage.setItem('quote_history_v2', JSON.stringify(limitedHistory));
      showNotification('Quote saved to history', 'success');
    } catch (e) {
      console.error('Failed to save to history', e);
      showNotification('Could not save quotation', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || !calculation) return;

    try {
      setIsExporting(true);
      // Lazy load html2canvas and jspdf
      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then(m => m.default),
        import('jspdf')
      ]);

      // Intentional delay for better UX as requested
      await new Promise(resolve => setTimeout(resolve, 2000));

      const quoteNo = generateQuoteNumber();
      const element = pdfRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${quoteNo}.pdf`);

      saveToHistory(quoteNo);
      showNotification(`PDF downloaded: ${quoteNo}.pdf`, 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showNotification('Could not generate PDF, please try again', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const reloadQuote = (quote: SavedQuote) => {
    setWidth(quote.width);
    setHeight(quote.height);
    setProfileType(quote.profileType);
    setGlassType(quote.glassType);
    setQuantity(quote.quantity);
    setCustomerName(quote.customerName || '');
    setIncludeInstallation(quote.includeInstallation || false);
    showNotification('Quotation reloaded');
  };

  const deleteFromHistory = (id: string) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      try {
        const updatedHistory = quoteHistory.filter(q => q.id !== id);
        setQuoteHistory(updatedHistory);
        localStorage.setItem('quote_history_v2', JSON.stringify(updatedHistory));
        showNotification('Quote deleted', 'success');
      } catch (e) {
        showNotification('Could not delete quote', 'error');
      }
    }
  };

  const clearHistory = () => {
    if (confirm('Clear all quotation history? This cannot be undone.')) {
      try {
        setQuoteHistory([]);
        localStorage.removeItem('quote_history_v2');
        showNotification('History cleared', 'success');
      } catch (e) {
        showNotification('Could not clear history', 'error');
      }
    }
  };


  const handleEmailPDF = async () => {
    if (!calculation) return;
    try {
      setIsEmailing(true);
      await handleDownloadPDF();
      const subject = encodeURIComponent(`Quotation for ${companySettings.name} - ${selectedProfile.name}`);
      const body = encodeURIComponent(
        `Dear ${customerName || 'Customer'},\n\n` +
        `Please find attached the quotation for your window requirements.\n\n` +
        `Summary:\n` +
        `- Profile: ${selectedProfile.name}\n` +
        `- Dimensions: ${width}mm x ${height}mm\n` +
        `- Grand Total: ₹${calculation.grandTotal.toLocaleString('en-IN')}\n\n` +
        `Kindly check the attached PDF for the detailed breakdown.\n\n` +
        `Regards,\n${companySettings.name}`
      );
      window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${body}`;
      showNotification('Drafting email...', 'success');
    } catch (e) {
      showNotification('Could not prepare email', 'error');
    } finally {
      setIsEmailing(false);
    }
  };

  const handleReset = () => {
    setWidth('');
    setHeight('');
    setProfileType(Object.keys(profiles)[0]);
    setQuantity('1');
    setGlassType(glassTypes[0]?.id || '');
    setIncludeMesh(false);
    setIncludeInstallation(false);
    setIncludeTransportation(true);
    setIncludeLoadingUnloading(true);
    setPremiumFinishing(false);
    setCustomerName('');
    setCustomerContact('');
    setCustomerEmail('');
    setSelectedWindowCode('');
    setUnitPriceOverride(undefined);
    showNotification('All inputs reset', 'success');
  };

  // Error check helpers
  const widthError = errors.find(e => e.toLowerCase().includes('width'));
  const heightError = errors.find(e => e.toLowerCase().includes('height'));
  const quantityError = errors.find(e => e.toLowerCase().includes('quantity'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <FaRuler className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Aluminum Windows Quotation</h1>
                <p className="text-xs text-gray-500 font-medium">Real-Time Estimator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all border border-gray-200 text-sm font-medium h-12 sm:h-auto min-w-[48px] justify-center"
                title="Reset"
              >
                <FaUndo className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md shadow-blue-100 text-sm font-medium h-12 sm:h-auto min-w-[48px] justify-center"
              >
                <FaCog className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <CatalogProvider>
          {/* Mode Switcher */}
          <div className="mb-8 flex justify-center">
            <ModeSwitcher mode={mode} onModeChange={setMode} />
          </div>

          {/* Conditional Rendering based on Mode */}
          {mode === 'calculator' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Input Section - Left Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Window Code Selector (Hybrid Approach) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-blue-50/50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FaBox className="text-blue-600" />
                      Select Window Type
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Choose a window code to pre-load pricing & dimensions</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <select
                      id="windowCode"
                      value={selectedWindowCode}
                      onChange={(e) => handleWindowCodeSelect(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 bg-white text-base font-medium"
                    >
                      <option value="">-- Custom (No Code) --</option>
                      {windowPricingFormulas.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.code} - {p.location} - {p.profile}
                        </option>
                      ))}
                    </select>

                    {selectedWindowCode && unitPriceOverride && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 border border-green-100 rounded-lg"
                      >
                        <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                          <FaCheckCircle className="w-3.5 h-3.5" />
                          Fixed Rate: ₹{unitPriceOverride.toFixed(2)} / Sq.Ft
                        </p>
                        <p className="text-[10px] text-green-600 mt-1 italic">
                          Adjust dimensions below; price will scale using this fixed rate.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FaCalculator className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
                    </div>
                    {isCalculating && (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Dimensions */}
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                          Width (mm)
                          <span className="text-[10px] text-gray-400 normal-case">Hint: {appSettings.dimensions.minWidth}-{appSettings.dimensions.maxWidth}mm</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="e.g. 1200"
                            className={`w-full pl-3 pr-10 py-3 bg-white border rounded-lg focus:ring-2 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-base min-h-[48px] ${widthError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                              }`}
                          />
                          <span className="absolute right-3 top-3.5 text-xs text-gray-400 font-medium">mm</span>
                        </div>
                        {widthError && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" />
                            {widthError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                          Height (mm)
                          <span className="text-[10px] text-gray-400 normal-case">Hint: {appSettings.dimensions.minHeight}-{appSettings.dimensions.maxHeight}mm</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g. 1500"
                            className={`w-full pl-3 pr-10 py-3 bg-white border rounded-lg focus:ring-2 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-base min-h-[48px] ${heightError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                              }`}
                          />
                          <span className="absolute right-3 top-3.5 text-xs text-gray-400 font-medium">mm</span>
                        </div>
                        {heightError && (
                          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <FaExclamationTriangle className="w-3 h-3" />
                            {heightError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Profile Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Profile System
                      </label>
                      <select
                        value={profileType}
                        onChange={(e) => {
                          setProfileType(e.target.value);
                          setSelectedWindowCode('');
                          setUnitPriceOverride(undefined);
                        }}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white text-base min-h-[48px]"
                      >
                        {Object.values(profiles).map((profile) => (
                          <option key={profile.id} value={profile.id}>
                            {profile.name}
                          </option>
                        ))}
                      </select>

                      {selectedProfile && (
                        <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-gray-500">Frame:</span>
                            <span className="font-medium text-gray-900">{selectedProfile.frameSize}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Base Price:</span>
                            <span className="font-medium text-blue-700">₹{selectedProfile.basePrice}/sq.ft</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Glass Specifications */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Glass Type
                      </label>
                      <select
                        value={glassType}
                        onChange={(e) => {
                          setGlassType(e.target.value);
                          setSelectedWindowCode('');
                          setUnitPriceOverride(undefined);
                        }}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white text-base min-h-[48px]"
                      >
                        {glassTypes.map((glass) => (
                          <option key={glass.id} value={glass.id}>
                            {glass.name} (+₹{glass.surcharge}/Sq.Ft)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className={`flex items-start gap-3 p-3 border rounded-lg transition-all ${profileType === 'MC45' ? 'cursor-pointer hover:border-blue-300 bg-white border-gray-200' : 'cursor-not-allowed bg-gray-50 opacity-60 border-gray-100'}`}>
                        <input
                          type="checkbox"
                          checked={includeMesh}
                          onChange={(e) => setIncludeMesh(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          disabled={profileType !== 'MC45'}
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                          Include Pleated Mesh (MC45 Only)
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 bg-white transition-all">
                        <input
                          type="checkbox"
                          checked={includeInstallation}
                          onChange={(e) => setIncludeInstallation(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                          Include Installation Service
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 bg-white transition-all">
                        <input
                          type="checkbox"
                          checked={premiumFinishing}
                          onChange={(e) => setPremiumFinishing(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 leading-snug">
                          Premium Finishing <span className="text-xs text-gray-500 block">(Dark Grey Powder Coating)</span>
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(prev => Math.max(1, (parseInt(prev) || 1) - 1).toString())}
                          className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition-colors text-xl font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="1"
                          min="1"
                          className={`flex-1 px-3 py-3 bg-white border rounded-lg focus:ring-2 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-base text-center min-h-[48px] ${quantityError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        <button
                          onClick={() => setQuantity(prev => ((parseInt(prev) || 0) + 1).toString())}
                          className="w-12 h-12 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                      {quantityError && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3" />
                          {quantityError}
                        </p>
                      )}
                    </div>

                    {/* Optional Customer Info */}
                    <div className="space-y-4 pt-5 border-t border-gray-100">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FaUser className="w-3 h-3" />
                        Customer Details (Optional)
                      </h3>
                      <div className="space-y-3">
                        <div className="relative">
                          <FaUser className="absolute left-3 top-3 w-3 h-3 text-gray-400" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer Name"
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs"
                          />
                        </div>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-3 w-3 h-3 text-gray-400" />
                          <input
                            type="text"
                            value={customerContact}
                            onChange={(e) => setCustomerContact(e.target.value)}
                            placeholder="Contact Number"
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xs"
                          />
                        </div>
                        <div className="relative">
                          <FaAt className="absolute left-3 top-3 w-3 h-3 text-gray-400" />
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full pl-9 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[48px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section - Right Column */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  {calculation && isValid ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <ResultSection
                        calculation={calculation}
                        quantity={quantity}
                        width={width}
                        height={height}
                        selectedProfile={selectedProfile}
                        glassType={glassType}
                        glassTypes={glassTypes}
                        premiumFinishing={premiumFinishing}
                        includeMesh={includeMesh}
                        collapsedSections={collapsedSections}
                        toggleSection={toggleSection}
                        appSettings={appSettings}
                        additionalCharges={additionalCharges}
                        isCalculating={isCalculating}
                        isExporting={isExporting}
                        isEmailing={isEmailing}
                        handleDownloadPDF={handleDownloadPDF}
                        handleEmailPDF={handleEmailPDF}
                        showNotification={showNotification}
                        saveToHistory={saveToHistory}
                        generateQuoteNumber={generateQuoteNumber}
                        includeInstallation={includeInstallation}
                        setIncludeInstallation={setIncludeInstallation}
                        includeTransportation={includeTransportation}
                        setIncludeTransportation={setIncludeTransportation}
                        includeLoadingUnloading={includeLoadingUnloading}
                        setIncludeLoadingUnloading={setIncludeLoadingUnloading}
                      />


                      {/* Saved Quotations Section */}
                      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                              <FaHistory className="w-4 h-4 text-orange-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Saved Quotations</h2>
                          </div>
                          {quoteHistory.length > 0 && (
                            <button
                              onClick={clearHistory}
                              className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 transition-colors"
                            >
                              <FaTrash className="w-3 h-3" />
                              Clear All
                            </button>
                          )}
                        </div>

                        <div className="p-0">
                          {quoteHistory.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                              <FaBox className="w-8 h-8 mx-auto mb-3 opacity-20" />
                              <p className="text-sm">No saved quotations yet.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {quoteHistory.slice(0, 5).map((quote) => (
                                <div key={quote.id} className="p-4 hover:bg-gray-50 transition-all group flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-black text-blue-600 tracking-tighter">{quote.quoteNumber}</span>
                                      <span className="text-[10px] text-gray-400">• {new Date(quote.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <p className="text-sm font-bold text-gray-900 truncate">
                                        {quote.customerName || 'Direct Purchase'}
                                      </p>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {quote.width} × {quote.height}mm
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                      <p className="text-sm font-black text-gray-900">₹{quote.grandTotal.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => reloadQuote(quote)}
                                        title="Reload this quote"
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                      >
                                        <FaRedo className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => deleteFromHistory(quote.id)}
                                        title="Delete from history"
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      >
                                        <FaTrash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {quoteHistory.length > 5 && (
                            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                              <button
                                onClick={() => setShowAllHistory(true)}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto transition-colors"
                              >
                                <FaExternalLinkAlt className="w-3 h-3" />
                                View All History ({quoteHistory.length})
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed min-h-[500px]"
                    >
                      <div className="bg-gray-50 p-4 rounded-full mb-4">
                        {isCalculating ? (
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaBox className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {isCalculating ? 'Calculating Results...' : 'Ready to Calculate'}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {errors.length > 0
                          ? "Please correct the errors in the specifications to see the quotation."
                          : "Enter dimensions above. Results will update automatically as you type."
                        }
                      </p>

                      {errors.length > 0 && !isCalculating && (
                        <div className="mt-8 space-y-3 w-full max-w-sm">
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <FaInfoCircle className="w-3.5 h-3.5" />
                              Helpful Hints
                            </h4>
                            <ul className="space-y-2">
                              <li className="text-xs text-blue-700 flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0"></span>
                                Minimum dimension: {appSettings.dimensions.minWidth}mm x {appSettings.dimensions.minHeight}mm
                              </li>
                              <li className="text-xs text-blue-700 flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0"></span>
                                Maximum dimension: {appSettings.dimensions.maxWidth}mm x {appSettings.dimensions.maxHeight}mm
                              </li>
                              <li className="text-xs text-blue-700 flex items-start gap-2">
                                <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0"></span>
                                Quantity must be at least 1
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <ProductCatalog />
          )}
        </CatalogProvider>
      </main>

      {/* History Modal */}
      <AnimatePresence>
        {showAllHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllHistory(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <FaHistory className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Full Quotation History</h2>
                </div>
                <button
                  onClick={() => setShowAllHistory(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Quote No.</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Specifications</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {quoteHistory.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600 text-xs tracking-tighter">
                          {quote.quoteNumber}
                          <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(quote.timestamp).toLocaleDateString('en-IN')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{quote.customerName || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-600">
                            {quote.width}x{quote.height}mm • {quote.quantity} Pcs
                          </p>
                          <p className="text-[10px] text-gray-400">{profiles[quote.profileType]?.name}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-gray-900">₹{quote.grandTotal.toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                reloadQuote(quote);
                                setShowAllHistory(false);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <FaRedo className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteFromHistory(quote.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success'
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-red-600 border-red-500 text-white'
              }`}
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="w-4 h-4 text-blue-200" />
            ) : (
              <FaExclamationTriangle className="w-4 h-4 text-red-200" />
            )}
            <span className="text-sm font-bold tracking-tight">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden PDF for printing */}
      <div className="hidden">
        <QuotationPDF
          id="quotation-pdf"
          data={{ calculation }}
          profile={selectedProfile}
          glass={selectedGlass}
          quoteNumber={generateQuoteNumber()}
          companySettings={companySettings}
          gstRate={appSettings.taxes.gstRate}
          dimensions={{ width, height, quantity }}
          customer={{
            name: customerName,
            contact: customerContact,
            email: customerEmail
          }}
          ref={pdfRef}
        />
      </div>
    </div>
  );
}
