import { useState, useEffect } from "react";
import { Button, Space } from "antd";
import EditUserModal from "../edit";
import type { UsersInterface } from "../../../../interface/IUser";
import { GetUserDataByUserID } from "../../../../service/index";

interface ProfileNavbarProps {
  onUpdateSuccess?: () => void; // เปลี่ยนชื่อ prop ให้ชัดเจน
}

export const ProfileNavbar = ({ onUpdateSuccess }: ProfileNavbarProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState<UsersInterface | null>(null);
  const [employeeid, setEmployeeid] = useState<number>(
    Number(localStorage.getItem("userid"))
  );

  const fetchUser = async () => {
    const res = await GetUserDataByUserID(employeeid);
    if (res) setUser(res);
  };

  useEffect(() => {
    setEmployeeid(Number(localStorage.getItem("userid")));
    fetchUser();
  }, []);

  const handleSaveSuccess = () => {
    if (onUpdateSuccess) onUpdateSuccess();
    fetchUser();
  };

  return (
    <>
      <div className="flex flex-col items-center [&_.ant-btn-link]:text-white hover:[&_.ant-btn-link]:text-[#037dca] md:flex-row md:justify-between">
        <Space>
          <Button size="small" type="link" onClick={() => setShowEdit(true)}>
            EDIT PROFILE
          </Button>
        </Space>
      </div>
      {user && (
        <EditUserModal
          show={showEdit}
          onClose={() => setShowEdit(false)}
          onSaveSuccess={handleSaveSuccess}
          initialData={user}
        />
      )}
    </>
  );
};
