import { ProfileSystemDetails, GlassType, GlobalSettings, CalculationResult } from '@/lib/constants/windowPricing';

interface CalculationParams {
    width: number;
    height: number;
    profile: ProfileSystemDetails;
    glass: GlassType;
    quantity: number;
    includeInstallation: boolean;
    additionalCharges: {
        transportation: number;
        loadingUnloading: number;
        installationPerWindow: number;
    };
    appSettings: GlobalSettings;
}

export const calculateWindowPricing = ({
    width,
    height,
    profile,
    glass,
    quantity,
    includeInstallation,
    additionalCharges,
    appSettings
}: CalculationParams): CalculationResult => {
    // Area in Sq.Ft (1 sqft = 92903.04 mm2)
    const areaSqFt = (width * height) / 92903.04;

    // Perimeter in Meters
    const perimeterMeter = (2 * (width + height)) / 1000;

    // Material weight in KG
    const materialWeight = perimeterMeter * profile.weightPerMeter;

    // Base price (Area * Profile Base Price)
    const basePrice = areaSqFt * profile.basePrice;

    // Glass Surcharge
    const glassSurcharge = areaSqFt * glass.surcharge;

    // Unit Price (Base + Glass)
    const unitPrice = basePrice + glassSurcharge;

    // Total Value for quantity
    const totalValue = unitPrice * quantity;

    // Installation Charge
    const installationCharge = includeInstallation
        ? quantity * additionalCharges.installationPerWindow
        : 0;

    // Subtotal
    const subtotal = totalValue +
        additionalCharges.transportation +
        additionalCharges.loadingUnloading +
        installationCharge;

    // GST
    const gstAmount = subtotal * (appSettings.taxes.gstRate / 100);

    // Grand Total
    const grandTotal = subtotal + gstAmount;

    return {
        areaSqFt,
        perimeterMeter,
        materialWeight,
        basePrice,
        glassSurcharge,
        unitPrice,
        totalValue,
        installationCharge,
        transportationCharge: additionalCharges.transportation,
        loadingCharge: additionalCharges.loadingUnloading,
        subtotal,
        gstAmount,
        grandTotal,
    };
};
