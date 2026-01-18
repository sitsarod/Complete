import React, { useState, useEffect } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { ListProducts } from '../../../service'; // เปลี่ยน path ตามโปรเจกต์คุณ
import type { ProductInterface } from '../../../interface/IProduct';

interface FoodDisplayProps {
  category: string;
}

const FoodDisplay: React.FC<FoodDisplayProps> = ({ category }) => {
  const [foodList, setFoodList] = useState<ProductInterface[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ListProducts();
        if (response) {
          setFoodList(response);
        } else {
          console.error('No products found');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {foodList
          .filter(
            (item) =>
              category === 'All' ||
              category === item.Category?.Category
          )
          .map((item) => (
            <FoodItem
              key={item.ID}
              id={item.ID!}
              image={item.Picture}
              name={item.Name}
              desc={item.Description}
              price={item.Price}
            />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
