import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], onDeleteProduct }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onDeleteProduct={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
