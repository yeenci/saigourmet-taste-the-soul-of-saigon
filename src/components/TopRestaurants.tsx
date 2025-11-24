/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../lib/types';

const TopRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        // Mock Data - In real app: fetch('/restaurant/top3')
        const mockTop3: Restaurant[] = [
            {
                restaurantId: 1,
                name: "The Deck Saigon",
                address: "38 Nguyen U Di, Thao Dien",
                district: "District 2",
                picture: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60",
                rating: 4.8,
                openTime: "08:00",
                closeTime: "23:00"
            },
            {
                restaurantId: 2,
                name: "Pizza 4P's Ben Thanh",
                address: "8 Thu Khoa Huan",
                district: "District 1",
                picture: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=60",
                rating: 4.9,
                openTime: "10:00",
                closeTime: "22:00"
            },
            {
                restaurantId: 3,
                name: "Secret Garden",
                address: "158 Pasteur",
                district: "District 1",
                picture: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60",
                rating: 4.7,
                openTime: "07:00",
                closeTime: "22:00"
            }
        ];
        setRestaurants(mockTop3);
    }, []);

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {restaurants.map((restaurant) => (
                    <div className="col" key={restaurant.restaurantId}>
                        <div className="card h-100 shadow-sm border-0">
                            <img
                                src={restaurant.picture}
                                alt={restaurant.name}
                                className="card-img-top"
                                style={{ height: '250px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title fw-bold mb-0">{restaurant.name}</h5>
                                    <span className="badge bg-success">⭐ {restaurant.rating}</span>
                                </div>
                                <p className="text-muted small mb-1">
                                    <i className="fa fa-map-marker me-1"></i> 
                                    {restaurant.district}
                                </p>
                                <p className="text-muted small mb-2">{restaurant.address}</p>
                                <p className="text-muted small mb-3">
                                    <i className="fa fa-clock-o me-1"></i>
                                    {restaurant.openTime} - {restaurant.closeTime}
                                </p>
                                <Link 
                                    to={`/booking/${restaurant.restaurantId}?restaurant_name=${encodeURIComponent(restaurant.name)}`} 
                                    className="btn btn-custom w-100"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRestaurants;