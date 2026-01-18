import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ListUsers } from "../../../service/index";
import type { UsersInterface } from "../../../interface/IUser";

const UserTablePage: React.FC = () => {
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await ListUsers();
      console.log("Fetched Users:", data); // Debugging line to check fetched data
      if (data) {
        const filtered = data.filter((user) => user.Role?.RoleName === "User");
        setUsers(filtered);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
      width: 70,
      responsive: ["sm" as const],
    },
    {
      title: "โปรไฟล์",
      key: "Profile",
      render: (_: any, record: UsersInterface) =>
        record.Profile ? (
          <Avatar src={record.Profile} alt="profile" size="large" />
        ) : (
          <Avatar size="large">{record.FirstName?.charAt(0)}</Avatar>
        ),
      width: 80,
    },
    {
      title: "ชื่อ",
      key: "fullName",
      render: (_: any, record: UsersInterface) =>
        `${record.FirstName || ""} ${record.LastName || ""}`,
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "Email",
      responsive: ["md" as const],
    },
    {
      title: "เบอร์โทร",
      key: "Phonenumber",
      render: (_: any, record: UsersInterface) => record.PhoneNumber || "-",
      responsive: ["md" as const],
    },
    {
      title: "สิทธิ์",
      key: "Role",
      render: (_: any, record: UsersInterface) => (
        <Tag color="blue">{record.Role?.RoleName || "ไม่มีสิทธิ์"}</Tag>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <p className="font-semibold text-lg text-white px-3 py-1 rounded-2xl bg-gradient-to-r from-yellow-700 to-yellow-500 dark:text-gray-200 w-fit mb-4">
        Customer Management
      </p>
      <div className="overflow-x-auto">
        <Table
          dataSource={users}
          columns={columns}
          loading={loading}
          rowKey="ID"
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          className="custom-yellow-header"
        />
      </div>
    </div>
  );
};

export default UserTablePage;
