// src/pages/Review.jsx
import React, { useState } from "react";
import axios from "axios";

const Review = () => {
  const [userId, setUserId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [itemId, setItemId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const reviewData = {
      user_id: userId,
      outlet_id: outletId,
      item_id: itemId,
      rating,
      comment,
    };

    axios.post("http://localhost:5000/review", reviewData)
      .then(response => {
        console.log(response.data);
        setSubmitted(true);
      })
      .catch(error => {
        console.error("Error submitting review:", error);
        alert("Failed to submit review.");
      });
  };

  return (
    <div className="review-page">
      <h1>Submit a Review</h1>
      {submitted ? (
        <p>Thank you for your review!</p>
      ) : (
        <form onSubmit={handleSubmitReview}>
          <label>
            User ID:
            <input 
              type="text" 
              value={userId} 
              onChange={e => setUserId(e.target.value)} 
              required 
            />
          </label>
          <br />
          <label>
            Outlet ID:
            <input 
              type="text" 
              value={outletId} 
              onChange={e => setOutletId(e.target.value)} 
              required 
            />
          </label>
          <br />
          <label>
            Item ID:
            <input 
              type="text" 
              value={itemId} 
              onChange={e => setItemId(e.target.value)} 
              required 
            />
          </label>
          <br />
          <label>
            Rating:
            <select 
              value={rating} 
              onChange={e => setRating(parseInt(e.target.value))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <br />
          <label>
            Comment:
            <textarea 
              value={comment} 
              onChange={e => setComment(e.target.value)}
            ></textarea>
          </label>
          <br />
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default Review;
