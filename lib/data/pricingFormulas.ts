export interface WindowFormula {
    code: string;
    location: string;
    profile: string;
    glassType: string;
    basePricePerSqft: number;  // This is the formula
    defaultWidth?: number;      // PDF default
    defaultHeight?: number;     // PDF default
    defaultQuantity?: number;
}

export const windowPricingFormulas: WindowFormula[] = [
    { code: "W01", location: "GF", profile: "MC45", glassType: "51.52mm LAM", basePricePerSqft: 2077.56, defaultWidth: 1296, defaultHeight: 3218, defaultQuantity: 1 },
    { code: "W02", location: "Drawing Room", profile: "MC45", glassType: "51.52mm LAM", basePricePerSqft: 1207.57, defaultWidth: 2624, defaultHeight: 3222, defaultQuantity: 1 },
    { code: "W03", location: "Drawing Room", profile: "MS16", glassType: "51.52mm LAM", basePricePerSqft: 1908.16, defaultWidth: 3917, defaultHeight: 3263, defaultQuantity: 1 },
    { code: "W04", location: "Kitchen", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 2875.37, defaultWidth: 847, defaultHeight: 1442, defaultQuantity: 2 },
    { code: "W05", location: "Dining", profile: "MS16", glassType: "51.52mm LAM", basePricePerSqft: 2082.97, defaultWidth: 2621, defaultHeight: 3319, defaultQuantity: 1 },
    { code: "W06", location: "BR1 GF", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1546.95, defaultWidth: 768, defaultHeight: 1131, defaultQuantity: 1 },
    { code: "W07", location: "BR1 GF", profile: "MS16", glassType: "11.52mm LAM", basePricePerSqft: 2393.25, defaultWidth: 3256, defaultHeight: 1439, defaultQuantity: 1 },
    { code: "W08", location: "Guest Room", profile: "MS16", glassType: "11.52mm LAM", basePricePerSqft: 3512.45, defaultWidth: 1161, defaultHeight: 1443, defaultQuantity: 1 },
    { code: "W09", location: "GWR", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1587.94, defaultWidth: 781, defaultHeight: 975, defaultQuantity: 1 },
    { code: "W10", location: "Hall Side", profile: "MS16", glassType: "51.52mm LAM", basePricePerSqft: 2455.71, defaultWidth: 2872, defaultHeight: 1478, defaultQuantity: 1 },
    { code: "W11", location: "Hall DH", profile: "MS16", glassType: "51.52mm LAM", basePricePerSqft: 1964.30, defaultWidth: 3338, defaultHeight: 3340, defaultQuantity: 1 },
    { code: "W12", location: "Stairs", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1420.94, defaultWidth: 740, defaultHeight: 1469, defaultQuantity: 1 },
    { code: "W13", location: "Stairs", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1409.86, defaultWidth: 741, defaultHeight: 1570, defaultQuantity: 1 },
    { code: "W14", location: "Stairs", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1418.63, defaultWidth: 748, defaultHeight: 1464, defaultQuantity: 1 },
    { code: "W15", location: "Stairs", profile: "MC45", glassType: "11.52mm LAM", basePricePerSqft: 1406.89, defaultWidth: 744, defaultHeight: 1576, defaultQuantity: 1 },
    { code: "W16", location: "BR1 FF WR", profile: "MC45", glassType: "5mm Frosted", basePricePerSqft: 2768.43, defaultWidth: 766, defaultHeight: 1119, defaultQuantity: 1 },
    { code: "W17", location: "BR1 FF", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 3130.97, defaultWidth: 1146, defaultHeight: 1456, defaultQuantity: 1 },
    { code: "W18", location: "BR1 FF", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 1665.19, defaultWidth: 3276, defaultHeight: 2372, defaultQuantity: 1 },
    { code: "W19", location: "GBR FF", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 3195.70, defaultWidth: 1115, defaultHeight: 1441, defaultQuantity: 2 },
    { code: "W20", location: "GBR FF WR", profile: "MC45", glassType: "5mm Frosted", basePricePerSqft: 1123.46, defaultWidth: 810, defaultHeight: 1133, defaultQuantity: 1 },
    { code: "W21", location: "DH", profile: "MC45", glassType: "12mm Toughened", basePricePerSqft: 838.78, defaultWidth: 3382, defaultHeight: 3354, defaultQuantity: 1 },
    { code: "W22", location: "Courtyard FF", profile: "MC45", glassType: "8mm Clear", basePricePerSqft: 879.05, defaultWidth: 1322, defaultHeight: 1417, defaultQuantity: 1 },
    { code: "W23", location: "Courtyard FF", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 2110.53, defaultWidth: 2711, defaultHeight: 1419, defaultQuantity: 1 },
    { code: "W25", location: "L-Shape", profile: "MS16/MC45", glassType: "61.52mm LAM", basePricePerSqft: 1815.25, defaultWidth: 4743, defaultHeight: 3123, defaultQuantity: 1 },
    { code: "W26", location: "Library", profile: "MC45", glassType: "51.52mm LAM", basePricePerSqft: 1375.54, defaultWidth: 638, defaultHeight: 3176, defaultQuantity: 1 },
    { code: "W27", location: "Library Side", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 2402.57, defaultWidth: 2169, defaultHeight: 1284, defaultQuantity: 1 },
    { code: "W28", location: "CW FF", profile: "MC45", glassType: "5mm Frosted", basePricePerSqft: 1224.06, defaultWidth: 712, defaultHeight: 965, defaultQuantity: 1 },
    { code: "W29", location: "Stairs SF", profile: "MC45", glassType: "8mm Clear", basePricePerSqft: 1042.10, defaultWidth: 700, defaultHeight: 1410, defaultQuantity: 1 },
    { code: "W30", location: "Stairs SF", profile: "MC45", glassType: "8mm Clear", basePricePerSqft: 906.65, defaultWidth: 763, defaultHeight: 3336, defaultQuantity: 1 },
    { code: "W31", location: "Stairs SF", profile: "MC45", glassType: "8mm Clear", basePricePerSqft: 1049.50, defaultWidth: 682, defaultHeight: 1424, defaultQuantity: 1 },
    { code: "W32", location: "Stairs SF", profile: "MC45", glassType: "8mm Clear", basePricePerSqft: 910.57, defaultWidth: 753, defaultHeight: 3337, defaultQuantity: 1 },
    { code: "W33", location: "SF BR WR", profile: "MC45", glassType: "5mm Frosted", basePricePerSqft: 1191.25, defaultWidth: 777, defaultHeight: 972, defaultQuantity: 1 },
    { code: "W34", location: "SF BR", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 2983.94, defaultWidth: 1140, defaultHeight: 1438, defaultQuantity: 1 },
    { code: "W35", location: "SF BR", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 1960.45, defaultWidth: 3306, defaultHeight: 1440, defaultQuantity: 1 },
    { code: "W36", location: "SF Lobby", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 3425.15, defaultWidth: 1001, defaultHeight: 1424, defaultQuantity: 1 },
    { code: "W37", location: "SF Terrace", profile: "MS16", glassType: "8mm Clear", basePricePerSqft: 2113.99, defaultWidth: 1743, defaultHeight: 2362, defaultQuantity: 1 },
    { code: "W38", location: "Terrace WR", profile: "MC45", glassType: "5mm Frosted", basePricePerSqft: 1208.06, defaultWidth: 706, defaultHeight: 1012, defaultQuantity: 1 },
    { code: "W39", location: "Hall Courtyard", profile: "MC45", glassType: "51.52mm LAM", basePricePerSqft: 1203.05, defaultWidth: 2696, defaultHeight: 3263, defaultQuantity: 1 },
    { code: "W40", location: "Library", profile: "MC45", glassType: "51.52mm LAM", basePricePerSqft: 1491.65, defaultWidth: 462, defaultHeight: 3203, defaultQuantity: 1 },
    { code: "W41", location: "Guest Room", profile: "MS16", glassType: "11.52mm LAM", basePricePerSqft: 3517.12, defaultWidth: 1159, defaultHeight: 1442, defaultQuantity: 1 },
];
