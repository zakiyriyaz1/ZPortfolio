// src/components/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';

const navItems = [
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'About', path: '/about', icon: FaUser },
  { name: 'Projects', path: '/projects', icon: FaProjectDiagram },
  { name: 'Contact', path: '/contact', icon: FaEnvelope },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // FIX: Added relative z-20 to ensure it's on top of the particle background
    <aside className="relative z-20 w-60 flex-shrink-0 flex flex-col items-start justify-center bg-[#020403] text-gray-300 p-4">
      <nav className="w-full">
        <ul className="flex flex-col items-stretch space-y-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/5
                    ${
                      isActive
                        ? 'text-accent'
                        : 'text-gray-500 group-hover:text-white'
                    }`
                  }
                >
                  {/* FIX: Gave the arrow a fixed width to prevent layout shift on hover */}
                  <span 
                    className={`w-5 text-xl font-bold text-accent transition-opacity duration-300 opacity-0 group-hover:opacity-100 [text-shadow:0_0_8px_rgba(34,211,238,0.8)]`}
                  >
                    &lt;
                  </span>
                  <div
                    className={`transition-all duration-300
                      ${
                        isActive && '[filter:drop-shadow(0_0_5px_rgba(34,211,238,0.8))]'
                      }
                      group-hover:[filter:drop-shadow(0_0_5px_rgba(34,211,238,0.8))]`
                    }
                  >
                    <item.icon size={24} />
                  </div>
                  <span
                    className={`font-semibold transition-all duration-300
                      ${
                        isActive && '[text-shadow:0_0_8px_rgba(34,211,238,0.8)]'
                      }
                      group-hover:[text-shadow:0_0_8px_rgba(34,211,238,0.8)]`
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}