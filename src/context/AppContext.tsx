"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Student = {
    id: number;
    name: string;
    roll?: string;
    phone: string;
    email: string
    semester: number;
    cgpa: number;
    attendance: number;
    department: string;
    status: "active" | "inactive";
    image?: string

};

type StudentsContextType = {
    students: Student[];
    loading: boolean;
    addStudent: (student: Omit<Student, 'id'>) => void;
    updateStudent: (id: number, student: Partial<Student>) => void;
    deleteStudent: (id: number) => void;
};

const StudentsContex = createContext<StudentsContextType | undefined>(undefined)

export const useStudents = (): StudentsContextType => {
    const context = useContext(StudentsContex);

    if (!context) {
        throw new Error("useStudents must be used within StudentsProvider");
    }

    return context;
}

type StudentsProviderProps = {
    children: ReactNode;
};

export const StudentsProvider = ({ children }: StudentsProviderProps
) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('students.json')
            .then(response => response.json())
            .then((data: Student[]) => {
                setStudents(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching students: ", error);
            });
    }, []);

    const addStudent = (newStudent: Omit<Student, "id">) => {
        const student: Student = {
            ...newStudent, id: Date.now(),
        };

        setStudents(prev => [...prev, student]);
    };

    const updateStudent = (id: number, updateStudent: Partial<Student>) => {
        setStudents(prev => prev.map(student => (student.id === id ? { ...student, ...updateStudent } : student)));
    };

    const deleteStudent = (id: number) => {
        setStudents(prev => prev.filter(student => (student.id !== id)));
    };


    return (
        <StudentsContex.Provider value={{ students, loading, addStudent, deleteStudent, updateStudent }}>
            {children}
        </StudentsContex.Provider>
    )
}