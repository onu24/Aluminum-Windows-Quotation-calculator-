export enum ProfileSystem {
  MC45 = 'MC45',
  MS16 = 'MS16',
}

export enum WindowType {
  CASEMENT = 'Casement',
  FIXED = 'Fixed',
  SLIDING = 'Sliding',
  SLIDING_MESH = 'Sliding with Mesh',
}

export interface ScaledPricing {
  verySmall: { threshold: number; pricePerSqFt: number };
  small: { threshold: number; pricePerSqFt: number };
  medium: { threshold: number; pricePerSqFt: number };
  large: { threshold: number; pricePerSqFt: number };
  extraLarge: { threshold: number; pricePerSqFt: number };
}

export interface ProfileSystemDetails {
  id: string;
  name: string;
  description: string;
  frameSize: string;
  types: WindowType[];
  basePrice: number; // Deprecated: kept for backward compatibility
  scaledPricing: ScaledPricing; // NEW: Tiered pricing based on area
  weightPerMeter: number;
  accessories: string[];
}

export interface GlassType {
  id: string;
  name: string;
  surcharge: number; // Base surcharge per sqft
  weightPerSqFt: number; // Weight in kg per sqft
  scaleMultiplier?: number; // Optional scale adjustment (default 1.0)
}

export interface AccessoryPricing {
  pleatedMesh: number;
  installation: number;
  premiumFinishing: number;
}

export interface CalculationResult {
  areaSqFt: number;
  perimeterMeter: number;
  materialWeight: number;

  // Detailed pricing breakdown
  pricingTier: string;
  profilePricePerSqFt: number;
  profileCost: number;
  glassCost: number;
  accessoryCost: number;

  // Deprecated fields (kept for backward compatibility)
  basePrice: number;
  glassSurcharge: number;

  // Final calculations
  unitPrice: number;
  totalValue: number;
  installationCharge: number;
  transportationCharge: number;
  loadingCharge: number;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
}

export interface GlobalSettings {
  taxes: {
    gstRate: number;
  };
  currency: string;
  dimensions: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
}

export interface CompanySettings {
  name: string;
  address: string;
  contact: string;
  email: string;
  gstin: string;
  logo: string | null; // Base64
}

export const DEFAULT_PROFILE_SYSTEMS: Record<string, ProfileSystemDetails> = {
  [ProfileSystem.MC45]: {
    id: ProfileSystem.MC45,
    name: 'MC45 (Luxury Line Casement System)',
    description: 'Luxury Line Casement System',
    frameSize: '45mm x 45mm',
    types: [WindowType.CASEMENT, WindowType.FIXED],
    basePrice: 1500, // Deprecated
    scaledPricing: {
      verySmall: { threshold: 10, pricePerSqFt: 2600 },
      small: { threshold: 30, pricePerSqFt: 2200 },
      medium: { threshold: 80, pricePerSqFt: 2090 },
      large: { threshold: 150, pricePerSqFt: 1870 },
      extraLarge: { threshold: Infinity, pricePerSqFt: 1760 },
    },
    weightPerMeter: 2.5,
    accessories: ['Butt Hinge', 'Door Locking Handle', 'S2 Handle'],
  },
  [ProfileSystem.MS16]: {
    id: ProfileSystem.MS16,
    name: 'MS16 (Luxury Line 2-Track Sliding System)',
    description: 'Luxury Line 2-Track Sliding System',
    frameSize: '45mm x 45mm',
    types: [WindowType.SLIDING, WindowType.SLIDING_MESH],
    basePrice: 2000, // Deprecated
    scaledPricing: {
      verySmall: { threshold: 10, pricePerSqFt: 2800 },
      small: { threshold: 30, pricePerSqFt: 2400 },
      medium: { threshold: 80, pricePerSqFt: 2280 },
      large: { threshold: 150, pricePerSqFt: 2040 },
      extraLarge: { threshold: Infinity, pricePerSqFt: 1920 },
    },
    weightPerMeter: 3.2,
    accessories: ['Multi-Point Handle', 'Tripal Wheel Roller', 'Pleated Mesh'],
  },
};

export const DEFAULT_GLASS_TYPES: GlassType[] = [
  { id: 'frosted-5mm', name: '5mm Frosted Toughened Glass', surcharge: 100, weightPerSqFt: 0.05, scaleMultiplier: 1.0 },
  { id: 'clear-8mm', name: '8mm Clear Toughened Glass', surcharge: 150, weightPerSqFt: 0.08, scaleMultiplier: 1.0 },
  { id: 'laminated-11.52mm-single', name: '11.52mm Laminated Glass Single', surcharge: 250, weightPerSqFt: 0.15, scaleMultiplier: 1.0 },
  { id: 'laminated-11.52mm-double', name: '11.52mm Laminated Glass Double', surcharge: 400, weightPerSqFt: 0.25, scaleMultiplier: 0.98 },
  { id: 'laminated-51.52mm', name: '51.52mm Laminated Glass', surcharge: 600, weightPerSqFt: 0.50, scaleMultiplier: 0.95 },
];

export const DEFAULT_ADDITIONAL_CHARGES = {
  transportation: 5000,
  loadingUnloading: 2000,
  installationPerWindow: 100,
  serviceCall: 350,
};

export const DEFAULT_ACCESSORY_PRICING: AccessoryPricing = {
  pleatedMesh: 150,
  installation: 2000,
  premiumFinishing: 500,
};

export const DEFAULT_APP_SETTINGS: GlobalSettings = {
  taxes: { gstRate: 18 },
  currency: 'INR',
  dimensions: {
    minWidth: 300,
    maxWidth: 5000,
    minHeight: 300,
    maxHeight: 5000,
  },
};

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'Mega Profile',
  address: 'Industrial Plot No. 123, Phase 1, Gurgaon',
  contact: '+91 98765 43210',
  email: 'info@megaprofile.com',
  gstin: '06AAAAA0000A1Z5',
  logo: null,
};

