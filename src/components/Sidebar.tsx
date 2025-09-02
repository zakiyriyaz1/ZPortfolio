// components/Sidebar.tsx (UPDATED with animation)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = {
  '/': { name: 'Home' },
  '/about': { name: 'About' },
  '/projects': { name: 'Projects' },
  '/contact': { name: 'Contact' },
};

export default function Sidebar() {
  let pathname = usePathname() || '/';

  return (
    <aside className="md:w-60 lg:w-72 p-8 border-r border-gray-800">
      <nav>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {Object.entries(navItems).map(([path, { name }]) => {
            const isActive = path === pathname;
            return (
              <motion.li
                key={path}
                className="mb-2"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <Link
                  href={path}
                  className={`relative block px-4 py-2 text-lg rounded-md transition-colors duration-200 ${
                    isActive ? 'text-cyan-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                  }`}
                >
                  {name}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-cyan-500/10 rounded-md -z-10"
                      layoutId="active-pill"
                      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </aside>
  );
}