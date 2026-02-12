const { calculateWindowPricing } = require('./lib/utils/calculator');
const { WINDOW_FORMULAS } = require('./lib/constants/windowFormulas');

// Mock data
const mockProfile = { id: 'MS16', weightPerMeter: 1.2, scaledPricing: { verySmall: { threshold: 10, pricePerSqFt: 10 }, small: { threshold: 20, pricePerSqFt: 20 }, medium: { threshold: 30, pricePerSqFt: 30 }, large: { threshold: 40, pricePerSqFt: 40 }, extraLarge: { threshold: 50, pricePerSqFt: 50 } }, basePrice: 100 };
const mockGlass = { id: 'G01', weightPerSqFt: 5, surcharge: 200 };
const appSettings = { taxes: { gstRate: 18 } };
const additionalCharges = { transportation: 5000, loadingUnloading: 2000, installationPerWindow: 100 };

// W03 Test Case
const width = 3917;
const height = 3263;
const code = 'W03';
const formula = WINDOW_FORMULAS[code];

// Test Hybrid Mode (Override)
const result = calculateWindowPricing({
    width,
    height,
    profile: mockProfile,
    glass: mockGlass,
    quantity: 1,
    includeInstallation: false,
    additionalCharges,
    appSettings,
    unitPriceOverride: formula.pricePerSqFt,
    includeTransportation: false,
    includeLoadingUnloading: false
});

console.log(`W03 (${width}x${height}) @ ${formula.pricePerSqFt}`);
console.log(`Unit Price: ${result.unitPrice}`);
console.log(`Area: ${result.areaSqFt}`);
