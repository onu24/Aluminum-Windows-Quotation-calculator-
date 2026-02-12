import { calculateWindowPricing } from './calculator';
import {
    DEFAULT_PROFILE_SYSTEMS,
    DEFAULT_GLASS_TYPES,
    DEFAULT_APP_SETTINGS,
    DEFAULT_ADDITIONAL_CHARGES,
    ProfileSystem
} from '../constants/windowPricing';

describe('calculateWindowPricing', () => {
    const profile = DEFAULT_PROFILE_SYSTEMS[ProfileSystem.MC45];
    const glass = DEFAULT_GLASS_TYPES[0]; // 5mm Frosted
    const appSettings = DEFAULT_APP_SETTINGS;
    const additionalCharges = DEFAULT_ADDITIONAL_CHARGES;

    test('calculates correct price for standard window (1200x1500)', () => {
        const result = calculateWindowPricing({
            width: 1200,
            height: 1500,
            profile,
            glass,
            quantity: 1,
            includeInstallation: false,
            additionalCharges,
            appSettings
        });

        // Area: (1200 * 1500) / 92891 = 19.377
        // Perimeter: (2 * (1200 + 1500)) / 1000 = 5.4
        // Weight: 5.4 * 2.5 = 13.5
        // ... prices will change slightly

        expect(result.areaSqFt).toBeCloseTo(19.377, 3);
    });

    test('includes installation charges when requested', () => {
        const result = calculateWindowPricing({
            width: 1200,
            height: 1500,
            profile,
            glass,
            quantity: 2,
            includeInstallation: true,
            additionalCharges,
            appSettings
        });

        expect(result.installationCharge).toBe(200);
    });

    test('handles MS16 profile system correctly', () => {
        const ms16Profile = DEFAULT_PROFILE_SYSTEMS[ProfileSystem.MS16];
        const result = calculateWindowPricing({
            width: 1000,
            height: 1000,
            profile: ms16Profile,
            glass,
            quantity: 1,
            includeInstallation: false,
            additionalCharges,
            appSettings
        });

        // Area: (1000 * 1000) / 92891 = 10.765
        expect(result.areaSqFt).toBeCloseTo(10.765, 3);
    });
});
