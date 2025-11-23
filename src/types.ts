export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    profilePictureUrl?: string;
}

export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    district: string;
    picture: string;
    rating: number;
    openTime: string;
    closeTime: string;
}

export interface Booking {
    bookingId: number;
    restaurantName: string;
    customerName: string;
    date: string;
    guests: number;
    status: 'PENDING' | 'ACCEPTED' | 'DENIED' | 'POSTPONED';
}

export interface Article {
    articleId: number;
    title: string;
    image: string;
    content: string;
}

export interface Category {
    categoryId: string; // or number, depending on backend
    name: string;
    image: string;
}

export interface Restaurant {
    restaurantId: number;
    name: string;
    address: string;
    district: string;
    picture: string;
    rating: number;
    openTime: string;
    closeTime: string;
}

export interface Article {
    articleId: number;
    title: string;
    image: string;
    content: string;
}