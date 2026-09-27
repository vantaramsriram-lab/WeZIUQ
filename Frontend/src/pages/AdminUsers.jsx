import React from 'react'
import api from '../../services/api.js';
import { LuUsersRound } from "react-icons/lu";
import { useEffect } from 'react';
import { useState } from 'react'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("")
  useEffect(() => {
    fetchUsers();
  }, [search])
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", { params: {search} })
      console.log(res.data)
      setUsers(res.data)
    } catch (error) {
      console.log("Unable to fetch Users")
    } finally {
      setLoading(false)
    }
  }
  // console.log("Users", users)
  const filteredUsers = users.filter(u => u.role !== 'admin');
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold mb-1">Users</h2>
          <p className="text-gray-700 text-base">Manage registered users</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5  border border-[#172936] rounded-lg text-black placeholder-[#8295a1] focus:outline-none hover:border-[var(--primary)] focus:bg-gray-100 transition-all text-sm"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>) : filteredUsers.length === 0 ? (
          <div className=" bg-gray-100 border border-gray-500 rounded-2xl p-12  flex flex-col justify-center items-center gap-10">
            <span className="text-4xl"><LuUsersRound size={40} /></span>
            <p className="text-base">No users found</p>
          </div>
        ) : (
        <div className="border border-[#172936] rounded-2xl overflow-hidden">
          <div className='hidden md:block overflow-x-auto rounded-lg border border-black'>
            <table className='w-full'>
              <thead>
                <tr className="border-b border-[#172936]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Registered</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-black hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-gray-900 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-medium ${user.quizCompleted
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {user.quizCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden block divide-y divide-[#172936]/50">
            {filteredUsers.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-gray-900 font-medium">{user.name}</div>
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-xl text-xs font-medium ${user.quizCompleted
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}>
                    {user.quizCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Registered: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
