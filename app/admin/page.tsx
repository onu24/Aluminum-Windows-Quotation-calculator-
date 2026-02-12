'use client';

import { useState, useEffect } from 'react';
import {
  FaUpload, FaFileAlt, FaSync, FaCheckCircle, FaExclamationCircle,
  FaArrowLeft, FaDollarSign, FaCog, FaHistory, FaBuilding,
  FaSave, FaTrash, FaPlus, FaDownload, FaUndo
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePricing } from '@/context/PricingContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  const {
    profiles, updateProfiles,
    glassTypes, updateGlassTypes,
    additionalCharges, updateAdditionalCharges,
    appSettings, updateAppSettings,
    companySettings, updateCompanySettings,
    lastUpdated, resetToDefaults, saveAll
  } = usePricing();

  const { logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'pricing' | 'materials' | 'settings'>('pricing');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Local state for edits
  const [localProfiles, setLocalProfiles] = useState(profiles);
  const [localGlassTypes, setLocalGlassTypes] = useState(glassTypes);
  const [localCharges, setLocalCharges] = useState(additionalCharges);
  const [localSettings, setLocalSettings] = useState(appSettings);
  const [localCompany, setLocalCompany] = useState(companySettings);

  // Sync local state when context changes (e.g. after reset)
  useEffect(() => {
    setLocalProfiles(profiles);
    setLocalGlassTypes(glassTypes);
    setLocalCharges(additionalCharges);
    setLocalSettings(appSettings);
    setLocalCompany(companySettings);
  }, [profiles, glassTypes, additionalCharges, appSettings, companySettings]);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      updateProfiles(localProfiles);
      updateGlassTypes(localGlassTypes);
      updateAdditionalCharges(localCharges);
      updateAppSettings(localSettings);
      updateCompanySettings(localCompany);
      saveAll();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 500);
  };

  const handleExport = () => {
    const data = {
      profiles: localProfiles,
      glassTypes: localGlassTypes,
      additionalCharges: localCharges,
      appSettings: localSettings,
      companySettings: localCompany,
      version: 1.1,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `awc-pricing-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.profiles) setLocalProfiles(data.profiles);
        if (data.glassTypes) setLocalGlassTypes(data.glassTypes);
        if (data.additionalCharges) setLocalCharges(data.additionalCharges);
        if (data.appSettings) setLocalSettings(data.appSettings);
        if (data.companySettings) setLocalCompany(data.companySettings);
        alert('Data import successful! Review the changes and click Save.');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalCompany({ ...localCompany, logo: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-bold min-h-[44px]"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Calculator</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Admin Panel</h1>
                  <p className="hidden sm:block text-xs text-gray-500 font-medium">Configure Pricing, Hardware & Company Settings</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-red-100 text-sm font-bold min-h-[44px]"
                >
                  <FaSync className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg min-h-[48px] sm:min-h-0 min-w-[48px] ${saveStatus === 'success' ? 'bg-green-600 text-white shadow-green-200' :
                    saveStatus === 'error' ? 'bg-red-600 text-white shadow-red-200' :
                      'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                    }`}
                >
                  {saveStatus === 'saving' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave className="w-5 h-5 sm:w-4 sm:h-4" />}
                  <span className="hidden xs:inline">{saveStatus === 'success' ? 'Saved!' : 'Save'}</span>
                  <span className="hidden md:inline">{saveStatus === 'success' ? '' : ' Changes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 sm:gap-8 border-t border-gray-100 mt-2 overflow-x-auto no-scrollbar whitespace-nowrap">
              {[
                { id: 'pricing', label: 'Pricing Engine', icon: FaDollarSign },
                { id: 'materials', icon: FaUpload, label: 'Materials & DB' },
                { id: 'settings', label: 'App Settings', icon: FaCog }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Profile Systems Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg"><FaDollarSign className="w-4 h-4 text-blue-600" /></div>
                      Profile Systems Pricing
                    </h2>
                    <span className="text-[10px] font-black text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded uppercase tracking-widest">
                      Cost per Sq.Ft
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-6 py-3">Profile Name</th>
                          <th className="px-6 py-3">Frame Size</th>
                          <th className="px-6 py-3 text-right">Base Price (₹)</th>
                          <th className="px-6 py-3 text-right">Weight/Meter (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {Object.values(localProfiles).map((profile) => (
                          <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">{profile.name}</p>
                              <p className="text-xs text-gray-400">{profile.description}</p>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-600">{profile.frameSize}</td>
                            <td className="px-6 py-4 text-right">
                              <input
                                type="number"
                                inputMode="decimal"
                                value={profile.basePrice}
                                onChange={(e) => setLocalProfiles({
                                  ...localProfiles,
                                  [profile.id]: { ...profile, basePrice: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-24 px-2 py-3 border border-gray-200 rounded text-right font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-base min-h-[48px]"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={profile.weightPerMeter}
                                onChange={(e) => setLocalProfiles({
                                  ...localProfiles,
                                  [profile.id]: { ...profile, weightPerMeter: parseFloat(e.target.value) || 0 }
                                })}
                                className="w-24 px-2 py-3 border border-gray-200 rounded text-right font-medium text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none text-base min-h-[48px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Glass Types Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg"><FaFileAlt className="w-4 h-4 text-green-600" /></div>
                      Glass Pricing & Surcharges
                    </h2>
                    <button
                      onClick={() => {
                        const id = `custom-${Date.now()}`;
                        setLocalGlassTypes([...localGlassTypes, {
                          id,
                          name: 'New Glass Type',
                          surcharge: 0,
                          weightPerSqFt: 0
                        }]);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaPlus className="w-3 h-3" />
                      Add Glass
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-6 py-3">Glass Type</th>
                          <th className="px-6 py-3 text-right">Weight (kg/sqft)</th>
                          <th className="px-6 py-3 text-right">Surcharge (₹/Sq.Ft)</th>
                          <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {localGlassTypes.map((glass, index) => (
                          <tr key={glass.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={glass.name}
                                onChange={(e) => {
                                  const newTypes = [...localGlassTypes];
                                  newTypes[index].name = e.target.value;
                                  setLocalGlassTypes(newTypes);
                                }}
                                className="w-full max-w-sm px-2 py-1.5 border border-transparent hover:border-gray-200 focus:border-blue-300 rounded outline-none transition-all text-sm font-bold text-gray-900"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={glass.weightPerSqFt}
                                onChange={(e) => {
                                  const newTypes = [...localGlassTypes];
                                  newTypes[index].weightPerSqFt = parseFloat(e.target.value) || 0;
                                  setLocalGlassTypes(newTypes);
                                }}
                                className="w-24 px-2 py-3 border border-gray-200 rounded text-right font-medium text-gray-600 focus:ring-2 focus:ring-blue-100 outline-none text-base min-h-[48px]"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <input
                                type="number"
                                inputMode="decimal"
                                value={glass.surcharge}
                                onChange={(e) => {
                                  const newTypes = [...localGlassTypes];
                                  newTypes[index].surcharge = parseFloat(e.target.value) || 0;
                                  setLocalGlassTypes(newTypes);
                                }}
                                className="w-24 px-2 py-3 border border-gray-200 rounded text-right font-bold text-green-600 focus:ring-2 focus:ring-green-100 outline-none text-base min-h-[48px]"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setLocalGlassTypes(localGlassTypes.filter(g => g.id !== glass.id))}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Charges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Logistics Charges</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Transportation (Base)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-xs text-gray-400">₹</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={localCharges.transportation}
                            onChange={(e) => setLocalCharges({ ...localCharges, transportation: parseFloat(e.target.value) || 0 })}
                            className="w-32 pl-7 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-right font-bold text-blue-900 shadow-sm text-base min-h-[48px]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Loading/Unloading</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-xs text-gray-400">₹</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={localCharges.loadingUnloading}
                            onChange={(e) => setLocalCharges({ ...localCharges, loadingUnloading: parseFloat(e.target.value) || 0 })}
                            className="w-32 pl-7 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-right font-bold text-blue-900 shadow-sm text-base min-h-[48px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Service Fees</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Installation (Per Window)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-xs text-gray-400">₹</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={localCharges.installationPerWindow}
                            onChange={(e) => setLocalCharges({ ...localCharges, installationPerWindow: parseFloat(e.target.value) || 0 })}
                            className="w-32 pl-7 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-right font-bold text-blue-900 shadow-sm text-base min-h-[48px]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Service Call Fee</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-xs text-gray-400">₹</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={localCharges.serviceCall}
                            onChange={(e) => setLocalCharges({ ...localCharges, serviceCall: parseFloat(e.target.value) || 0 })}
                            className="w-32 pl-7 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-right font-bold text-blue-900 shadow-sm text-base min-h-[48px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 max-w-2xl mx-auto mt-20">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <FaSync className="w-10 h-10 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">Synchronize Configuration</h2>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">Import pricing data from a JSON file or export your current setup to use on other devices.</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleExport}
                      className="flex-1 w-full sm:w-auto items-center justify-center gap-2 py-4 px-8 bg-white border-2 border-gray-200 rounded-2xl text-sm font-black text-gray-800 hover:border-blue-600 hover:text-blue-600 transition-all flex"
                    >
                      <FaDownload className="w-4 h-4" />
                      Export Pricing
                    </button>

                    <label className="flex-1 w-full sm:w-auto items-center justify-center gap-2 py-4 px-8 bg-blue-600 rounded-2xl text-sm font-black text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 cursor-pointer flex">
                      <FaUpload className="w-4 h-4" />
                      Import Pricing
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                  </div>

                  <div className="mt-12 pt-12 border-t border-gray-100">
                    <button
                      onClick={resetToDefaults}
                      className="text-xs font-black text-red-500 uppercase tracking-[.2em] flex items-center gap-2 mx-auto hover:text-red-700 transition-colors"
                    >
                      <FaUndo className="w-3 h-3" />
                      Reset to System Defaults
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Company Profile */}
                <div className="md:col-span-8 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-3 bg-indigo-100 rounded-xl"><FaBuilding className="w-6 h-6 text-indigo-600" /></div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900">Company Information</h2>
                        <p className="text-xs text-gray-500">How your business appears on generated PDFs</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Name</label>
                        <input
                          type="text"
                          value={localCompany.name}
                          onChange={(e) => setLocalCompany({ ...localCompany, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900 transition-all text-base min-h-[48px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Registered Address</label>
                        <textarea
                          rows={3}
                          value={localCompany.address}
                          onChange={(e) => setLocalCompany({ ...localCompany, address: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-gray-700 transition-all text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">GSTIN Number</label>
                        <input
                          type="text"
                          value={localCompany.gstin}
                          onChange={(e) => setLocalCompany({ ...localCompany, gstin: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-indigo-700 transition-all uppercase text-base min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tax Rate (GST %)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={localSettings.taxes.gstRate}
                            onChange={(e) => setLocalSettings({
                              ...localSettings,
                              taxes: { ...localSettings.taxes, gstRate: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-900 transition-all text-base min-h-[48px]"
                          />
                          <span className="absolute right-4 top-3 text-gray-400 font-bold">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Support Email</label>
                        <input
                          type="email"
                          value={localCompany.email}
                          onChange={(e) => setLocalCompany({ ...localCompany, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-gray-700 transition-all text-base min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Contact</label>
                        <input
                          type="text"
                          inputMode="tel"
                          value={localCompany.contact}
                          onChange={(e) => setLocalCompany({ ...localCompany, contact: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium text-gray-700 transition-all text-base min-h-[48px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-3 bg-amber-100 rounded-xl"><FaRuler className="w-6 h-6 text-amber-600" /></div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900">Dimension Constraints</h2>
                        <p className="text-xs text-gray-500">Define minimum and maximum window sizes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Min Width</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={localSettings.dimensions.minWidth}
                          onChange={(e) => setLocalSettings({ ...localSettings, dimensions: { ...localSettings.dimensions, minWidth: parseInt(e.target.value) || 0 } })}
                          className="w-full px-2 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-gray-900 outline-none focus:border-amber-400 text-base min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Max Width</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={localSettings.dimensions.maxWidth}
                          onChange={(e) => setLocalSettings({ ...localSettings, dimensions: { ...localSettings.dimensions, maxWidth: parseInt(e.target.value) || 0 } })}
                          className="w-full px-2 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-gray-900 outline-none focus:border-amber-400 text-base min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Min Height</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={localSettings.dimensions.minHeight}
                          onChange={(e) => setLocalSettings({ ...localSettings, dimensions: { ...localSettings.dimensions, minHeight: parseInt(e.target.value) || 0 } })}
                          className="w-full px-2 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-gray-900 outline-none focus:border-amber-400 text-base min-h-[48px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Max Height</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={localSettings.dimensions.maxHeight}
                          onChange={(e) => setLocalSettings({ ...localSettings, dimensions: { ...localSettings.dimensions, maxHeight: parseInt(e.target.value) || 0 } })}
                          className="w-full px-2 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold text-gray-900 outline-none focus:border-amber-400 text-base min-h-[48px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Upload Section */}
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2 w-full text-center">Corporate Branding</h2>

                    <div className="relative group w-full max-w-[200px] aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-6 transition-all hover:border-indigo-400">
                      {localCompany.logo ? (
                        <img
                          src={localCompany.logo}
                          alt="Company Logo"
                          className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <FaBuilding className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-gray-400">No Logo Set</p>
                        </div>
                      )}

                      <label className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <FaPlus className="w-6 h-6 text-white mb-2" />
                        <span className="text-xs font-black text-white px-3 py-1 bg-indigo-500 rounded-full shadow-lg">Upload PNG/JPG</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">Select a high-resolution logo with a transparent background for best results on PDF exports.</p>

                    {localCompany.logo && (
                      <button
                        onClick={() => setLocalCompany({ ...localCompany, logo: null })}
                        className="mt-6 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <FaTrash className="w-3 h-3" />
                        Remove Logo
                      </button>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                    <div className="flex items-center gap-2 mb-4">
                      <FaCheckCircle className="w-4 h-4 text-indigo-200" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100">Quick Support</h3>
                    </div>
                    <p className="text-sm font-bold leading-relaxed mb-6 italic opacity-90">"Need help configuring your custom pricing engine or material database?"</p>
                    <Link href="mailto:support@antigravity.ai" className="block w-full py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl text-center text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all">
                      Contact Specialist
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Persistence Notification */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><FaHistory className="w-3 h-3 text-gray-300" /> Version 1.1 Enterprise</span>
              {lastUpdated && <span>Last Updated: {new Date(lastUpdated).toLocaleString()}</span>}
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Locally Synchronized
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function FaRuler(props: any) {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" {...props}>
      <path d="M496 112H16c-8.8 0-16 7.2-16 16v256c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16zm-16 256H32V144h32v80h32v-80h32v80h32v-80h32v80h32v-80h32v80h32v-80h32v80h32v-80h32v80h32v-80h32v224z" />
    </svg>
  );
}
