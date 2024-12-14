  
  'use client';
  import React, { useState, useEffect } from 'react';
  interface User {
    id: number;
    name: string;
    password: string;
    email: string;
    role: string;
    created_at: string;
  }
  interface FormData {
    name: string;
    password: string;
    email: string;
    role: string;
  }
  
  const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<FormData>({
      name: '',
      password: '',
      email: '',
      role: '',
    });
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        alert('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const url = selectedUser 
          ? `/api/users/${selectedUser.id}`
          : '/api/users';
        
        const method = selectedUser ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) throw new Error('Failed to save user');
        
        await fetchUsers();
        setIsModalOpen(false);
        resetForm();
        alert(`User ${selectedUser ? 'updated' : 'created'} successfully`);
      } catch (error) {
        alert(`Failed to ${selectedUser ? 'update' : 'create'} user`);
      }
    };
  
    const handleDelete = async (userId: number) => {
      if (!confirm('Are you sure you want to delete this user?')) return;
      
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });
  
        if (!response.ok) throw new Error('Failed to delete user');
        
        await fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        alert('Failed to delete user');
      }
    };
  
    const resetForm = () => {
      setFormData({ name: '', password: '', email: '', role: '' });
      setSelectedUser(null);
    };
  
    const handleEdit = (user: User) => {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        password: user.password,
        email: user.email,
        role: user.role
      });
      setIsModalOpen(true);
    };
  
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management with supabase data</h1>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add User
            </button>
          </div>
  
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Password</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.password}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.created_at}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
  
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Password</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {selectedUser ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default UserManagement;