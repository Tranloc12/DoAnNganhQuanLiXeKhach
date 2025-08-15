import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import {
  Button, Table, Modal, Input, Select, Form, message, Popconfirm
} from "antd";

const { Option } = Select;

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await authApis().get(endpoints.staff); // bạn có thể load toàn bộ users nếu muốn
      setUsers(res.data);
    } catch (err) {
      message.error("Lỗi khi tải người dùng!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFinish = async (values) => {
    try {
      if (editingUser) {
        await authApis().put(endpoints.userDetail(editingUser.id), values);
        message.success("Cập nhật thành công!");
      } else {
        await authApis().post(endpoints.users, values);
        message.success("Thêm mới thành công!");
      }
      form.resetFields();
      setOpenModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      message.error(err?.response?.data?.error || "Thao tác thất bại!");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpenModal(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      dob: user.dob?.slice(0, 10),
      userRole: user.userRole,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await authApis().delete(endpoints.userDetail(id));
      message.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (err) {
      message.error("Xóa thất bại!");
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý người dùng</h2>
        <Button type="primary" onClick={() => { setOpenModal(true); form.resetFields(); setEditingUser(null); }}>
          Thêm người dùng
        </Button>
      </div>

      <Table
        dataSource={users}
        rowKey="id"
        bordered
        columns={[
          { title: "Tên đăng nhập", dataIndex: "username" },
          { title: "Email", dataIndex: "email" },
          { title: "Ngày sinh", dataIndex: "dob", render: d => d?.slice(0, 10) },
          { title: "Quyền", dataIndex: "userRole" },
          {
            title: "Thao tác",
            render: (_, record) => (
              <div className="space-x-2">
                <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                  <Button type="link" danger>Xóa</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        onOk={() => form.submit()}
        okText={editingUser ? "Cập nhật" : "Thêm"}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item name="userRole" label="Quyền" rules={[{ required: true }]}>
            <Select>
              <Option value="ROLE_STAFF">Nhân viên</Option>
              <Option value="ROLE_DRIVER">Tài xế</Option>
              <Option value="ROLE_PASSENGER">Hành khách</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManage;
