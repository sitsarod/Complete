import React, { useState } from 'react';
import {
  Modal,
  Input,
  Form,
  Upload,
  message,
  Button
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import {
  FaUtensils,
  FaStore,
  FaDollarSign,
  FaInfoCircle,
  FaListUl,
} from 'react-icons/fa';
import type { ProductInterface } from '../../../../interface/IProduct';
import { CreateProduct } from '../../../../service/index';

interface CreateFoodModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  newFood: ProductInterface;
  setNewFood: React.Dispatch<React.SetStateAction<ProductInterface>>;
}

const CreateFoodModal: React.FC<CreateFoodModalProps> = ({
  open,
  onClose,
  onSuccess,
  newFood,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);//@ts-ignore
  const [loading, setLoading] = useState(false);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src && file.originFileObj) {
      src = await getBase64(file.originFileObj);
    }
    window.open(src, '_blank');
  };

  const handleCreate = async (values: any) => {
    setLoading(true);
    let base64 = '';
    if (fileList.length > 0 && fileList[0].originFileObj) {
      base64 = await getBase64(fileList[0].originFileObj);
    } else {
      message.error('Please upload an image.');
      setLoading(false);
      return;
    }

    const payload: ProductInterface = {
      Name: values.Name,
      Brand: values.Brand,
      Price: parseFloat(values.Price),
      Description: values.Description,
      Picture: base64,
      CategoryID: parseInt(values.CategoryID),
    };

    const result = await CreateProduct(payload);
    setLoading(false);

    if (result) {
      message.success('Product created successfully!');
      setTimeout(() => {
        onClose();
        onSuccess();
        setFileList([]);
        form.resetFields();
      }, 0);
    } else {
      message.error('Failed to create product.');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<span className="text-yellow-600 font-bold text-lg">🍽️ Create New Menu</span>}
      footer={null}
      bodyStyle={{ padding: '24px' }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleCreate}
        initialValues={{
          Name: newFood.Name,
          Brand: newFood.Brand,
          Price: newFood.Price,
          Description: newFood.Description,
          CategoryID: newFood.CategoryID.toString(),
        }}
        className="text-sm"
      >
        {/* Upload */}
        <div className="flex justify-center mb-6">
          <div>
            <label className="block font-medium text-gray-700 text-center mt-2">Upload Food</label>
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Only image files are allowed');
                    return Upload.LIST_IGNORE;
                  }
                  setFileList([file]);
                  return false;
                }}
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </div>
        </div>

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Form.Item
            label={
              <span className="flex items-center gap-2">
                <FaUtensils className="text-yellow-500" /> Menu Name
              </span>
            }
            name="Name"
            rules={[{ required: true, message: 'Please enter the menu name' }]}
          >
            <Input placeholder="Menu Name" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-2">
                <FaStore className="text-yellow-500" /> Brand/Restaurant
              </span>
            }
            name="Brand"
            rules={[{ required: true, message: 'Please enter the brand or restaurant' }]}
          >
            <Input placeholder="Brand or Restaurant" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-2">
                <FaDollarSign className="text-yellow-500" /> Price
              </span>
            }
            name="Price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <Input type="number" placeholder="Price (THB)" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-2">
                <FaListUl className="text-yellow-500" /> Category
              </span>
            }
            name="CategoryID"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <select className="w-full border px-2 py-2 rounded text-gray-700">
              <option value="1">Thai</option>
              <option value="2">Italian</option>
              <option value="3">Japanese</option>
            </select>
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          label={
            <span className="flex items-center gap-2">
              <FaInfoCircle className="text-yellow-500" /> Description
            </span>
          }
          name="Description"
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea rows={3} placeholder="Menu description..." />
        </Form.Item>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={onClose}>Cancel</Button>
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-600 to-yellow-300 text-black font-semibold px-6 py-2 rounded shadow hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateFoodModal;
