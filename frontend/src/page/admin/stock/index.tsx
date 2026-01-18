import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ListProducts } from '../../../service';
import type { ProductInterface } from '../../../interface/IProduct';

const IndexPage: React.FC = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await ListProducts();
    if (res) {
      setProducts(res);
    } else {
      message.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
    }
    setLoading(false);
  };

  const columns: ColumnsType<ProductInterface> = [
    {
      title: 'รูปภาพ',
      dataIndex: 'Picture',
      key: 'Picture',
      width: 120,
      render: (picture: string) =>
        picture ? (
          <Image
            src={picture}
            alt="product"
            width={80}
            height={80}
            style={{ objectFit: 'cover', borderRadius: 8 }}
            fallback="https://via.placeholder.com/80"
          />
        ) : (
          <span>ไม่มีรูป</span>
        ),
    },
    {
      title: 'ชื่อเมนู',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'แบรนด์ / ร้าน',
      dataIndex: 'Brand',
      key: 'Brand',
    },
    {
      title: 'ราคา',
      dataIndex: 'Price',
      key: 'Price',
      render: (price?: number) =>
        typeof price === 'number' ? `${price.toFixed(2)} ฿` : '-',
    },
    {
      title: 'คำอธิบาย',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true,
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">🍽️ ตารางเมนูอาหาร</h1>
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="ID"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default IndexPage;
