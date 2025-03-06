'use client';

import {
  AlertCircle,
  FileText,
  Folder,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsData {
  articles: number;
  users: number;
  comments: number;
  categories: number;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    articles: 0,
    users: 0,
    comments: 0,
    categories: 0,
  });

  useEffect(() => {
    // Simulasi loading data
    const fetchData = async () => {
      try {
        // Di sini nanti bisa ditambahkan fetch data dari API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStats({
          articles: 12,
          users: 45,
          comments: 89,
          categories: 6,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { title: 'Tambah Artikel', icon: Plus, color: 'bg-blue-500' },
    { title: 'Kelola Pengguna', icon: Users, color: 'bg-green-500' },
    { title: 'Pengaturan', icon: Settings, color: 'bg-purple-500' },
  ];

  const recentActivities = [
    {
      id: 1,
      message: 'Artikel baru ditambahkan: "Tips SEO 2024"',
      time: '2 jam yang lalu',
    },
    {
      id: 2,
      message: 'Komentar baru pada artikel "Web Development"',
      time: '3 jam yang lalu',
    },
    {
      id: 3,
      message: 'Pengguna baru terdaftar: John Doe',
      time: '5 jam yang lalu',
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-600">Selamat datang di panel admin</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className={`${action.color} p-3 rounded-lg mr-3`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">{action.title}</span>
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500">Total Artikel</h3>
                  <p className="text-2xl font-bold">{stats.articles}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500">Total Pengguna</h3>
                  <p className="text-2xl font-bold">{stats.users}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500">Total Komentar</h3>
                  <p className="text-2xl font-bold">{stats.comments}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500">Total Kategori</h3>
                  <p className="text-2xl font-bold">{stats.categories}</p>
                </div>
                <Folder className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Aktivitas Terbaru</h2>
          {loading ? (
            // Loading skeleton untuk aktivitas
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <p className="text-gray-600">{activity.message}</p>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>Belum ada aktivitas terbaru</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
