import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => toast.error('Failed to load users list'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Registered Users</h1>
        <p className="text-xs text-neutral-500 mt-1">Listing of authenticated store accounts and role authorizations</p>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-400">Loading user accounts...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-500">No user accounts found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt="" className="w-8 h-8 rounded-full object-cover border" />
                    <span className="font-semibold text-neutral-900">{u.name}</span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
