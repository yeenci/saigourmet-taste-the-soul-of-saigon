/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../lib/types";
import { CATEGORIES } from "../lib/constants";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const mockCategories = CATEGORIES;
    setCategories(mockCategories);
  }, []);

  return (
    <div className="container py-4">
      <div className="row g-4 justify-content-center">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-2" key={cat.categoryId}>
            <Link
              to={`/category/${cat.categoryId}`}
              className="text-decoration-none text-dark"
            >
              <div
                className="card border-0 text-center hover-scale"
                style={{ transition: "transform 0.3s" }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="card-img-top rounded shadow-sm"
                  style={{ height: "120px", objectFit: "cover" }}
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
