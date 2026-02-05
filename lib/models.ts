export interface Material {
  name: string;
  unit: string;
  price: number;
  code?: string;
  description?: string;
  category?: string;
}

export interface WindowProfile {
  name: string;
  code?: string;
  materials: Material[];
  cuttingFormulas?: {
    [key: string]: string; // Formula for calculating material quantities
  };
  totalCost?: number;
  sqFtPerWindow?: number;
  valuePerSqFt?: number;
  description?: string;
}

export interface QuotationData {
  _id?: string;
  profiles: WindowProfile[];
  materials: Material[];
  formulas: {
    [key: string]: {
      formula: string;
      description: string;
    };
  };
  metadata?: {
    totalCost?: number;
    currency?: string;
    unit?: string;
    notes?: string;
  };
  lastUpdated: Date;
  version: number;
}

export interface WindowCalculationInput {
  width: number; // in mm
  height: number; // in mm
  profileType: string;
  quantity?: number;
}

export interface WindowCalculationResult {
  materials: {
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    code?: string;
  }[];
  totalCost: number;
  sqFtPerWindow: number;
  valuePerSqFt: number;
  areaInSqFt: number;
  areaInSqM: number;
  perimeter: number;
  breakdown: {
    [key: string]: number;
  };
  summary: {
    windowDimensions: {
      width: number;
      height: number;
      unit: string;
    };
    quantity: number;
    totalWindows: number;
  };
}
