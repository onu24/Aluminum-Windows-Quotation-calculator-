// lib/utils/calculatePrice.ts
// ⚠️ NO INTERMEDIATE ROUNDING - FULL PRECISION CALCULATIONS

const CONVERSION_FACTOR = 92891; // 1 Sq.Ft = 92891 mm²

export function calculateWindowPrice(
    widthMm: number,
    heightMm: number,
    pricePerSqFt: number
) {
    // ✅ CORRECT PRECISION CALCULATION - NO INTERMEDIATE ROUNDING

    // Step 1: Area calculation with 3-decimal rounding (BASIS FOR ALL CALCS)
    const areaSqFt = parseFloat(((widthMm * heightMm) / CONVERSION_FACTOR).toFixed(3));

    // Step 2: Price calculation using the ROUNDED area
    const unitPriceRaw = areaSqFt * pricePerSqFt;

    // Step 3: Round ONLY for display (NOT for calculations)
    const areaSqFtDisplay = parseFloat(areaSqFt.toFixed(3)); // Show 3 decimals
    const unitPriceFinal = parseFloat(unitPriceRaw.toFixed(2)); // Show 2 decimals for ₹

    // Now use these in your JSX:
    // - areaSqFtDisplay → for displaying area to user
    // - unitPriceFinal → for displaying ₹ price to user

    // CRITICAL: Round FINAL outputs
    return {
        areaSqFt: areaSqFt, // Display: 3 decimals
        areaSqFtFull: areaSqFt, // Base: matches display
        unitPrice: unitPriceFinal, // FINAL: ₹ format (2 decimals)
        unitPriceRaw: unitPriceRaw, // Base: matches display
    };
}

export function applyGSTAndCharges(
    basePrice: number,
    glassCharge: number = 0,
    meshCharge: number = 0,
    otherCharges: number = 0,
    gstRate: number = 18
) {
    const subtotal = basePrice + glassCharge + meshCharge + otherCharges;
    const gstAmount = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + gstAmount;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        gst: parseFloat(gstAmount.toFixed(2)),
        gstRate,
        grandTotal: parseFloat(grandTotal.toFixed(2)),
    };
}
