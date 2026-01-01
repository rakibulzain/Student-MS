'use client';

import { JSX, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  GraduationCap,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';

/* 1️⃣ Menu item type */
type MenuItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

const Sidebar = (): JSX.Element => {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  /* 2️⃣ Handle screen size (SSR safe) */
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  /* 3️⃣ Menu items */
  const menuItems: MenuItem[] = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/add-student', icon: UserPlus, label: 'Add Student' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* MOBILE NAV TOGGLE */}
      <div className="lg:hidden p-4 flex items-start justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold dark:text-white">StudentMS</h1>
        </div>
      </div>

      {/* BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <AnimatePresence>
        {(open || isDesktop) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="
              fixed lg:static top-0 left-0 h-full z-50
              w-64
              bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl
              shadow-xl border-r border-gray-300 dark:border-gray-700
            "
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                  StudentMS
                </h1>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu */}
            <nav className="mt-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center gap-3 px-6 py-3
                      transition-all duration-200
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      hover:text-blue-600 dark:hover:text-blue-400
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isActive
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400'
                        }`}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
