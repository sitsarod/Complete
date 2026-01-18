import React, { useEffect, useState } from 'react';
import { Modal, Input, Form, Upload, message, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import {
  FaUtensils,
  FaStore,
  FaDollarSign,
  FaInfoCircle,
  FaListUl,
} from 'react-icons/fa';
import { UpdateProductByID } from '../../../../service';
import type { ProductInterface } from '../../../../interface/IProduct';

interface EditFoodModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  food: ProductInterface;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({
  open,
  onClose,
  onSuccess,
  food,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);//@ts-ignore
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        Name: food.Name,
        Brand: food.Brand,
        Price: food.Price,
        Description: food.Description,
        CategoryID: food.CategoryID?.toString(),
      });

      if (food.Picture) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: food.Picture,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [open, food, form]);

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
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

  const handleUpdate = async (values: any) => {
    setLoading(true);

    let base64: string | undefined;

    if (fileList.length > 0 && fileList[0].originFileObj) {
      base64 = await getBase64(fileList[0].originFileObj);
    } else if (fileList.length > 0 && fileList[0].url && fileList[0].uid === '-1') {
      base64 = fileList[0].url;
    } else {
      base64 = undefined;
    }

    const payload: ProductInterface = {
      ...food,
      Name: values.Name,
      Brand: values.Brand,
      Price: parseFloat(values.Price),
      Description: values.Description,
      Picture: base64!,
      CategoryID: parseInt(values.CategoryID),
    };

    const result = await UpdateProductByID(food.ID!, payload);
    setLoading(false);
    console.log('Updated product:', result);
    if (result) {
      message.success('Product updated successfully!');
      setTimeout(() => {
        onClose(); 
        onSuccess();
      }, 0);
    } else {
      message.error('Failed to update product.');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<span className="text-yellow-600 font-bold text-lg">📝 Edit Menu</span>}
      footer={null}
      bodyStyle={{ padding: '24px' }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleUpdate}
        className="text-sm"
      >
        <div className="flex justify-center mb-6">
          <div>
            <label className="block font-medium text-gray-700 text-center mt-2">
              Upload Food
            </label>
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

export default EditFoodModal;
