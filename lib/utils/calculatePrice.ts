// lib/utils/calculatePrice.ts
// ⚠️ NO INTERMEDIATE ROUNDING - FULL PRECISION CALCULATIONS

const CONVERSION_FACTOR = 92903; // 1 Sq.Ft = 92903 mm²

export function calculateWindowPrice(
    widthMm: number,
    heightMm: number,
    pricePerSqFt: number
) {
    // ✅ CORRECT PRECISION CALCULATION - NO INTERMEDIATE ROUNDING

    // Step 1: Area calculation with FULL precision
    const areaMm2 = widthMm * heightMm;
    const areaSqFtFull = areaMm2 / CONVERSION_FACTOR;

    // Step 2: Price calculation with FULL precision
    const unitPriceRaw = areaSqFtFull * pricePerSqFt;

    // Step 3: Round ONLY for display (NOT for calculations)
    const areaSqFtDisplay = parseFloat(areaSqFtFull.toFixed(3)); // Show 3 decimals
    const unitPriceFinal = parseFloat(unitPriceRaw.toFixed(2)); // Show 2 decimals for ₹

    // Now use these in your JSX:
    // - areaSqFtDisplay → for displaying area to user
    // - unitPriceFinal → for displaying ₹ price to user

    // CRITICAL: Only round FINAL outputs to 2 decimals
    return {
        areaSqFt: areaSqFtDisplay, // Display: 3 decimals
        areaSqFtFull: areaSqFtFull, // Internal: full precision
        unitPrice: unitPriceFinal, // FINAL: ₹ format (2 decimals)
        unitPriceRaw: unitPriceRaw, // Internal: full precision
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
