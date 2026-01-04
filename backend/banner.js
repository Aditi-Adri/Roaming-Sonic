import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscountBanner.css';

const DiscountBanner = () => {
    const [discounts, setDiscounts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/discounts/active');
                const data = await response.json();
                if (data.success) {
                    setDiscounts(data.data);
                }
            } catch (error) {
                console.error('Error fetching discounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, []);

    useEffect(() => {
        if (discounts.length > 1) {
            const timer = setInterval(() => {
                handleNext();
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [discounts, currentIndex]);

    const handleNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % discounts.length);
            setIsTransitioning(false);
        }, 400);
    };

    const handleDotClick = (idx) => {
        if (idx === currentIndex) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(idx);
            setIsTransitioning(false);
        }, 400);
    };

    if (loading || discounts.length === 0) return null;

    const currentDiscount = discounts[currentIndex];

    const handleExplore = () => {
        navigate(`/hotels`);
    };

    return (
        <div className="discount-banner-container">
            {/* Decorative background elements */}
            <div className="banner-blob blob-1"></div>
            <div className="banner-blob blob-2"></div>
            <div className="banner-blob blob-3"></div>

            <div className={`discount-banner-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                <div className="banner-main-section">
                    <div className="banner-text-side">
                        <div className="banner-badge">
                            <span className="badge-dot"></span>
                            Limited Time Offer
                        </div>
                        <h2 className="banner-title">
                            <span className="discount-tag">{currentDiscount.discountPercentage}% OFF</span>
                            <br />
                            {currentDiscount.title}
                        </h2>
                        <p className="banner-description">{currentDiscount.description}</p>

                        <div className="banner-timer-v2">
                            <div className="timer-icon">⏳</div>
                            <div className="timer-info">
                                <span className="timer-label">Offer ends in</span>
                                <span className="timer-date">{new Date(currentDiscount.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                        </div>

                        <button className="banner-cta" onClick={handleExplore}>
                            Explore Now
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>

                    <div className="banner-hotels-side">
                        <div className="hotels-grid">
                            {currentDiscount.applicableHotels.slice(0, 2).map((hotel, index) => (
                                <div key={hotel._id} className={`banner-hotel-card-v2 delay-${index}`} onClick={handleExplore}>
                                    <div
                                        className="hotel-img-v2"
                                        style={{ backgroundImage: `url(${hotel.photos?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300'})` }}
                                    >
                                        <div className="hotel-rating-badge">⭐ {hotel.rating}</div>
                                    </div>
                                    <div className="hotel-info-v2">
                                        <h4>{hotel.name}</h4>
                                        <p>📍 {hotel.address?.city}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="banner-footer">
                <div className="banner-progress-container">
                    <div key={currentIndex} className="banner-progress-bar" style={{ animationDuration: '6000ms' }}></div>
                </div>
                <div className="banner-controls-v2">
                    {discounts.map((_, idx) => (
                        <button
                            key={idx}
                            className={`banner-dot-v2 ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscountBanner;
