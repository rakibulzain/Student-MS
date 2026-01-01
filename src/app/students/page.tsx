'use client';

import { useState, useMemo, JSX } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, SortAsc, Eye } from 'lucide-react';

import { useStudents } from '@/context/AppContext';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { Student } from '@/context/AppContext';

/* Sort keys type */
type SortKey = 'name' | 'cgpa' | 'semester';
type SortOrder = 'asc' | 'desc';

const Students = (): JSX.Element => {
  const { students, loading, deleteStudent } = useStudents();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  /* Filter + Sort */
  const filteredAndSortedStudents = useMemo<Student[]>(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterDepartment === '' ||
          student.department === filterDepartment)
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [students, searchTerm, filterDepartment, sortBy, sortOrder]);

  /* Departments */
  const departments: string[] = Array.from(
    new Set(students.map((s) => s.department))
  );

  /* Sort handler */
  const handleSort = (column: SortKey): void => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  const headers: string[] = [
    'Name',
    'Email',
    'Department',
    'Semester',
    'CGPA',
    'Status',
    'Actions',
  ];

  /* Table row renderer */
  const renderRow = (student: Student) => (
    <>
      <td className="px-6 py-4 min-w-[180px]">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={student.image}
            alt={student.name}
          />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {student.name}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {student.email}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {student.department}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {student.semester}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {student.cgpa}
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            student.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {student.status}
        </span>
      </td>

      <td className="px-6 py-4 text-sm font-medium flex gap-2">
        <Link href={`/students/${student.id}`}>
          <Button variant="secondary">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="danger"
          onClick={() => deleteStudent(student.id)}
        >
          Delete
        </Button>
      </td>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-10"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Students
        </h1>
        <Link href="/add-student">
          <Button>Add Student</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="col-span-1 md:col-span-2 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Department Filter */}
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-4 py-2 flex-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="name">Name</option>
            <option value="cgpa">CGPA</option>
            <option value="semester">Semester</option>
          </select>

          <Button variant="secondary" onClick={() => handleSort(sortBy)}>
            <SortAsc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow">
        <Table
          headers={headers}
          data={filteredAndSortedStudents}
          renderRow={renderRow}
        />
      </div>
    </motion.div>
  );
};

export default Students;
