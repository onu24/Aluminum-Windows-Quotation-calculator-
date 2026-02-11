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

        // Area: (1200 * 1500) / 92903.04 = 19.375
        // Perimeter: (2 * (1200 + 1500)) / 1000 = 5.4
        // Weight: 5.4 * 2.5 = 13.5
        // Base Price: 19.375 * 1500 = 29062.5
        // Glass Surcharge: 19.375 * 100 = 1937.5
        // Unit Price: 31000
        // Total Value: 31000
        // Subtotal: 31000 + 5000 + 2000 = 38000
        // GST (18%): 6840
        // Grand Total: 44840

        expect(result.areaSqFt).toBeCloseTo(19.375, 3);
        expect(result.grandTotal).toBeCloseTo(44840, 0);
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

        // Unit Price: 31000
        // Total Value: 62000
        // Installation: 2 * 100 = 200
        // Subtotal: 62000 + 5000 + 2000 + 200 = 69200
        // GST: 12456
        // Grand Total: 81656

        expect(result.installationCharge).toBe(200);
        expect(result.grandTotal).toBeCloseTo(81656, 0);
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

        // Area: (1000 * 1000) / 92903.04 = 10.7639
        // Base Price: 10.7639 * 2000 = 21527.8
        // Glass: 10.7639 * 100 = 1076.39
        // Unit: 22604.19
        // Subtotal: 22604.19 + 5000 + 2000 = 29604.19
        // Grand Total: 29604.19 * 1.18 = 34932.95

        expect(result.grandTotal).toBeCloseTo(34932.95, 1);
    });
});
