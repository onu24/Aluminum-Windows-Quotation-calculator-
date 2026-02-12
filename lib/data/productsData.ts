export interface WindowProduct {
    code: string;
    location: string;
    name: string;
    dimensions: string;
    profile: string;
    glassType: string;
    price: number;
    quantity: number;
}

export const productsData: WindowProduct[] = [
    { code: "W01", location: "GF", name: "Luxury Line Casement", dimensions: "1296 x 3218", profile: "MC45", glassType: "51.52mm LAM", price: 93275.29, quantity: 1 },
    { code: "W02", location: "Drawing Room", name: "Fixed Window", dimensions: "2624 x 3222", profile: "MC45", glassType: "51.52mm LAM", price: 109900.87, quantity: 1 },
    { code: "W03", location: "Drawing Room", name: "Luxury Line 2-Track Sliding", dimensions: "3917 x 3263", profile: "MS16", glassType: "51.52mm LAM", price: 262514.06, quantity: 1 },
    { code: "W04", location: "Kitchen", name: "Luxury Line 2-Track Sliding", dimensions: "847 x 1442", profile: "MC45", glassType: "11.52mm LAM", price: 37790.59, quantity: 2 },
    { code: "W05", location: "Dining", name: "Luxury Line 2-Track Sliding", dimensions: "2621 x 3319", profile: "MS16", glassType: "51.52mm LAM", price: 195041.26, quantity: 1 },
    { code: "W06", location: "BR1 GF", name: "Fixed with Exhaust", dimensions: "768 x 1131", profile: "MC45", glassType: "11.52mm LAM", price: 14470.06, quantity: 1 },
    { code: "W07", location: "BR1 GF", name: "Luxury Line 2-Track Sliding", dimensions: "3256 x 1439", profile: "MS16", glassType: "11.52mm LAM", price: 120690.26, quantity: 1 },
    { code: "W08", location: "Guest Room", name: "Luxury Line 2-Track Sliding", dimensions: "1161 x 1443", profile: "MS16", glassType: "11.52mm LAM", price: 63328.50, quantity: 1 },
    { code: "W09", location: "GWR", name: "Fixed with Exhaust", dimensions: "781 x 975", profile: "MC45", glassType: "11.52mm LAM", price: 13007.47, quantity: 1 },
    { code: "W10", location: "Hall Side", name: "Luxury Line 2-Track Sliding", dimensions: "2872 x 1478", profile: "MS16", glassType: "51.52mm LAM", price: 112209.22, quantity: 1 },
    { code: "W11", location: "Hall DH", name: "Luxury Line 2-Track Sliding", dimensions: "3338 x 3340", profile: "MS16", glassType: "51.52mm LAM", price: 235731.69, quantity: 1 },
    { code: "W12", location: "Stairs", name: "Fixed", dimensions: "740 x 1469", profile: "MC45", glassType: "11.52mm LAM", price: 16625.68, quantity: 1 },
    { code: "W13", location: "Stairs", name: "Fixed", dimensions: "741 x 1570", profile: "MC45", glassType: "11.52mm LAM", price: 17649.34, quantity: 1 },
    { code: "W14", location: "Stairs", name: "Fixed", dimensions: "748 x 1464", profile: "MC45", glassType: "11.52mm LAM", price: 16720.75, quantity: 1 },
    { code: "W15", location: "Stairs", name: "Fixed", dimensions: "744 x 1576", profile: "MC45", glassType: "11.52mm LAM", price: 17763.68, quantity: 1 },
    { code: "W16", location: "BR1 FF WR", name: "Fixed with Exhaust", dimensions: "766 x 1119", profile: "MC45", glassType: "5mm Frosted", price: 25538.10, quantity: 1 },
    { code: "W17", location: "BR1 FF", name: "Luxury Line 2-Track Sliding", dimensions: "1146 x 1456", profile: "MS16", glassType: "8mm Clear", price: 56248.23, quantity: 1 },
    { code: "W18", location: "BR1 FF", name: "Luxury Line 2-Track Sliding", dimensions: "3276 x 2372", profile: "MS16", glassType: "8mm Clear", price: 139288.36, quantity: 1 },
    { code: "W19", location: "GBR FF", name: "Luxury Line 2-Track Sliding", dimensions: "1115 x 1441", profile: "MS16", glassType: "8mm Clear", price: 55278.45, quantity: 2 },
    { code: "W20", location: "GBR FF WR", name: "Fixed with Exhaust", dimensions: "810 x 1133", profile: "MC45", glassType: "5mm Frosted", price: 11101.29, quantity: 1 },
    { code: "W21", location: "DH", name: "Fixed", dimensions: "3382 x 3354", profile: "MC45", glassType: "12mm Toughened", price: 102411.72, quantity: 1 },
    { code: "W22", location: "Courtyard FF", name: "Fixed", dimensions: "1322 x 1417", profile: "MC45", glassType: "8mm Clear", price: 17722.60, quantity: 1 },
    { code: "W23", location: "Courtyard FF", name: "Luxury Line 2-Track Sliding", dimensions: "2711 x 1419", profile: "MS16", glassType: "8mm Clear", price: 87395.22, quantity: 1 },
    { code: "W25", location: "L-Shape", name: "Fixed/Sliding Combo", dimensions: "4743 x 3123", profile: "MS16/MC45", glassType: "61.52mm LAM", price: 289437.15, quantity: 1 },
    { code: "W26", location: "Library", name: "Fixed", dimensions: "638 x 3176", profile: "MC45", glassType: "51.52mm LAM", price: 29997.49, quantity: 1 },
    { code: "W27", location: "Library Side", name: "Luxury Line 2-Track Sliding", dimensions: "2169 x 1284", profile: "MS16", glassType: "8mm Clear", price: 72023.56, quantity: 1 },
    { code: "W28", location: "CW FF", name: "Fixed with Exhaust", dimensions: "712 x 965", profile: "MC45", glassType: "5mm Frosted", price: 9051.74, quantity: 1 },
    { code: "W29", location: "Stairs SF", name: "Fixed", dimensions: "700 x 1410", profile: "MC45", glassType: "8mm Clear", price: 11071.37, quantity: 1 },
    { code: "W30", location: "Stairs SF", name: "Fixed", dimensions: "763 x 3336", profile: "MC45", glassType: "8mm Clear", price: 24837.21, quantity: 1 },
    { code: "W31", location: "Stairs SF", name: "Fixed", dimensions: "682 x 1424", profile: "MC45", glassType: "8mm Clear", price: 10969.26, quantity: 1 },
    { code: "W32", location: "Stairs SF", name: "Fixed", dimensions: "753 x 3337", profile: "MC45", glassType: "8mm Clear", price: 24630.74, quantity: 1 },
    { code: "W33", location: "SF BR WR", name: "Fixed with Exhaust", dimensions: "777 x 972", profile: "MC45", glassType: "5mm Frosted", price: 9681.10, quantity: 1 },
    { code: "W34", location: "SF BR", name: "Luxury Line 2-Track Sliding", dimensions: "1140 x 1438", profile: "MS16", glassType: "8mm Clear", price: 52643.29, quantity: 1 },
    { code: "W35", location: "SF BR", name: "Luxury Line 2-Track Sliding", dimensions: "3306 x 1440", profile: "MS16", glassType: "8mm Clear", price: 100468.04, quantity: 1 },
    { code: "W36", location: "SF Lobby", name: "Luxury Line 2-Track Sliding", dimensions: "1001 x 1424", profile: "MS16", glassType: "8mm Clear", price: 52537.30, quantity: 1 },
    { code: "W37", location: "SF Terrace", name: "Luxury Line 2-Track Sliding", dimensions: "1743 x 2362", profile: "MS16", glassType: "8mm Clear", price: 93682.34, quantity: 1 },
    { code: "W38", location: "Terrace WR", name: "Fixed with Exhaust", dimensions: "706 x 1012", profile: "MC45", glassType: "5mm Frosted", price: 9284.55, quantity: 1 },
    { code: "W39", location: "Hall Courtyard", name: "Fixed", dimensions: "2696 x 3263", profile: "MC45", glassType: "51.52mm LAM", price: 113918.09, quantity: 1 },
    { code: "W40", location: "Library", name: "Fixed", dimensions: "462 x 3203", profile: "MC45", glassType: "51.52mm LAM", price: 23763.01, quantity: 1 },
    { code: "W41", location: "Guest Room", name: "Luxury Line 2-Track Sliding", dimensions: "1159 x 1442", profile: "MS16", glassType: "11.52mm LAM", price: 63261.22, quantity: 1 },
];

// Utility functions
export function getUniqueLocations(): string[] {
    const locations = productsData.map(p => p.location);
    return Array.from(new Set(locations)).sort();
}

export function getUniqueProfiles(): string[] {
    const profiles = productsData.map(p => p.profile);
    return Array.from(new Set(profiles)).sort();
}

export function searchProducts(query: string): WindowProduct[] {
    const lowerQuery = query.toLowerCase();
    return productsData.filter(p =>
        p.code.toLowerCase().includes(lowerQuery) ||
        p.location.toLowerCase().includes(lowerQuery) ||
        p.name.toLowerCase().includes(lowerQuery)
    );
}

export function filterProducts(
    location?: string,
    profile?: string
): WindowProduct[] {
    return productsData.filter(p => {
        if (location && location !== 'All' && p.location !== location) return false;
        if (profile && profile !== 'All' && p.profile !== profile) return false;
        return true;
    });
}
