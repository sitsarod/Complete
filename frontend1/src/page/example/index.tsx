import React, { useEffect, useState } from 'react';
import { listReviews } from '../../service/index'; // <-- เปลี่ยน path ให้ถูกกับของคุณ

// ---- INTERFACE ทั้งหมด ----

export interface UserroleInterface {
  ID?: number;
  UserRole?: string;
}

export interface GenderInterface {
  ID?: number;
  Gender?: string;
}

export interface UsersInterface {
  ID?: number;
  Username?: string;
  Password?: string;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  PhoneNumber?: string;
  Profile?: string;
  UserRole?: UserroleInterface;
  Gender?: GenderInterface;
}

export interface ReviewInterface {
  ID?: number;
  Date?: string;
  Rating?: number;
  Comment?: string;
  User?: UsersInterface;
}

// ---- COMPONENT ----

const Index: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const data = await listReviews();
      console.log(data)
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (reviews.length === 0) {
    return <div>No reviews found.</div>;
  }

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.ID}>
            <div>
              <b>User:</b>{" "}
              {review.User
                ? `${review.User.FirstName ?? ""} ${review.User.LastName ?? ""}`
                : "Anonymous"}
            </div>
            <div>
              <b>Gender:</b> {review.User?.Gender?.Gender ?? "-"}
            </div>
            <div>
              <b>Role:</b> {review.User?.UserRole?.UserRole ?? "-"}
            </div>
            <div>
              <b>Date:</b> {review.Date}
            </div>
            <div>
              <b>Rating:</b> {review.Rating} ⭐
            </div>
            <div>
              <b>Comment:</b> {review.Comment}
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
