'use client';

import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
} from 'lucide-react';

import { useStudents } from '@/context/AppContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { JSX } from 'react';
import { Student } from "@/context/AppContext";

// /* Student type (keep same as your context) */
// interface Student {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   department: string;
//   semester: number;
//   cgpa: number;
//   attendance: number;
//   status: 'active' | 'inactive';
//   image?: string;
// }

const StudentProfile = (): JSX.Element => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { students } = useStudents();

  const student: Student | undefined = students.find(
    (s: Student) => s.id === Number(params.id)
  );

  if (!student) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-200">
        Student not found
      </div>
    );
  }

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/students')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Student Profile
        </h1>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            {student.image ? (
              <motion.img
                src={student.image}
                alt={student.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {student.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {student.department}
            </p>

            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                student.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {student.status}
            </span>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span>{student.department}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Academic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBox icon={Calendar} label="Semester" value={student.semester} />
              <InfoBox icon={Award} label="CGPA" value={student.cgpa} />
              <InfoBox
                icon={TrendingUp}
                label="Attendance"
                value={`${student.attendance}%`}
                full
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Performance Overview
            </h3>

            <ProgressBar
              label="CGPA Progress"
              value={(student.cgpa / 4) * 100}
              display={`${student.cgpa}/4.0`}
              color="bg-blue-500"
            />

            <ProgressBar
              label="Attendance Rate"
              value={student.attendance}
              display={`${student.attendance}%`}
              color={
                student.attendance >= 75
                  ? 'bg-green-500'
                  : student.attendance >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;

/* ---------- Small reusable components ---------- */

interface InfoBoxProps {
  icon: any;
  label: string;
  value: string | number;
  full?: boolean;
}

const InfoBox = ({ icon: Icon, label, value, full }: InfoBoxProps) => (
  <div
    className={`flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg ${
      full ? 'md:col-span-2' : ''
    }`}
  >
    <Icon className="h-8 w-8 text-blue-500 mr-4" />
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

interface ProgressBarProps {
  label: string;
  value: number;
  display: string;
  color: string;
}

const ProgressBar = ({ label, value, display, color }: ProgressBarProps) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{display}</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <motion.div
        className={`${color} h-2 rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  </div>
);
