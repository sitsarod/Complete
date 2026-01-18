import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import { ListProducts } from '../../../service/index';

interface ExploreMenuProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

interface MenuItem {
  menu_name: string;
  menu_image: string;
}

const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
  const [menu_list, setMenuList] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await ListProducts();

        if (!response) {
          console.error('Product response is null');
          return;
        }

        // เลือก 5 รายการแรก
        const topFiveProducts = response.slice(0, 5);

        const generatedMenu: MenuItem[] = topFiveProducts.map((product) => ({
          menu_name: product.Name,
          menu_image: product.Picture,
        }));

        setMenuList(generatedMenu);
      } catch (error) {
        console.error('Error loading menu:', error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our top products</h1>
      <p className='explore-menu-text'>
        Choose from our top 5 most popular dishes. Handpicked to elevate your dining experience.
      </p>
      <div className='explore-menu-list'>
        {menu_list.map((item, index) => (
          <div
            key={index}
            className='explore-menu-list-item'
            onClick={() =>
              setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))
            }
          >
            <img
              src={item.menu_image}
              alt={item.menu_name}
              className={category === item.menu_name ? 'active' : ''}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
