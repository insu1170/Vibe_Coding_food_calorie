export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface FoodItem {
  foodName: string;
  confidence: number;
  quantity: string;
  calories: number;
  nutrients: {
    carbohydrates: { value: number; unit: string };
    protein: { value: number; unit: string };
    fat: { value: number; unit: string };
    sugars?: { value: number; unit: string };
    sodium?: { value: number; unit: string };
  };
}

export interface FoodLogSummary {
  totalCalories: number;
  totalCarbohydrates: { value: number; unit: string };
  totalProtein: { value: number; unit: string };
  totalFat: { value: number; unit: string };
}

export interface FoodLog {
  id: string;
  user_id: string;
  meal_type: '아침' | '점심' | '저녁' | '간식';
  items: FoodItem[];
  summary: FoodLogSummary;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type MealType = '아침' | '점심' | '저녁' | '간식';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}
