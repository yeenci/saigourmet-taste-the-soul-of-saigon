/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Mock Data - In real app: fetch('/getCategory')
        const mockCategories: Category[] = [
            { categoryId: 'Bar', name: 'Bar', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=500&q=60' },
            { categoryId: 'Cafe', name: 'Cafe', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=60' },
            { categoryId: 'Dinner', name: 'Dinner', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60' },
            { categoryId: 'Club', name: 'Club', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=500&q=60' },
            { categoryId: 'Event', name: 'Event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=60' },
            { categoryId: 'Activity', name: 'Activity', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=60' }
        ];
        setCategories(mockCategories);
    }, []);

    return (
        <div className="container py-4">
             <div className="row g-4 justify-content-center">
                {categories.map((cat) => (
                    <div className="col-6 col-md-4 col-lg-2" key={cat.categoryId}>
                        <Link to={`/category/${cat.categoryId}`} className="text-decoration-none text-dark">
                            <div className="card border-0 text-center hover-scale" style={{ transition: 'transform 0.3s' }}>
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="card-img-top rounded shadow-sm"
                                    style={{ height: '120px', objectFit: 'cover' }}
                                />
                                <div className="card-body p-2">
                                    <h6 className="card-title fw-bold">{cat.name}</h6>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;