import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { Article } from '../types';

const Blogs: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API fetch
        // In real app: fetch('http://app.lemanh0902.id.vn/api/articles')
        const mockArticles: Article[] = [
            {
                articleId: 101,
                title: "Top 5 Hidden Coffee Spots in D1",
                image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
                content: "Discover the quiet corners of Saigon's bustling District 1 where coffee culture thrives away from the noise. We explore vintage cafes hidden in old apartment blocks..."
            },
            {
                articleId: 102,
                title: "A Guide to Saigon Street Food",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
                content: "From Banh Mi to Pho, explore the culinary heritage of Vietnam through its streets. We list the must-try stalls that have been serving for generations."
            },
            {
                articleId: 103,
                title: "Best Rooftop Bars for Sunset",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=600&q=80",
                content: "Catch the golden hour at these spectacular rooftop venues overlooking the skyline. Perfect for romantic dates or chilling with friends."
            },
            {
                articleId: 104,
                title: "Vegetarian Delights in Thao Dien",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
                content: "Healthy eating is easier than ever. Check out these top-rated vegetarian and vegan restaurants in the expat hub of District 2."
            },
            {
                articleId: 105,
                title: "The History of Banh Mi",
                image: "https://images.unsplash.com/photo-1541544537156-21c2d906f0d7?auto=format&fit=crop&w=600&q=80",
                content: "How a French baguette became a Vietnamese icon. We dive deep into the history and variations of the world-famous Banh Mi."
            },
            {
                articleId: 106,
                title: "Late Night Eats: Where to go?",
                image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80",
                content: "Hungry after midnight? Saigon never sleeps. Here is a curated list of places serving delicious hot food 24/7."
            }
        ];

        // Simulate network delay
        setTimeout(() => {
            setArticles(mockArticles);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            {/* Header Section */}
            <div 
                className="py-5 text-center text-white mb-4" 
                style={{
                    background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="container">
                    <h1 className="display-4 fw-bold">Our Blogs</h1>
                    <p className="lead">Stories, guides, and news from the food world of Saigon.</p>
                </div>
            </div>

            <div className="container mb-5">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {articles.map((article) => (
                            <div className="col-md-6 col-lg-4" key={article.articleId}>
                                <div className="card h-100 border-0 shadow-sm hover-scale" style={{transition: 'transform 0.3s'}}>
                                    <div style={{overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem'}}>
                                        <img 
                                            src={article.image} 
                                            className="card-img-top" 
                                            alt={article.title}
                                            style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.5s' }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column p-4">
                                        <div className="mb-2">
                                            <span className="badge bg-light text-dark border">Food Guide</span>
                                            <span className="text-muted ms-2" style={{fontSize: '0.8rem'}}>Nov 24, 2025</span>
                                        </div>
                                        <h4 className="card-title fw-bold mb-3">
                                            <Link to={`/article/${article.articleId}`} className="text-decoration-none text-dark">
                                                {article.title}
                                            </Link>
                                        </h4>
                                        <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            {article.content.length > 120 
                                                ? `${article.content.substring(0, 120)}...` 
                                                : article.content
                                            }
                                        </p>
                                        <div className="mt-3 pt-3 border-top">
                                            <Link 
                                                to={`/article/${article.articleId}`} 
                                                className="fw-bold text-decoration-none"
                                                style={{ color: '#b2744c' }}
                                            >
                                                Read More <i className="fa fa-arrow-right ms-1"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination (Visual only) */}
                {!loading && (
                    <div className="d-flex justify-content-center mt-5">
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                                <li className="page-item active"><a className="page-link" href="#" style={{backgroundColor: '#b2744c', borderColor: '#b2744c'}}>1</a></li>
                                <li className="page-item"><a className="page-link text-dark" href="#">2</a></li>
                                <li className="page-item"><a className="page-link text-dark" href="#">3</a></li>
                                <li className="page-item"><a className="page-link text-dark" href="#">Next</a></li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Blogs;