export interface CropRecommendationInput {
  soilType: 'sandy' | 'loamy' | 'clay' | 'silt';
  phLevel: number;
  waterAvailability: 'low' | 'moderate' | 'high';
  season: 'wet' | 'dry';
  budget: 'low' | 'moderate' | 'high';
}

export interface CropRecommendationResult {
  recommendedCrops: Array<{
    name: string;
    suitabilityScore: number; // 0 to 100
    whySelected: string;
    plantingGuide: string;
    expectedYield: string;
    waterRequirement: string;
    estimatedRevenue: string;
  }>;
  generalAdvice: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfallProbability: number;
  windSpeed: number;
  condition: string;
  description: string;
  advisory: string; // agricultural advisory for the day
  forecast: Array<{
    day: string;
    temperature: number;
    condition: string;
    rainfallProbability: number;
  }>;
}

export interface MarketPrice {
  cropName: string;
  pricePerKg: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  grade: string;
  lastUpdated: string;
}

export interface PestDiagnosisResult {
  pestName: string;
  confidence: number;
  description: string;
  symptoms: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
}

export interface SoilHealthRecord {
  id: string;
  date: string;
  fieldLocation: string;
  ph: number;
  nitrogen: number; // ppm or kg/ha
  phosphorus: number;
  potassium: number;
  moisture: number; // %
  notes?: string;
}

export interface IrrigationSchedule {
  id: string;
  cropName: string;
  fieldLocation: string;
  waterAmountLiters: number;
  frequencyDays: number;
  nextScheduledTime: string;
  status: 'pending' | 'completed' | 'skipped';
  growthStage: 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
}

export interface FarmExpense {
  id: string;
  date: string;
  category: 'seeds' | 'fertilizer' | 'labor' | 'fuel' | 'equipment' | 'irrigation' | 'pesticides' | 'other';
  description: string;
  amount: number;
  cropCycle?: string;
}

export interface FertilizerPlan {
  cropName: string;
  nitrogenNeeded: number; // kg/ha
  phosphorusNeeded: number;
  potassiumNeeded: number;
  plannedApplications: Array<{
    timing: string; // e.g., "At Planting", "2 Weeks", "Flowering"
    fertilizerType: string; // e.g., "Urea", "14-14-14", "Muriate of Potash"
    rateKgHa: number;
  }>;
  calculatedBagRequirement: {
    urea: number; // bags of 50kg
    npk14_14_14: number;
    mop: number;
  };
}

export interface SensorData {
  timestamp: string;
  moisture: number; // %
  temperature: number; // °C
  status: 'optimal' | 'dry' | 'wet' | 'hot' | 'cold';
}
