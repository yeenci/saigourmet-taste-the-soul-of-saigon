/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

const CreateRestaurant: React.FC = () => {
    // Add state for all fields
    return (
        <div className="card-3d-wrap">
            <div className="card-front" style={{height: 'auto'}}>
                <h3 className="text-center mb-4">Create Restaurant</h3>
                <form>
                    <div className="form-group mb-3">
                        <input type="text" className="form-style" placeholder="Restaurant Name" />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-style" placeholder="Address" />
                    </div>
                    <div className="form-group mb-3">
                        <select className="form-style">
                            <option value="" disabled selected>Select District</option>
                            <option>District 1</option>
                            <option>District 2</option>
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <div className="text-white mb-2">Categories</div>
                        <div className="d-flex flex-wrap gap-3">
                            <label><input type="checkbox" className="me-1"/> Bar</label>
                            <label><input type="checkbox" className="me-1"/> Cafe</label>
                            <label><input type="checkbox" className="me-1"/> Dinner</label>
                        </div>
                    </div>
                    <button className="btn-custom">Create</button>
                </form>
            </div>
        </div>
    );
};

export default CreateRestaurant;