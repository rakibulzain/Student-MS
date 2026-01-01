'use client';

import { JSX, useState, ChangeEvent, FormEvent } from 'react';
import { motion, number } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Student, useStudents } from '@/context/AppContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

/* ---------------- Types ---------------- */

interface FormData {
    name: string;
    email: string;
    phone: string;
    department: string;
    semester: string;
    cgpa: string;
    attendance: string;
    image: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

/* ---------------- Component ---------------- */

const AddStudent = (): JSX.Element => {
    const router = useRouter();
    const { addStudent } = useStudents();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        department: '',
        semester: '',
        cgpa: '',
        attendance: '',
        image: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    /* ---------------- Handlers ---------------- */

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';

        const semester = Number(formData.semester);
        if (!semester) newErrors.semester = 'Semester is required';
        else if (semester < 1 || semester > 8)
            newErrors.semester = 'Semester must be 1–8';

        const cgpa = Number(formData.cgpa);
        if (formData.cgpa === '') newErrors.cgpa = 'CGPA is required';
        else if (cgpa < 0 || cgpa > 4)
            newErrors.cgpa = 'CGPA must be 0–4';

        const attendance = Number(formData.attendance);
        if (formData.attendance === '') newErrors.attendance = 'Attendance is required';
        else if (attendance < 0 || attendance > 100)
            newErrors.attendance = 'Attendance must be 0–100';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        const studentData: Omit<Student, "id"> = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            semester: Number(formData.semester),
            cgpa: Number(formData.cgpa),
            attendance: Number(formData.attendance),
            image: formData.image || undefined,
            status: "active" 

        }

        addStudent(studentData);

        router.push('/students');
    };

    /* ---------------- UI ---------------- */

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
        >
            <div className="w-full max-w-3xl px-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Add New Student
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        <Input label="Department" name="department" value={formData.department} onChange={handleChange} error={errors.department} />
                        <Input label="Semester" name="semester" type="number" min={1} max={8} value={formData.semester} onChange={handleChange} error={errors.semester} />
                        <Input label="CGPA" name="cgpa" type="number" step="0.01" min={0} max={4} value={formData.cgpa} onChange={handleChange} error={errors.cgpa} />
                        <Input label="Attendance (%)" name="attendance" type="number" min={0} max={100} value={formData.attendance} onChange={handleChange} error={errors.attendance} />
                        <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.push('/students')}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            Add Student
                        </Button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddStudent;
