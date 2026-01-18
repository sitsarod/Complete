import React from 'react';
import './FoodItem.css';

interface FoodItemProps {
  image: string;
  name: string;
  price: number;
  desc: string;
  id: number;
}

const FoodItem: React.FC<FoodItemProps> = ({ image, name, price, desc }) => {

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={image} alt={name} />
      </div>

      <div className='food-item-info'>
        <div className='food-item-name-rating'>
          <p>{name}</p>
        </div>
        <p className='food-item-desc'>{desc}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
