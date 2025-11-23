/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

const Home: React.FC = () => {
    // const [articles, setArticles] = useState<Article[]>([]);
    // const [topRestaurants, setTopRestaurants] = useState<Restaurant[]>([]);
    const [articles] = useState<Article[]>([]);

    useEffect(() => {
        // Mock data fetching
        // fetch('/api/articles').then(res => res.json()).then(setArticles);
        // fetch('/restaurant/top3').then(res => res.json()).then(setTopRestaurants);
    }, []);

    return (
        <div className="all-content">
            <Navbar />
            
            {/* Hero Section */}
            <section id="home" className="d-flex align-items-center justify-content-center text-center" style={{ height: '80vh', background: '#b2744c' }}>
                <div>
                    <h3>Booking the restaurant <br />you want</h3>
                    <p>Our service is the best option for you.</p>
                    <Link to="/restaurants/all" className="btn btn-light rounded-pill px-4">Booking Now</Link>
                </div>
            </section>

            <section id="about">
                <AboutSection />
            </section>

            <section id="category" className="section-white text-center">
                {/* Embed Category List Component here if strictly React, 
                    or iframe if legacy constraints exist (not recommended) */}
                <h2>Categories</h2>
                <div className="container">
                    {/* Map categories here */}
                </div>
            </section>

            <section id="restaurant" className="section-white">
                <div className="container">
                     <h2 className="text-center mb-4">Top Restaurants</h2>
                     <div className="row">
                        {/* Render Top Restaurants */}
                     </div>
                </div>
            </section>

            <section id="blogs" className="container py-5">
                <h2 className="text-center mb-5">Latest Blogs</h2>
                <div className="row">
                    {/* Map Articles */}
                    {articles.map(article => (
                        <div className="col-md-4" key={article.articleId}>
                            <div className="card h-100">
                                <img src={article.image} className="card-img-top" alt={article.title} />
                                <div className="card-body">
                                    <h5>{article.title}</h5>
                                    <Link to={`/article/${article.articleId}`}>Read More</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;