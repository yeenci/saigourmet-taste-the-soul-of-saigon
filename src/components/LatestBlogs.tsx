/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

const LatestBlogs: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        // Mock Data - In real app: fetch('/api/articles')
        const mockArticles: Article[] = [
            {
                articleId: 101,
                title: "Top 5 Hidden Coffee Spots in D1",
                image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60",
                content: "Discover the quiet corners of Saigon's bustling District 1 where coffee culture thrives..."
            },
            {
                articleId: 102,
                title: "A Guide to Saigon Street Food",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60",
                content: "From Banh Mi to Pho, explore the culinary heritage of Vietnam through its streets..."
            },
            {
                articleId: 103,
                title: "Best Rooftop Bars for Sunset",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=500&q=60",
                content: "Catch the golden hour at these spectacular rooftop venues overlooking the skyline..."
            }
        ];
        setArticles(mockArticles);
    }, []);

    return (
        <div className="container">
            <div className="row g-4">
                {articles.map((article) => (
                    <div className="col-md-4" key={article.articleId}>
                        <div className="card h-100 shadow-sm border-0">
                            <img 
                                src={article.image} 
                                className="card-img-top" 
                                alt={article.title}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title fw-bold" style={{fontSize: '1.25rem'}}>{article.title}</h4>
                                <p className="card-text text-muted flex-grow-1">
                                    {article.content.substring(0, 100)}...
                                </p>
                                <div className="mt-3">
                                    <button 
                                        className="btn btn-outline-dark rounded-pill px-4"
                                        onClick={() => alert('Navigate to article: ' + article.articleId)}
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-5">
                <Link to="/blogs" className="btn btn-custom px-5">See All Blogs</Link>
            </div>
        </div>
    );
};

export default LatestBlogs;