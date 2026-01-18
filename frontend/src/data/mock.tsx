
import { FiHome } from 'react-icons/fi'; 
import {  AiFillSetting, AiOutlineCalendar } from 'react-icons/ai';
import { MdOutlineInventory2 } from 'react-icons/md';
import { BiCube } from 'react-icons/bi';
import { FaUsers, FaBoxOpen } from 'react-icons/fa';

export const links = [
  {
    title: 'หน้าแรก',
    links: [
      {
        name: 'Dashboard',
        label: 'หน้าเเรก',
        icon: <FiHome />,
      },
    ],
  },

  {
    title: 'จัดการ',
    links: [
      {
        name: 'Products',
        label: 'จัดการสินค้า',
        icon: <MdOutlineInventory2 />,
      },
      {
        name: 'Customers',
        label: 'ลูกค้า',
        icon: <FaUsers />,
      },
      {
        name: 'Example',
        label: 'ตัวอย่าง',
        icon: <AiFillSetting />,
      },
      {
        name: 'Warehouse',
        label: 'คลังสินค้า',
        icon: <FaBoxOpen />,
        subMenu: [
          {
            name: 'stock',
            label: 'สต๊อกสินค้า',
            icon: <BiCube />,
          },
        ],
      },
    ],
  },

  {
    title: 'งาน',
    links: [
      {
        name: 'Calendar',
        label: 'ปฏิทิน',
        icon: <AiOutlineCalendar />,
      },
    ],
  },

];
