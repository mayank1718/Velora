import React, { useEffect } from "react";
import { useBuyer } from "../hooks/useBuyer";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { handleGetProductDetails, product } = useBuyer();
  const { productId } = useParams();
  useEffect(() => {
    handleGetProductDetails(productId);
  }, []);
  console.log(product);
  return <div>hlo</div>;
};

export default ProductDetails;
