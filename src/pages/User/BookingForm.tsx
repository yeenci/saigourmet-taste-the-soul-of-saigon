/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

const BookingForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        restaurantName: '',
        name: '',
        phone: '',
        email: '',
        time: '',
        guests: 1,
        note: ''
    });

    useEffect(() => {
        const rName = searchParams.get('restaurant_name');
        if (rName) {
            setFormData(prev => ({ ...prev, restaurantName: decodeURIComponent(rName) }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/user/createOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, restaurant_id: restaurantId })
            });
            
            if (response.ok) {
                alert('Booking successful!');
                navigate('/');
            }
        } catch (error) {
            alert('Booking failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" 
             style={{backgroundImage: 'url(https://t4.ftcdn.net/jpg/09/28/14/51/360_F_928145187_1ztkJxvyComd8MhioRwGJ9iUnG1rE3Ab.jpg)', backgroundSize: 'cover'}}>
            <div className="container" style={{maxWidth: '600px', background: 'rgba(0,0,0,0.8)', padding: '30px', borderRadius: '10px'}}>
                <h3 className="text-center text-white mb-4">Book Your Table</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        className="form-style" 
                        value={formData.restaurantName} 
                        readOnly 
                        placeholder="Restaurant Name"
                    />
                    <input 
                        type="text" 
                        className="form-style" 
                        placeholder="Your Name" 
                        required
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        type="tel" 
                        className="form-style" 
                        placeholder="Phone Number" 
                        required
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                    <input 
                        type="email" 
                        className="form-style" 
                        placeholder="Email" 
                        required
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="datetime-local" 
                        className="form-style" 
                        required
                        onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                    <input 
                        type="number" 
                        className="form-style" 
                        placeholder="Number of Guests" 
                        min="1"
                        required
                        onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                    />
                    <textarea 
                        className="form-style" 
                        rows={3} 
                        placeholder="Special Requests"
                        style={{height: 'auto'}}
                        onChange={e => setFormData({...formData, note: e.target.value})}
                    ></textarea>
                    <button type="submit" className="btn-custom mt-3">Book Now</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;