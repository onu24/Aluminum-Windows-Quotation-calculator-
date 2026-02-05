'use client';

import { useState, useEffect } from 'react';
import { FaCalculator, FaRuler, FaBox, FaDollarSign, FaCog } from 'react-icons/fa';
import Link from 'next/link';

interface Material {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface CalculationResult {
  materials: Material[];
  totalCost: number;
  sqFtPerWindow: number;
  valuePerSqFt: number;
  areaInSqFt: number;
  areaInSqM: number;
  perimeter: number;
  breakdown: { [key: string]: number };
  summary: {
    windowDimensions: {
      width: number;
      height: number;
      unit: string;
    };
    quantity: number;
    totalWindows: number;
  };
}

export default function Home() {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [profileType, setProfileType] = useState<string>('Standard Window');
  const [quantity, setQuantity] = useState<string>('1');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [profiles, setProfiles] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available profiles
    fetch('/api/quotation/data')
      .then(res => res.json())
      .then(data => {
        if (data.profiles) {
          setProfiles(data.profiles.map((p: any) => p.name));
          if (data.profiles.length > 0) {
            setProfileType(data.profiles[0].name);
          }
        }
      })
      .catch(err => console.error('Error fetching profiles:', err));
  }, []);

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const quantityNum = parseFloat(quantity) || 1;

    if (!width || !height || isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
      setError('Please enter valid width and height (in mm)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/quotation/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          width: widthNum,
          height: heightNum,
          profileType,
          quantity: quantityNum,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate quotation');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while calculating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaRuler className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Aluminum Windows Quotation</h1>
                <p className="text-sm text-gray-500">Calculate materials and costs instantly</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaCog className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaCalculator className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Window Specifications</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (mm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Enter width in millimeters"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <FaRuler className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (mm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height in millimeters"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <FaRuler className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Type
                </label>
                <select
                  value={profileType}
                  onChange={(e) => setProfileType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                >
                  {profiles.length > 0 ? (
                    profiles.map((profile) => (
                      <option key={profile} value={profile}>
                        {profile}
                      </option>
                    ))
                  ) : (
                    <option value="Standard Window">Standard Window</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <FaCalculator className="w-5 h-5" />
                    Calculate Quotation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaBox className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Quotation Results</h2>
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Materials List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Materials Required
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {result.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{material.name}</p>
                            {material.code && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {material.code}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {material.quantity} {material.unit} × ₹{material.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{material.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 font-medium">Total Cost</p>
                      <p className="text-xl font-bold text-blue-900">
                        ₹{result.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 font-medium">Value per Sq Ft</p>
                      <p className="text-xl font-bold text-green-900">
                        ₹{result.valuePerSqFt.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600 font-medium">Sq Ft per Window</p>
                      <p className="text-xl font-bold text-purple-900">
                        {result.sqFtPerWindow.toFixed(2)} sq ft
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-600 font-medium">Unit Price</p>
                      <p className="text-xl font-bold text-orange-900">
                        ₹{(result.totalCost / (result.summary.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Window Dimensions & Measurements */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Window Measurements
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Width</p>
                      <p className="font-semibold text-gray-900">{width} mm</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Height</p>
                      <p className="font-semibold text-gray-900">{height} mm</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Area (Sq Ft)</p>
                      <p className="font-semibold text-gray-900">
                        {result.areaInSqFt.toFixed(2)} sq ft
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Area (Sq M)</p>
                      <p className="font-semibold text-gray-900">
                        {result.areaInSqM.toFixed(2)} m²
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Perimeter</p>
                      <p className="font-semibold text-gray-900">
                        {result.perimeter.toFixed(2)} m
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-900">{quantity} windows</p>
                    </div>
                  </div>
                </div>

                {/* Total Cost Summary */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaDollarSign className="w-6 h-6 text-green-600" />
                      <div>
                        <span className="text-lg font-semibold text-gray-900 block">Grand Total</span>
                        <span className="text-xs text-gray-500">
                          {quantity} window{quantity !== '1' ? 's' : ''} × ₹{(result.totalCost / (parseFloat(quantity) || 1)).toFixed(2)} per window
                        </span>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-green-600">
                      ₹{result.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FaBox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter window dimensions and click Calculate to see results</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
