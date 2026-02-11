'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    ProfileSystemDetails,
    GlassType,
    GlobalSettings,
    CompanySettings,
    DEFAULT_PROFILE_SYSTEMS,
    DEFAULT_GLASS_TYPES,
    DEFAULT_ADDITIONAL_CHARGES,
    DEFAULT_APP_SETTINGS,
    DEFAULT_COMPANY_SETTINGS
} from '@/lib/constants/windowPricing';

interface PricingContextType {
    profiles: Record<string, ProfileSystemDetails>;
    glassTypes: GlassType[];
    additionalCharges: typeof DEFAULT_ADDITIONAL_CHARGES;
    appSettings: GlobalSettings;
    companySettings: CompanySettings;
    lastUpdated: string | null;
    updateProfiles: (profiles: Record<string, ProfileSystemDetails>) => void;
    updateGlassTypes: (types: GlassType[]) => void;
    updateAdditionalCharges: (charges: typeof DEFAULT_ADDITIONAL_CHARGES) => void;
    updateAppSettings: (settings: GlobalSettings) => void;
    updateCompanySettings: (settings: CompanySettings) => void;
    resetToDefaults: () => void;
    saveAll: () => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const STORAGE_KEY = 'awc_pricing_v1';

export function PricingProvider({ children }: { children: ReactNode }) {
    const [profiles, setProfiles] = useState<Record<string, ProfileSystemDetails>>(DEFAULT_PROFILE_SYSTEMS);
    const [glassTypes, setGlassTypes] = useState<GlassType[]>(DEFAULT_GLASS_TYPES);
    const [additionalCharges, setAdditionalCharges] = useState(DEFAULT_ADDITIONAL_CHARGES);
    const [appSettings, setAppSettings] = useState<GlobalSettings>(DEFAULT_APP_SETTINGS);
    const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.profiles) setProfiles(data.profiles);
                if (data.glassTypes) setGlassTypes(data.glassTypes);
                if (data.additionalCharges) setAdditionalCharges(data.additionalCharges);
                if (data.appSettings) setAppSettings(data.appSettings);
                if (data.companySettings) setCompanySettings(data.companySettings);
                if (data.lastUpdated) setLastUpdated(data.lastUpdated);
            } catch (e) {
                console.error('Failed to parse saved pricing', e);
            }
        }
        setIsInitialized(true);
    }, []);

    const saveAll = () => {
        const data = {
            profiles,
            glassTypes,
            additionalCharges,
            appSettings,
            companySettings,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastUpdated(data.lastUpdated);
    };

    const resetToDefaults = () => {
        if (confirm('Reset all pricing and settings to defaults? This cannot be undone.')) {
            setProfiles(DEFAULT_PROFILE_SYSTEMS);
            setGlassTypes(DEFAULT_GLASS_TYPES);
            setAdditionalCharges(DEFAULT_ADDITIONAL_CHARGES);
            setAppSettings(DEFAULT_APP_SETTINGS);
            setCompanySettings(DEFAULT_COMPANY_SETTINGS);
            setLastUpdated(null);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const value = {
        profiles,
        glassTypes,
        additionalCharges,
        appSettings,
        companySettings,
        lastUpdated,
        updateProfiles: setProfiles,
        updateGlassTypes: setGlassTypes,
        updateAdditionalCharges: setAdditionalCharges,
        updateAppSettings: setAppSettings,
        updateCompanySettings: setCompanySettings,
        resetToDefaults,
        saveAll
    };

    if (!isInitialized) return null; // Avoid hydration mismatch

    return (
        <PricingContext.Provider value={value}>
            {children}
        </PricingContext.Provider>
    );
}

export function usePricing() {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
}
