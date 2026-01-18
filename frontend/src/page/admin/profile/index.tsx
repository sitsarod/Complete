/* eslint-disable @typescript-eslint/no-explicit-any */
// 📄 src/pages/profile/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Upload,
  message,
  Button,
  Card,
  Modal,
  Spin,
  Tooltip,
  Row,
  Col,
  Empty,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  CreateProfile,
  ListProfile,
  UpdateProfileByID,
  DeleteProfileByID,
} from "../../../service/index";
import type { ProfileInterface } from "../../../interface/IProfile";

const gradientTitle = (
  <span
    className="font-semibold"
    style={{
      background: "linear-gradient(90deg, #facc15 0%, #fbbf24 50%, #f59e0b 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    สร้างโปรไฟล์ใหม่
  </span>
);

const gridTitle = <span className="font-semibold">โปรไฟล์ทั้งหมด</span>;

const Index: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // list
  const [profiles, setProfiles] = useState<ProfileInterface[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // edit
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ProfileInterface | null>(null);
  const [editFileList, setEditFileList] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // ===== helpers =====
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const ensureDataUrl = (s?: string) => {
    if (!s) return "";
    return s.startsWith("data:") ? s : `data:image/png;base64,${s}`;
  };

  const fetchProfiles = async () => {
    try {
      setListLoading(true);
      const data = await ListProfile();
      if (data) setProfiles(data);
    } catch (e) {
      console.error(e);
      message.error("โหลดรายการโปรไฟล์ไม่สำเร็จ");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // ===== create =====
  const onChange = ({ fileList: newFileList }: any) => setFileList(newFileList);

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src && file.originFileObj) src = await getBase64(file.originFileObj);
    window.open(src, "_blank");
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      let base64 = "";
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const f = fileList[0].originFileObj as File;
        if (f.size > 2 * 1024 * 1024) {
          message.error("ไฟล์ใหญ่เกินไป (สูงสุด 2MB)");
          setLoading(false);
          return;
        }
        base64 = await getBase64(f);
      } else {
        message.warning("กรุณาอัปโหลดรูปภาพโปรไฟล์");
        setLoading(false);
        return;
      }

      const payload: Partial<ProfileInterface> = { Profile: base64 };
      const result = await CreateProfile(payload as ProfileInterface);
      if (result) {
        message.success("สร้างโปรไฟล์สำเร็จ!");
        setFileList([]);
        form.resetFields();
        fetchProfiles();
      } else {
        message.error("ไม่สามารถสร้างโปรไฟล์ได้");
      }
    } catch (error) {
      console.error(error);
      message.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  // ===== update / edit =====
  const openEdit = (p: ProfileInterface) => {
    setEditing(p);
    setEditFileList([]);
    setEditOpen(true);
  };

  const onChangeEdit = ({ fileList: newFileList }: any) => setEditFileList(newFileList);
  const onPreviewEdit = async (file: any) => {
    let src = file.url;
    if (!src && file.originFileObj) src = await getBase64(file.originFileObj);
    window.open(src, "_blank");
  };

  const handleUpdate = async () => {
    if (!editing?.ID) {
      message.error("ไม่พบ ID โปรไฟล์");
      return;
    }
    try {
      setEditLoading(true);

      // หากไม่เลือกไฟล์ใหม่ ให้ใช้รูปเดิม
      let base64 = editing.Profile || "";
      if (editFileList.length > 0) {
        const f = editFileList[0];
        if (f.originFileObj) {
          const real = f.originFileObj as File;
          if (real.size > 2 * 1024 * 1024) {
            message.error("ไฟล์ใหญ่เกินไป (สูงสุด 2MB)");
            setEditLoading(false);
            return;
          }
          base64 = await getBase64(real);
        }
      }

      const payload: Partial<ProfileInterface> = { Profile: base64 };
      const res = await UpdateProfileByID(editing.ID, payload as ProfileInterface);
      if (res) {
        message.success("อัปเดตโปรไฟล์สำเร็จ!");
        setEditOpen(false);
        setEditing(null);
        setEditFileList([]);
        fetchProfiles();
      } else {
        message.error("ไม่สามารถอัปเดตโปรไฟล์ได้");
      }
    } catch (e) {
      console.error(e);
      message.error("เกิดข้อผิดพลาด");
    } finally {
      setEditLoading(false);
    }
  };

  // ===== delete (ลบทันที) =====
  const handleDeleteNow = async () => {
    if (!editing?.ID) return;
    const ok = await DeleteProfileByID(editing.ID);
    if (ok) {
      message.success("ลบโปรไฟล์สำเร็จ");
      setEditOpen(false);
      setEditing(null);
      setEditFileList([]);
      fetchProfiles();
    } else {
      message.error("ไม่สามารถลบโปรไฟล์ได้");
    }
  };

  const headerRight = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Tooltip title="รีเฟรชรายการ">
          <Button icon={<ReloadOutlined />} onClick={fetchProfiles} />
        </Tooltip>
      </div>
    ),
    []
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-2">
        <h2 className="text-2xl font-bold">👤 Profile Manager</h2>
        <p className="text-gray-500">อัปโหลด/ครอปภาพโปรไฟล์ และจัดการรายการทั้งหมด</p>
      </div>

      {/* Create Card */}
      <Card
        className="mb-6 shadow-sm rounded-2xl border border-gray-100"
        title={gradientTitle}
        headStyle={{ borderBottom: "none" }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Upload */}
            <div>
              <label className="block font-medium text-gray-700 text-center mb-2">
                Upload Profile
              </label>
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("ไฟล์ต้องเป็นรูปภาพเท่านั้น");
                      return Upload.LIST_IGNORE;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                      message.error("ไฟล์ใหญ่เกินไป (สูงสุด 2MB)");
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

            <div className="flex-1 w-full md:w-auto">
              <ul className="text-sm text-gray-600 space-y-1 mb-3">
                <li>• รองรับ JPG/PNG</li>
                <li>• ขนาดไฟล์สูงสุด 2MB</li>
                <li>• ครอปก่อนบันทึกได้</li>
              </ul>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-yellow-500 rounded-xl px-6 h-10"
              >
                Save Profile
              </Button>
            </div>
          </div>
        </Form>
      </Card>

      {/* List Card — ปรับให้ไอคอนแก้ไขอยู่ "ทับบนรูป" ไม่มีช่องว่าง */}
      <Card
        className="shadow-sm rounded-2xl border border-gray-100"
        title={gridTitle}
        extra={headerRight}
        headStyle={{ borderBottom: "none" }}
      >
        {listLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-10">
            <Empty description="ยังไม่มีโปรไฟล์" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {profiles.map((p) => (
              <Col key={p.ID} xs={12} sm={8} md={6} lg={6}>
                <Card
                  hoverable
                  className="rounded-xl overflow-hidden transition-all"
                  bodyStyle={{ padding: 0 }} // ❗ ไม่มี body -> ตัดช่องว่าง
                >
                  <div className="relative w-full aspect-square bg-gray-50">
                    {p.Profile ? (
                      <img
                        src={ensureDataUrl(p.Profile)}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* ปุ่มแก้ไขลอยบนภาพ มุมขวาล่าง */}
                    <Tooltip title="แก้ไข">
                      <Button
                        type="primary"
                        shape="circle"
                        className="bg-yellow-500 hover:bg-yellow-400"
                        icon={<EditOutlined />}
                        style={{
                          position: "absolute",
                          right: 12,
                          bottom: 12,
                          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                        }}
                        onClick={() => openEdit(p)}
                      />
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Edit Modal (กึ่งกลาง + วงกลม) */}
      <Modal
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
          setEditFileList([]);
        }}
        title={<span className="font-semibold">แก้ไขโปรไฟล์</span>}
        styles={{
          body: { paddingTop: 8, paddingBottom: 16 }, // กระชับระยะห่างใน modal
        }}
        footer={
          <div className="flex justify-between items-center gap-2">
            <Button danger onClick={handleDeleteNow}>
              ลบโปรไฟล์
            </Button>
            <div className="flex gap-2">
              <Button onClick={() => setEditOpen(false)}>ยกเลิก</Button>
              <Button className="bg-yellow-500" type="primary" loading={editLoading} onClick={handleUpdate}>
                บันทึก
              </Button>
            </div>
          </div>
        }
        destroyOnClose
        centered
      >
        <div className="py-2 flex flex-col items-center justify-center text-center">
          <label className="block font-medium text-gray-700 text-center mb-3">
            Upload Profile
          </label>

          {/* วงกลม (Avatar) คลิกเพื่ออัปโหลด + ครอปได้ */}
          <ImgCrop rotationSlider>
            <Upload
              accept="image/*"
              showUploadList={false}
              fileList={editFileList}
              onChange={onChangeEdit}
              onPreview={onPreviewEdit}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("ไฟล์ต้องเป็นรูปภาพเท่านั้น");
                  return Upload.LIST_IGNORE;
                }
                if (file.size > 2 * 1024 * 1024) {
                  message.error("ไฟล์ใหญ่เกินไป (สูงสุด 2MB)");
                  return Upload.LIST_IGNORE;
                }
                setEditFileList([file]);
                return false;
              }}
            >
              <div
                className="w-28 h-28 rounded-full overflow-hidden ring-1 ring-gray-200 shadow-sm bg-gray-50 cursor-pointer flex items-center justify-center"
                title="คลิกเพื่อเลือกภาพ"
              >
                {editFileList.length > 0 && editFileList[0].originFileObj ? (
                  <img
                    src={URL.createObjectURL(editFileList[0].originFileObj as File)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : editing?.Profile ? (
                  <img
                    src={ensureDataUrl(editing.Profile)}
                    alt="current"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <PlusOutlined />
                    <span className="text-xs mt-1">Upload</span>
                  </div>
                )}
              </div>
            </Upload>
          </ImgCrop>

          <div className="text-gray-500 text-sm mt-3">
            * เลือกรูปใหม่หรือใช้รูปเดิมก็ได้
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
