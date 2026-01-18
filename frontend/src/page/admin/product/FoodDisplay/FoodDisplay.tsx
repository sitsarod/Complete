import React, { useState } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import EditFoodModal from '../ีupdate/index';
import type { ProductInterface } from '../../../../interface/IProduct';

interface FoodDisplayProps {
  category: string;
  food_list: ProductInterface[];
  cartItems: { [key: number]: number };
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  onReload: () => void; // ✅ เพิ่ม
}

const FoodDisplay: React.FC<FoodDisplayProps> = ({
  category,
  food_list,
  cartItems,
  addToCart,
  removeFromCart,
  onReload,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<ProductInterface | null>(null);

  const handleEdit = (food: ProductInterface) => {
    setSelectedFood(food);
    setEditModalOpen(true);
  };

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-list">
        {food_list.map((item) => {
          const itemCategory = item.Category?.Category || 'Unknown';
          if (category === 'All' || category === itemCategory) {
            return (
              <FoodItem
                key={item.ID}
                id={item.ID!}
                image={item.Picture}
                name={item.Name}
                desc={item.Description}
                price={item.Price}
                cartCount={cartItems[item.ID!] || 0}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onEdit={() => handleEdit(item)}
                onSuccess={onReload} // ✅ reload หลังลบ
              />

            );
          }
          return null;
        })}
      </div>

      {selectedFood && (
        <EditFoodModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => {
            setEditModalOpen(false);
            onReload();
          }}
          food={selectedFood}
        />
      )}
    </div>
  );
};

export default FoodDisplay;
