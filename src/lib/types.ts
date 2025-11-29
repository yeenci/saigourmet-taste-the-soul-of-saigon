export interface UserProfileData {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  profilePictureUrl: string;
  joinDate: string;
}

export interface Restaurant {
  restaurantId: string;
  name: string;
  address: string;
  district: string;
  picture: string;
  rating: number;
  openTime: string;
  closeTime: string;
  categories: string[];
}

export interface Booking {
  booking_id: string;
  restaurant_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  time: string;
  num_of_guests: number;
  note: string;
  booking_status: "PENDING" | "ACCEPTED" | "DENIED" | "POSTPONED";
}

export interface Article {
  articleId: string;
  title: string;
  image: string;
  content: string;
  date: string;
  category: string;
  readTime?: string;
}

export interface Category {
  categoryId: number;
  name: string;
  image: string;
  icon: string;
}

export interface District {
  districtId: number;
  name: string;
  image: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}