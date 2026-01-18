import React, { useState } from 'react';
import './FoodItem.css';
import { FaPen, FaTrash } from 'react-icons/fa';
import DeleteFoodModal from '../delete'; // ✅ import modal ลบ

interface FoodItemProps {
  id: number;
  image: string;
  name: string;
  price: number;
  desc: string;
  cartCount: number;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  onEdit?: () => void;
  onSuccess?: () => void; // ✅ สำหรับ reload หลังลบ
}

const FoodItem: React.FC<FoodItemProps> = ({
  id,
  image,
  name,
  price,
  desc,
  onEdit,
  onSuccess,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="food-item">
        <img className="food-item-image" src={image} alt={name} />
        <div className="food-item-info">
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{desc}</p>
          <p className="font-bold text-green-600">${price}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
            </div>
            <div className="flex gap-3 items-center">
              <FaPen
                onClick={onEdit}
                className="cursor-pointer text-blue-500"
                title="Edit"
              />
              <FaTrash
                onClick={() => setIsDeleteModalOpen(true)}
                className="cursor-pointer text-red-600"
                title="Delete"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ใช้งาน DeleteFoodModal ที่เชื่อมกับ Service จริง */}
      <DeleteFoodModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        productID={id}
        foodName={name}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          if (onSuccess) onSuccess(); // ✅ แจ้ง parent component ให้ reload
        }}
      />
    </>
  );
};

export default FoodItem;
