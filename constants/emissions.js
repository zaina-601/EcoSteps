export const EMISSION_FACTORS = {
  transport: {
    car: 0.21, // per km
    bus: 0.105, // per km
    train: 0.041, // per km
    flight: 0.255, // per km (short-haul)
  },
  food: {
    beef: 2.5, // per 100g serving
    chicken: 0.4, // per 100g serving
    fish: 0.6, // per 100g serving
    vegetables: 0.1, // per serving
    vegan: 0.05, // per serving
  },
  energy: {
    electricity: 0.475, // per kWh
  },
};