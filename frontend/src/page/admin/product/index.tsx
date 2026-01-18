import React, { useEffect, useState } from 'react';
import FoodDisplay from './FoodDisplay/FoodDisplay';
import { ListProducts } from '../../../service';
import type { ProductInterface } from '../../../interface/IProduct';
import CreateFoodModal from './create/index';

const Food: React.FC = () => {//@ts-ignore
  const [category, setCategory] = useState<string>('All');
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [foodList, setFoodList] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newFood, setNewFood] = useState<ProductInterface>({
    Name: '',
    Brand: '',
    Price: 0,
    Description: '',
    Picture: '',
    CategoryID: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const products = await ListProducts();
    if (products) {
      setFoodList(products);
    }
    setLoading(false);
  };

  const addToCart = (id: number) => {
    setCartItems((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const handleSuccessCreate = () => {
    setNewFood({
      Name: '',
      Brand: '',
      Price: 0,
      Description: '',
      Picture: '',
      CategoryID: 1,
    });
    fetchProducts(); // reload after create
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-yellow-600">Top dishes near you</h2>
        <button
          className="bg-gradient-to-r from-yellow-600 to-yellow-300 text-white font-semibold px-4 py-2 rounded shadow hover:opacity-90 transition duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          + CREATE FOOD
        </button>
      </div>

      {loading ? (
        <div className="text-center">กำลังโหลดข้อมูล...</div>
      ) : (
        <FoodDisplay
          category={category}
          food_list={foodList}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          onReload={fetchProducts} // ✅ reload after update
        />
      )}

      <CreateFoodModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessCreate}
        newFood={newFood}
        setNewFood={setNewFood}
      />
    </div>
  );
};

export default Food;
