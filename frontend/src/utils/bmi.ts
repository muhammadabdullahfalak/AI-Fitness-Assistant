// BMI calculation utilities

export interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  healthyRange: string;
}

export const calculateBMI = (weight: number, height: number): number => {
  // BMI = weight (kg) / height (m)²
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getBMIDescription = (bmi: number): string => {
  if (bmi < 18.5) {
    return 'You may want to gain some weight. Consult with a healthcare provider for personalized advice.';
  }
  if (bmi < 25) {
    return 'Great! Your weight is in the healthy range. Keep up the good work with regular exercise and balanced nutrition.';
  }
  if (bmi < 30) {
    return 'Consider incorporating more physical activity and a balanced diet to reach a healthier weight.';
  }
  return 'It may be beneficial to work with healthcare professionals to develop a comprehensive weight management plan.';
};

export const getHealthyWeightRange = (height: number): string => {
  const heightInMeters = height / 100;
  const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters);
  return `${minWeight} - ${maxWeight} kg`;
};

export const getBMIAnalysis = (weight: number, height: number): BMIResult => {
  const bmi = calculateBMI(weight, height);
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category: getBMICategory(bmi),
    description: getBMIDescription(bmi),
    healthyRange: getHealthyWeightRange(height),
  };
};