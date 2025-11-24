/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import type { Booking } from '../../lib/types';

const OwnerBookingOrder: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [modalType, setModalType] = useState<'EDIT' | 'DELETE' | null>(null);

    useEffect(() => {
        // fetch('/admin/getBookingOrder').then(res => res.json()).then(setBookings);
        // Mock data
        setBookings([
            { bookingId: 1, restaurantName: 'Pizza Hut', customerName: 'John', date: '2023-10-10', guests: 2, status: 'PENDING' }
        ]);
    }, []);

    const handleEditClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setModalType('EDIT');
    };

    const handleDeleteClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setModalType('DELETE');
    };

    const closeModals = () => {
        setModalType(null);
        setSelectedBooking(null);
    };

    return (
        <div className="container mt-5 section-white">
            <div className="d-flex justify-content-between mb-3">
                <h2>Booking Orders</h2>
                <select className="form-select w-auto">
                    <option>Filter by Status</option>
                    <option value="PENDING">Pending</option>
                </select>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover border">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Guests</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.bookingId}>
                                <td>{b.bookingId}</td>
                                <td>{b.customerName}</td>
                                <td>{b.guests}</td>
                                <td>{b.date}</td>
                                <td>
                                    <span className={`badge bg-${b.status === 'ACCEPTED' ? 'success' : 'warning'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(b)}>
                                        <i className="fa fa-edit"></i>
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(b)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Implementation using Conditional Rendering */}
            {modalType === 'EDIT' && selectedBooking && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Booking #{selectedBooking.bookingId}</h5>
                                <button className="btn-close" onClick={closeModals}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <label>Response Note</label>
                                    <input type="text" className="form-control mb-2" />
                                    <label>Status</label>
                                    <select className="form-control">
                                        <option>ACCEPTED</option>
                                        <option>DENIED</option>
                                    </select>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModals}>Close</button>
                                <button className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBookingOrder;