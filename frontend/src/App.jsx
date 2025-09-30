import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import PaymentButton from "./PaymentButton";

const sampleProduct = {
  price: {
    amount: 100000,
    currency: "INR",
  },
  _id: "68dbd29c5061c3314ea03923",
  image:
    "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  title: "title-awaited",
  description: "desc-awaited",
  __v: 0,
};

function formatPrice(amount, currency) {
  // If API returns amount in paise (common with INR), convert to rupees when appropriate.
  const value = amount > 1000 ? amount / 100 : amount;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(value);
  } catch (e) {
    return `${value} ${currency}`;
  }
}

const App = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products/get-item")
      .then((response) => {
        setProduct(response.data.product || sampleProduct);
      })
      .catch((err) => {
        // If the backend isn't available, fall back to the sample product
        console.warn(
          "Could not fetch product, using sample",
          err.message || err
        );
        setProduct(sampleProduct);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBuyNow = () => {
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="app-root">
      <div className="container">
        {loading ? (
          <div className="card skeleton">
            <div className="image-shimmer" />
            <div className="content">
              <div className="line short" />
              <div className="line medium" />
              <div className="line long" />
            </div>
          </div>
        ) : (
          <div className="card">
            <img
              className="product-image"
              src={product.image}
              alt={product.title}
            />
            <div className="product-info">
              <h2 className="title">{product.title}</h2>
              <p className="desc">{product.description}</p>

              <div className="price">
                {formatPrice(product.price.amount, product.price.currency)}
              </div>

              <div className="actions">
                <PaymentButton />
                <button
                  className="btn outline"
                  onClick={() => {
                    // lightweight feedback for Add to Cart
                    alert("Added to cart");
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && product && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Checkout</h3>
            <p>
              You're about to pay{" "}
              <strong>
                {formatPrice(product.price.amount, product.price.currency)}
              </strong>{" "}
              for
              <br />
              <em>{product.title}</em>
            </p>
            <div className="modal-actions">
              <button
                className="btn primary"
                onClick={() => {
                  // Simulate a payment flow for now
                  alert("Payment simulated — success!");
                  closeModal();
                }}
              >
                Proceed
              </button>
              <button className="btn outline" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
