import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { FaTrash } from 'react-icons/fa';
import { DeleteProductByID } from '../../../../service'; 

interface DeleteFoodModalProps {
  open: boolean;
  onCancel: () => void;
  productID: number;
  foodName: string;
  onSuccess: () => void;
}

const DeleteFoodModal: React.FC<DeleteFoodModalProps> = ({
  open,
  onCancel,
  productID,
  foodName,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await DeleteProductByID(productID);
    setLoading(false);

    if (result) {
      message.success('ลบเมนูสำเร็จแล้ว');
      onSuccess(); // แจ้ง component แม่ให้รีโหลด/ปิด modal
    } else {
      message.error('เกิดข้อผิดพลาดในการลบเมนู');
    }
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered>
      <div className="text-center p-4">
        <FaTrash className="text-red-500 text-4xl mb-3 mx-auto" />
        <p className="text-lg font-semibold text-gray-800">
          คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?
        </p>
        <p className="text-sm text-gray-500">{foodName}</p>

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={handleDelete}
            className="bg-red-500"
          >
            ลบเมนู
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFoodModal;
