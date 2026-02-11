import { useState, useEffect } from 'react';
import {
    ProfileSystem,
    CalculationResult,
} from '@/lib/constants/windowPricing';
import { usePricing } from '@/context/PricingContext';
import { calculateWindowPricing } from '@/lib/utils/calculator';

interface UseWindowCalculationProps {
    width: number;
    height: number;
    profileType: string;
    glassType: string;
    quantity: number;
    includeInstallation: boolean;
}

interface CalculateWindowReturn {
    isValid: boolean;
    errors: string[];
    calculation: CalculationResult | null;
    isCalculating: boolean;
}

export const useWindowCalculation = ({
    width,
    height,
    profileType,
    glassType,
    quantity,
    includeInstallation,
}: UseWindowCalculationProps): CalculateWindowReturn => {
    const { profiles, glassTypes, additionalCharges, appSettings } = usePricing();
    const [result, setResult] = useState<CalculateWindowReturn>({
        isValid: false,
        errors: [],
        calculation: null,
        isCalculating: false,
    });

    useEffect(() => {
        // Immediately set isCalculating to true when inputs change
        setResult(prev => ({ ...prev, isCalculating: true }));

        const handler = setTimeout(() => {
            try {
                const errors: string[] = [];

                // Validation logic using dynamic appSettings
                const w = parseFloat(width.toString());
                const h = parseFloat(height.toString());
                const q = parseFloat(quantity.toString());

                if (isNaN(w) || w < appSettings.dimensions.minWidth || w > appSettings.dimensions.maxWidth) {
                    errors.push(`Width must be between ${appSettings.dimensions.minWidth}mm and ${appSettings.dimensions.maxWidth}mm`);
                }
                if (isNaN(h) || h < appSettings.dimensions.minHeight || h > appSettings.dimensions.maxHeight) {
                    errors.push(`Height must be between ${appSettings.dimensions.minHeight}mm and ${appSettings.dimensions.maxHeight}mm`);
                }
                if (isNaN(q) || q <= 0 || !Number.isInteger(q)) {
                    errors.push('Quantity must be an integer greater than 0');
                }

                const profile = profiles[profileType];
                if (!profile) {
                    errors.push('Invalid profile type');
                }

                const glass = glassTypes.find((g) => g.id === glassType);
                if (!glass) {
                    errors.push('Invalid glass type');
                }

                if (errors.length > 0) {
                    setResult({
                        isValid: false,
                        errors,
                        calculation: null,
                        isCalculating: false,
                    });
                    return;
                }

                const calculation = calculateWindowPricing({
                    width: w,
                    height: h,
                    profile,
                    glass: glass!,
                    quantity: q,
                    includeInstallation,
                    additionalCharges,
                    appSettings
                });

                setResult({
                    isValid: true,
                    errors: [],
                    isCalculating: false,
                    calculation,
                });
            } catch (error) {
                console.error('Calculation error:', error);
                setResult({
                    isValid: false,
                    errors: ['Error calculating quotation'],
                    calculation: null,
                    isCalculating: false,
                });
            }
        }, 500); // Debounce 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [width, height, profileType, glassType, quantity, includeInstallation, profiles, glassTypes, additionalCharges, appSettings]);

    return result;
};
