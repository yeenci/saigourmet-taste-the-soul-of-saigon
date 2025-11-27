export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  profilePictureUrl?: string;
}

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
  bookingId: number;
  restaurantName: string;
  customerName: string;
  date: string;
  guests: number;
  status: "PENDING" | "ACCEPTED" | "DENIED" | "POSTPONED";
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

// export interface Restaurant {
//   restaurantId: string;
//   name: string;
//   address: string;
//   district: string;
//   picture: string;
//   rating: number;
//   openTime: string;
//   closeTime: string;
// }
