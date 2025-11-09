import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, updateUser, deleteUser } from "../../slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUserId) {
      dispatch(updateUser({ id: editingUserId, ...formData }));
      setEditingUserId(null);
    } else {
      dispatch(addUser(formData));
    }
    setFormData({ name: "", email: "", password: "", role: "customer" });
  };

  const handleEdit = (user) => { setFormData({ name: user.name, email: user.email, password: "", role: user.role }); setEditingUserId(user._id); };
  const handleDelete = (id) => { dispatch(deleteUser(id)); };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 rounded"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded"/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 rounded"/>
        <div className="flex items-center space-x-4">
          <label><input type="radio" name="role" value="customer" checked={formData.role==="customer"} onChange={handleChange}/> Customer</label>
          <label><input type="radio" name="role" value="admin" checked={formData.role==="admin"} onChange={handleChange}/> Admin</label>
        </div>
        <button type="submit" className="col-span-1 sm:col-span-2 bg-blue-600 text-white py-2 rounded">{editingUserId ? "Update User" : "Add User"}</button>
      </form>

      {/* Users List */}
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> :
      <table className="w-full border">
        <thead className="bg-gray-100"><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(user)} className="bg-yellow-500 px-2 py-1 rounded text-white">Edit</button>
                <button onClick={() => handleDelete(user._id)} className="bg-red-500 px-2 py-1 rounded text-white">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default UserManagement;
