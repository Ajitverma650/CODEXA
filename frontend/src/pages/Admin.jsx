import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Edit, Trash2, Home, Video, BarChart2, Zap, LogOut, Users } from 'lucide-react';

function Admin() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Focused admin options
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-500/10',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'from-amber-500 to-yellow-400',
      bgColor: 'bg-amber-500/10',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'from-rose-500 to-pink-400',
      bgColor: 'bg-rose-500/10',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload tutorial videos for problems',
      icon: Video,
      color: 'from-indigo-500 to-blue-400',
      bgColor: 'bg-indigo-500/10',
      route: '/admin/video'
    }
  ];

  // Simplified stats
  const stats = [
    { title: "Total Problems", value: "142", icon: <BarChart2 size={20} /> },
    { title: "Videos", value: "86", icon: <Video size={20} /> },
    { title: "Active Users", value: "2,841", icon: <Users size={20} /> }
  ];

  // Recent activities
  const recentActivities = [
    { action: "Created new problem", user: "You", time: "2 min ago" },
    { action: "Updated sorting tutorial", time: "15 min ago" },
    { action: "Uploaded new video", time: "3 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
            <Zap size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800">Codexa Admin</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="flex items-center text-gray-600 hover:text-indigo-700 transition-colors font-medium">
            <Home size={18} className="mr-1" />
            Main Site
          </NavLink>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="font-semibold text-indigo-700">AJ</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen py-6 shadow-sm">
          <div className="px-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Admin Panel</h2>
            <ul className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
                { id: 'content', label: 'Content', icon: <Video size={18} /> },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                      activeMenu === item.id 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium border border-indigo-100' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-6 mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <NavLink to="/admin/create" className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 py-2 font-medium">
                <Plus size={16} />
                <span>New Problem</span>
              </NavLink>
              <NavLink to="/admin/video" className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 py-2 font-medium">
                <Video size={16} />
                <span>Upload Video</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage problems and tutorial videos</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Admin Options */}
            <div className="lg:w-2/3">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Management Tools</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <NavLink 
                      key={option.id}
                      to={option.route}
                      className="block"
                    >
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:border-indigo-300 h-full">
                        <div className={`h-2 bg-gradient-to-r ${option.color}`}></div>
                        <div className="p-5">
                          <div className={`${option.bgColor} p-3 rounded-lg inline-block mb-4`}>
                            <IconComponent size={24} className="text-gray-800" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{option.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                          <div className="text-indigo-600 font-medium text-sm flex items-center">
                            Access tool
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-indigo-400 to-purple-400 w-6 h-6 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {activity.user ? activity.user[0] : "S"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <div className="flex text-sm text-gray-500">
                          {activity.user && <span>{activity.user}</span>}
                          {activity.user && <span className="mx-2">•</span>}
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Video Upload Tips */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Video Upload Tips</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Keep videos under 10 minutes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Use HD resolution (1080p)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Include clear explanations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Add timestamps for key concepts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;