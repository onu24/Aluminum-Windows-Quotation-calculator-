import { WindowCalculationInput, WindowCalculationResult, QuotationData, Material } from './models';

export function calculateWindowQuotation(
  input: WindowCalculationInput,
  quotationData: QuotationData
): WindowCalculationResult {
  const { width, height, profileType, quantity = 1 } = input;

  // Find the profile
  const profile = quotationData.profiles.find(p =>
    p.name.toLowerCase().includes(profileType.toLowerCase()) ||
    profileType.toLowerCase().includes(p.name.toLowerCase()) ||
    (p.code && p.code.toLowerCase() === profileType.toLowerCase())
  ) || quotationData.profiles[0];

  if (!profile || !profile.materials || profile.materials.length === 0) {
    throw new Error('No materials found for the selected profile');
  }

  const materials: WindowCalculationResult['materials'] = [];
  const breakdown: { [key: string]: number } = {};
  let totalCost = 0;

  // Calculate dimensions
  const widthM = width / 1000; // Convert mm to meters
  const heightM = height / 1000; // Convert mm to meters
  const perimeter = 2 * (widthM + heightM); // Perimeter in meters
  const areaSqM = (width * height) / 1000000;
  const areaSqFt = parseFloat(((width * height) / 92891).toFixed(3));
  const sqFtPerWindow = areaSqFt;

  // Calculate materials based on window dimensions
  for (const material of profile.materials) {
    let materialQuantity = 0;
    let unitPrice = material.price;

    // Calculate quantity based on material type and formulas
    const materialName = material.name.toLowerCase();
    const materialCategory = material.category?.toLowerCase() || '';

    if (materialCategory.includes('frame') || materialName.includes('frame') || materialName.includes('profile')) {
      // Frame material: based on perimeter
      materialQuantity = perimeter;
    } else if (materialCategory.includes('glass') || materialName.includes('glass') || materialName.includes('glazing')) {
      // Glass: based on area
      materialQuantity = areaSqM;
    } else if (materialCategory.includes('screw') || materialCategory.includes('bolt') || materialName.includes('screw') || materialName.includes('bolt')) {
      // Fasteners: fixed quantity per window
      materialQuantity = 8; // Standard 8 screws per window
    } else if (materialCategory.includes('seal') || materialCategory.includes('gasket') || materialName.includes('seal') || materialName.includes('gasket')) {
      // Seals: based on perimeter
      materialQuantity = perimeter;
    } else if (materialCategory.includes('handle') || materialCategory.includes('lock') || materialName.includes('handle') || materialName.includes('lock')) {
      // Hardware: fixed quantity
      materialQuantity = 1;
    } else {
      // Default: use area-based calculation
      materialQuantity = areaSqM;
    }

    // Apply quantity multiplier
    materialQuantity = materialQuantity * quantity;

    // Round to 2 decimal places
    materialQuantity = Math.ceil(materialQuantity * 100) / 100;

    const totalPrice = materialQuantity * unitPrice;
    totalCost += totalPrice;

    materials.push({
      name: material.name,
      quantity: materialQuantity,
      unit: material.unit,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      ...(material.code && { code: material.code })
    });

    breakdown[material.name] = totalPrice;
  }

  // Add labor and overhead costs (if specified in formulas)
  if (quotationData.formulas && quotationData.formulas['Labor Cost']) {
    const laborCost = totalCost * 0.15; // 15% labor cost
    totalCost += laborCost;
    breakdown['Labor Cost'] = laborCost;
  }

  // Calculate value per square foot
  const valuePerSqFt = sqFtPerWindow > 0 ? totalCost / sqFtPerWindow : 0;

  // Use profile-specific values if available
  let finalSqFtPerWindow = profile.sqFtPerWindow || sqFtPerWindow;
  let finalValuePerSqFt = profile.valuePerSqFt || valuePerSqFt;

  // If profile has total cost, use it
  if (profile.totalCost) {
    totalCost = profile.totalCost * quantity;
    if (finalSqFtPerWindow > 0) {
      finalValuePerSqFt = totalCost / (finalSqFtPerWindow * quantity);
    }
  }

  return {
    materials,
    totalCost: Math.round(totalCost * 100) / 100,
    sqFtPerWindow: Math.round(finalSqFtPerWindow * 100) / 100,
    valuePerSqFt: Math.round(finalValuePerSqFt * 100) / 100,
    areaInSqFt: Math.round(areaSqFt * 100) / 100,
    areaInSqM: Math.round(areaSqM * 100) / 100,
    perimeter: Math.round(perimeter * 100) / 100,
    breakdown,
    summary: {
      windowDimensions: {
        width: width,
        height: height,
        unit: 'mm'
      },
      quantity: quantity,
      totalWindows: quantity
    }
  };
}
