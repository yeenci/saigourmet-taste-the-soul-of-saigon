/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';

type Step = 'REQUEST' | 'VERIFY' | 'RESET';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('REQUEST');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Data needed across steps
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // US-2: Request OTP
            const res = await fetch('http://app.lemanh0902.id.vn/auth/request-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.ok && data.code === 1) {
                setSessionId(data.data.session_id);
                setStep('VERIFY');
                setMessage({ type: 'success', text: 'OTP sent to your email.' });
            } else {
                setMessage({ type: 'error', text: data.message || 'User not found' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // US-3: Verify OTP
            const res = await fetch('http://localhost:1412/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, otp })
            });
            const data = await res.json();

            if (res.ok && data.code === 1) {
                setStep('RESET');
                setMessage({ type: 'success', text: 'OTP Verified. Set new password.' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Invalid OTP' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // US-4: Reset Password
            const res = await fetch('http://localhost:1412/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, password: newPassword })
            });
            const data = await res.json();

            if (res.ok && data.code === 1) {
                alert('Password reset successfully. Please login.');
                navigate('/login');
            } else {
                setMessage({ type: 'error', text: data.message || 'Error resetting password' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Recovery" subtitle="Follow the steps to recover your account.">
            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} p-2 mb-3 small`}>
                    {message.text}
                </div>
            )}

            {/* Step 1: Request OTP */}
            {step === 'REQUEST' && (
                <form onSubmit={handleRequestOtp}>
                    <div className="modern-input-group">
                        <i className="fa fa-envelope"></i>
                        <input 
                            type="email" className="modern-input" placeholder="Enter your email" 
                            value={email} onChange={e => setEmail(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'VERIFY' && (
                <form onSubmit={handleVerifyOtp}>
                    <p className="small text-muted mb-3">Email: {email}</p>
                    <div className="modern-input-group">
                        <i className="fa fa-key"></i>
                        <input 
                            type="text" className="modern-input" placeholder="Enter OTP code" 
                            value={otp} onChange={e => setOtp(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <div className="text-center mt-2">
                        <button type="button" className="btn btn-link btn-sm text-secondary" onClick={() => setStep('REQUEST')}>
                            Back to Email
                        </button>
                    </div>
                </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 'RESET' && (
                <form onSubmit={handleResetPassword}>
                    <div className="modern-input-group">
                        <i className="fa fa-lock"></i>
                        <input 
                            type="password" className="modern-input" placeholder="New Password" 
                            value={newPassword} onChange={e => setNewPassword(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            )}

            <div className="auth-links">
                Remember your password? <Link to="/login">Sign in</Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;