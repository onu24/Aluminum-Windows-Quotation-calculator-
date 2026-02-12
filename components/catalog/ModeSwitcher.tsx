'use client';

import React from 'react';
import { FaCalculator, FaStore } from 'react-icons/fa';

interface ModeSwitcherProps {
    mode: 'calculator' | 'catalog';
    onModeChange: (mode: 'calculator' | 'catalog') => void;
}

export default function ModeSwitcher({ mode, onModeChange }: ModeSwitcherProps) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 inline-flex gap-2">
            <button
                onClick={() => onModeChange('calculator')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] ${mode === 'calculator'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
            >
                <FaCalculator className="w-5 h-5" />
                Quick Calculator
            </button>
            <button
                onClick={() => onModeChange('catalog')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all min-h-[48px] ${mode === 'catalog'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
            >
                <FaStore className="w-5 h-5" />
                Browse Products
            </button>
        </div>
    );
}
