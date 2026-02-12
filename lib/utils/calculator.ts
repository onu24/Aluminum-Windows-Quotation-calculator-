import { ProfileSystemDetails, GlassType, GlobalSettings, CalculationResult, ScaledPricing } from '@/lib/constants/windowPricing';
import { calculateWindowPrice, applyGSTAndCharges } from './calculatePrice';

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
    // ✅ CORRECT PRECISION CALCULATION - USING ROUNDED AREA AS BASIS
    const area = parseFloat(((Number(width) * Number(height)) / 92903).toFixed(3));
    const areaSqFtFull = area; // Now using the rounded area for all calculations
    const areaSqFtDisplay = area;

    // Perimeter in Meters
    const perimeterMeter = (2 * (width + height)) / 1000;

    // Material weight in KG (frame weight + glass weight)
    const frameWeight = perimeterMeter * profile.weightPerMeter;
    const glassWeight = areaSqFtFull * glass.weightPerSqFt;
    const materialWeight = frameWeight + glassWeight;

    // Step 2: Determine pricing tier and calculate profile cost
    let profileCost: number;
    let tier: string;
    let pricePerSqFt: number;
    let glassCost: number;
    let unitPriceRaw: number;

    if (unitPriceOverride && unitPriceOverride > 0) {
        // Hybrid Mode: Use the precise calculateWindowPrice helper
        const preciseCalc = calculateWindowPrice(width, height, unitPriceOverride);

        tier = 'Override';
        pricePerSqFt = unitPriceOverride;
        profileCost = preciseCalc.unitPriceRaw;
        glassCost = 0;
        unitPriceRaw = preciseCalc.unitPriceRaw;
    } else {
        // Tiered Mode: Logic matching calculateWindowPrice but with components
        const tierObj = getPricingTier(areaSqFtFull, profile.scaledPricing);
        tier = tierObj.tier;
        pricePerSqFt = tierObj.pricePerSqFt;
        const profilePriceRaw = areaSqFtFull * pricePerSqFt;
        profileCost = profilePriceRaw;

        // Step 3: Calculate glass cost with scale multiplier
        const glassScaleMultiplier = glass.scaleMultiplier || 1.0;
        glassCost = areaSqFtFull * glass.surcharge * glassScaleMultiplier;

        unitPriceRaw = profilePriceRaw + glassCost;
    }

    // Step 4: Calculate final rounded display price per user request
    const profilePriceFinal = parseFloat(unitPriceRaw.toFixed(2));

    // Step 5: Calculate total value for quantity
    // unitPriceRaw is already set above

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

    // Use applyGSTAndCharges helper methodology (sum components then calc GST)
    const subtotal = (unitPriceRaw * quantity) +
        totalAccessoryCost +
        transportCharge +
        loadingCharge +
        installationCharge;

    // Step 8: Calculate GST
    const gstAmount = subtotal * (appSettings.taxes.gstRate / 100);

    // Step 9: Calculate grand total
    const grandTotal = subtotal + gstAmount;

    // Step 10: Calculate deprecated fields for backward compatibility
    const basePrice = areaSqFtFull * profile.basePrice; // Old formula
    const glassSurcharge = areaSqFtFull * glass.surcharge; // Old formula

    return {
        // Dimensions
        areaSqFt: areaSqFtDisplay,
        areaSqFtDisplay, // Align with user request
        perimeterMeter: Math.round(perimeterMeter * 100) / 100,
        materialWeight: Math.round(materialWeight * 100) / 100,

        // Detailed pricing breakdown
        pricingTier: tier,
        profilePricePerSqFt: Math.round(pricePerSqFt * 100) / 100,
        profileCost: Math.round(profileCost * 100) / 100,
        glassCost: Math.round(glassCost * 100) / 100,
        accessoryCost: Math.round(totalAccessoryCost * 100) / 100,
        profilePriceFinal, // Align with user request

        // Deprecated fields (kept for backward compatibility)
        basePrice: Math.round(basePrice * 100) / 100,
        glassSurcharge: Math.round(glassSurcharge * 100) / 100,

        // Final calculations
        unitPrice: profilePriceFinal,
        totalValue: parseFloat((unitPriceRaw * quantity).toFixed(2)),
        installationCharge: Math.round(installationCharge * 100) / 100,
        transportationCharge: transportCharge,
        loadingCharge: loadingCharge,
        subtotal: parseFloat(subtotal.toFixed(2)),
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
    };
};
