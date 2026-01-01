'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, Building, Activity } from 'lucide-react';
import { useStudents } from '@/context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Card from '@/components/Card';
import { JSX } from 'react';

/* Chart data type */
type ChartItem = {
  name: string;
  value: number;
};

/* Recent activity type */
type RecentActivity = {
  id: number;
  name: string;
  action: string;
  time: string;
};

const Dashboard = (): JSX.Element => {
  const { students, loading } = useStudents();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  /* Stats */
  const totalStudents = students.length;
  const activeStudents = students.filter(
    (s) => s.status === 'active'
  ).length;

  const departments = new Set(students.map((s) => s.department)).size;

  /* Department data */
  const departmentData = students.reduce<Record<string, number>>(
    (acc, student) => {
      acc[student.department] = (acc[student.department] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData: ChartItem[] = Object.entries(departmentData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS: string[] = [
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ];

  /* Recent activity */
  const recentActivity: RecentActivity[] = students
    .slice(0, 5)
    .map((student) => ({
      id: student.id,
      name: student.name,
      action: 'Profile updated',
      time: '2 hours ago',
    }));

  /* Average attendance */
  const avgAttendance =
    Math.round(
      students.reduce((sum, s) => sum + s.attendance, 0) / students.length
    ) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-10"
    >
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Students
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {totalStudents}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Students
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {activeStudents}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Building className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Departments
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {departments}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Attendance
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {avgAttendance}%
            </p>
          </div>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* BAR CHART */}
        <Card className="p-0">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Students by Department
            </h3>
          </div>
          <div className="h-72 sm:h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* PIE CHART */}
        <Card className="p-0">
          <div className="p-6 pb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Department Distribution
            </h3>
          </div>
          <div className="h-72 sm:h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>

        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {activity.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
              </div>

              <span className="text-sm text-gray-500 dark:text-gray-300">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
