import { useState, useEffect } from 'react';
import { EMISSION_FACTORS } from '../constants/emissions';

export const useCarbonCalculator = (activities) => {
  const [totalCO2, setTotalCO2] = useState(0);

  useEffect(() => {
    let calculatedCO2 = 0;

    if (activities.transport.type && activities.transport.value > 0) {
      const factor = EMISSION_FACTORS.transport[activities.transport.type];
      calculatedCO2 += factor * activities.transport.value;
    }

    if (activities.food.type && activities.food.value > 0) {
      const factor = EMISSION_FACTORS.food[activities.food.type];
      calculatedCO2 += factor * activities.food.value;
    }

    if (activities.energy.value > 0) {
      const factor = EMISSION_FACTORS.energy.electricity;
      calculatedCO2 += factor * activities.energy.value;
    }

    setTotalCO2(calculatedCO2);
  }, [activities]);

  return totalCO2.toFixed(2);
};