import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingBasket } from 'react-icons/fa';
import { GiKnifeFork } from 'react-icons/gi';
import { message } from 'antd';

const Navbar: React.FC = () => {
  const [menu, setMenu] = useState<string>('home'); //@ts-ignore
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const getTotalCartAmount = (): number => {
    return cartItemCount;
  };

  const handleLogout = () => {
    message.success('ออกจากระบบ');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('Role');
    localStorage.clear();
    window.location.href = '/login'; // หรือใช้ useNavigate ก็ได้
  };

  return (
    <div className='navbar'>
      <Link to='/' className='navbar-logo'>
        <GiKnifeFork size={28} color='#facc15' />
      </Link>
      <ul className='navbar-menu'>
        <Link
          to='/'
          onClick={() => setMenu('home')}
          className={menu === 'home' ? 'active' : ''}
        >
          home
        </Link>
        <a
          href='#explore-menu'
          onClick={() => setMenu('menu')}
          className={menu === 'menu' ? 'active' : ''}
        >
          menu
        </a>
        <a
          href='#app-download'
          onClick={() => setMenu('mob-app')}
          className={menu === 'mob-app' ? 'active' : ''}
        >
          mobile app
        </a>
        <a
          href='#footer'
          onClick={() => setMenu('contact')}
          className={menu === 'contact' ? 'active' : ''}
        >
          contact us
        </a>
      </ul>
      <div className='navbar-right'>
        <FaSearch className='navbar-icon' size={28} />
        <div className='cart-icon-container'>
          <FaShoppingBasket className='navbar-icon' size={30} />
          <div className={getTotalCartAmount() > 0 ? 'dot' : ''}></div>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
