import { ProfileSystemDetails, GlassType, GlobalSettings, CalculationResult, ScaledPricing } from '@/lib/constants/windowPricing';

interface CalculationParams {
    width: number;
    height: number;
    profile: ProfileSystemDetails;
    glass: GlassType;
    quantity: number;
    includeInstallation: boolean;
    includeMesh?: boolean;
    premiumFinishing?: boolean;
    includeTransportation?: boolean;
    includeLoadingUnloading?: boolean;
    additionalCharges: {
        transportation: number;
        loadingUnloading: number;
        installationPerWindow: number;
    };
    accessoryPricing?: {
        pleatedMesh: number;
        installation: number;
        premiumFinishing: number;
    };
    appSettings: GlobalSettings;
    unitPriceOverride?: number; // Rate per Sq.Ft to use instead of tiered pricing
}

/**
 * Determines the pricing tier based on window area
 */
function getPricingTier(areaSqFt: number, scaledPricing: ScaledPricing): { tier: string; pricePerSqFt: number } {
    if (areaSqFt < scaledPricing.verySmall.threshold) {
        return { tier: 'Very Small', pricePerSqFt: scaledPricing.verySmall.pricePerSqFt };
    } else if (areaSqFt < scaledPricing.small.threshold) {
        return { tier: 'Small', pricePerSqFt: scaledPricing.small.pricePerSqFt };
    } else if (areaSqFt < scaledPricing.medium.threshold) {
        return { tier: 'Medium', pricePerSqFt: scaledPricing.medium.pricePerSqFt };
    } else if (areaSqFt < scaledPricing.large.threshold) {
        return { tier: 'Large', pricePerSqFt: scaledPricing.large.pricePerSqFt };
    } else {
        return { tier: 'Extra Large', pricePerSqFt: scaledPricing.extraLarge.pricePerSqFt };
    }
}

/**
 * Advanced window pricing calculator with tiered pricing and scale-based discounts
 */
export const calculateWindowPricing = ({
    width,
    height,
    profile,
    glass,
    quantity,
    includeInstallation,
    includeMesh = false,
    premiumFinishing = false,
    additionalCharges,
    accessoryPricing = { pleatedMesh: 150, installation: 2000, premiumFinishing: 500 },
    appSettings,
    unitPriceOverride,
    includeTransportation = true,
    includeLoadingUnloading = true
}: CalculationParams): CalculationResult => {
    // Step 1: Calculate base dimensions
    // Area in Sq.Ft (1 sqft = 92903.04 mm²)
    const areaSqFt = (width * height) / 92903.04;

    // Perimeter in Meters
    const perimeterMeter = (2 * (width + height)) / 1000;

    // Material weight in KG (frame weight + glass weight)
    const frameWeight = perimeterMeter * profile.weightPerMeter;
    const glassWeight = areaSqFt * glass.weightPerSqFt;
    const materialWeight = frameWeight + glassWeight;

    // Step 2: Determine pricing tier and calculate profile cost
    // If unitPriceOverride is provided, we use it directly and skip glass surcharge (as it's assumed included in the override)
    let profileCost: number;
    let tier: string;
    let pricePerSqFt: number;
    let glassCost: number;

    if (unitPriceOverride && unitPriceOverride > 0) {
        tier = 'Override';
        pricePerSqFt = unitPriceOverride;
        profileCost = areaSqFt * unitPriceOverride;
        glassCost = 0; // Glass cost is assumed part of the override rate for hybrid mode
    } else {
        const tierObj = getPricingTier(areaSqFt, profile.scaledPricing);
        tier = tierObj.tier;
        pricePerSqFt = tierObj.pricePerSqFt;
        profileCost = areaSqFt * pricePerSqFt;

        // Step 3: Calculate glass cost with scale multiplier
        const glassScaleMultiplier = glass.scaleMultiplier || 1.0;
        glassCost = areaSqFt * glass.surcharge * glassScaleMultiplier;
    }

    // Step 4: Calculate unit price (profile + glass)
    const unitPrice = profileCost + glassCost;

    // Step 5: Calculate total value for quantity
    const totalValue = unitPrice * quantity;

    // Step 6: Calculate accessory costs (per window)
    let accessoryCost = 0;

    // Pleated mesh (only for MC45 profile)
    if (includeMesh && profile.id === 'MC45') {
        accessoryCost += accessoryPricing.pleatedMesh;
    }

    // Premium finishing
    if (premiumFinishing) {
        accessoryCost += accessoryPricing.premiumFinishing;
    }

    // Installation (handled separately for backward compatibility)
    const installationCharge = includeInstallation
        ? quantity * additionalCharges.installationPerWindow
        : 0;

    // Total accessory cost for all windows (excluding installation)
    const totalAccessoryCost = accessoryCost * quantity;

    // Step 7: Calculate subtotal
    const transportCharge = includeTransportation ? additionalCharges.transportation : 0;
    const loadingCharge = includeLoadingUnloading ? additionalCharges.loadingUnloading : 0;

    const subtotal = totalValue +
        totalAccessoryCost +
        transportCharge +
        loadingCharge +
        installationCharge;

    // Step 8: Calculate GST
    const gstAmount = subtotal * (appSettings.taxes.gstRate / 100);

    // Step 9: Calculate grand total
    const grandTotal = subtotal + gstAmount;

    // Step 10: Calculate deprecated fields for backward compatibility
    const basePrice = areaSqFt * profile.basePrice; // Old formula
    const glassSurcharge = areaSqFt * glass.surcharge; // Old formula

    return {
        // Dimensions
        areaSqFt: Math.round(areaSqFt * 1000) / 1000,
        perimeterMeter: Math.round(perimeterMeter * 100) / 100,
        materialWeight: Math.round(materialWeight * 100) / 100,

        // Detailed pricing breakdown
        pricingTier: tier,
        profilePricePerSqFt: Math.round(pricePerSqFt * 100) / 100,
        profileCost: Math.round(profileCost * 100) / 100,
        glassCost: Math.round(glassCost * 100) / 100,
        accessoryCost: Math.round(totalAccessoryCost * 100) / 100,

        // Deprecated fields (kept for backward compatibility)
        basePrice: Math.round(basePrice * 100) / 100,
        glassSurcharge: Math.round(glassSurcharge * 100) / 100,

        // Final calculations
        unitPrice: Math.round(unitPrice * 100) / 100,
        totalValue: Math.round(totalValue * 100) / 100,
        installationCharge: Math.round(installationCharge * 100) / 100,
        transportationCharge: transportCharge,
        loadingCharge: loadingCharge,
        subtotal: Math.round(subtotal * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        grandTotal: Math.round(grandTotal * 100) / 100,
    };
};
