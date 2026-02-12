'use client';

import React from 'react';
import { getUniqueLocations, getUniqueProfiles } from '@/lib/data/productsData';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchFiltersProps {
    searchQuery: string;
    locationFilter: string;
    profileFilter: string;
    onSearchChange: (query: string) => void;
    onLocationChange: (location: string) => void;
    onProfileChange: (profile: string) => void;
    onClearFilters: () => void;
}

export default function SearchFilters({
    searchQuery,
    locationFilter,
    profileFilter,
    onSearchChange,
    onLocationChange,
    onProfileChange,
    onClearFilters,
}: SearchFiltersProps) {
    const locations = ['All', ...getUniqueLocations()];
    const profiles = ['All', ...getUniqueProfiles()];

    const hasActiveFilters = searchQuery || locationFilter !== 'All' || profileFilter !== 'All';

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by code, location, or name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Location Filter */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Location
                    </label>
                    <select
                        value={locationFilter}
                        onChange={(e) => onLocationChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Profile Filter */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Profile
                    </label>
                    <select
                        value={profileFilter}
                        onChange={(e) => onProfileChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {profiles.map((prof) => (
                            <option key={prof} value={prof}>
                                {prof}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                    <button
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${hasActiveFilters
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FaTimes className="w-4 h-4" />
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
