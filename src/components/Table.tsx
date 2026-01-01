'use client';

import { motion } from 'framer-motion';
import { JSX, ReactNode } from 'react';

/* Generic props type */
type TableProps<T> = {
  headers: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
};

const Table = <T extends { id?: number | string }>({
  headers,
  data,
  renderRow,
}: TableProps<T>): JSX.Element => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {data.map((item, index) => (
            <motion.tr
              key={item.id ?? index}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {renderRow(item)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
