export type FitnessGoal = 'weight_loss' | 'maintenance' | 'muscle_gain';

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type SubscriptionTier = 'free' | 'pro';

export interface MacroNutrients {
  calories: number; // in kcal
  protein: number;  // in grams
  carbs: number;    // in grams
  fat: number;      // in grams
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'fats' | 'dairy' | 'fruits_veggies' | 'snacks' | 'beverages';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  servingUnit?: string;
  standardGrams?: number;
  iconName?: string;
}

export interface LoggedMeal {
  id: string;
  userId: string;
  foodId?: string;
  name: string;
  mealCategory: MealCategory;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
  mealTime?: string;
  date?: string; // YYYY-MM-DD
  notes?: string;
}

export interface GoalPreset {
  id: FitnessGoal;
  name: string;
  tagline: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  currentGoal: FitnessGoal;
  subscriptionTier: SubscriptionTier;
  presets: Record<FitnessGoal, GoalPreset>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'success';
  read: boolean;
}

export interface DailyIntakeSummary {
  dayName: string;
  date: string;
  calories: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  isOverBudget: boolean;
}
