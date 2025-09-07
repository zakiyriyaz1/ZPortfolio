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
    // On small screens, it's a thin `w-20` bar. On large (`lg`) screens, it expands to `w-60`.
    <aside className="relative z-10 w-20 lg:w-60 flex-shrink-0 flex flex-col items-center lg:items-start justify-center bg-[#020403] text-gray-300 p-2 lg:p-4 transition-all duration-300 ease-in-out">
      <nav className="w-full">
        <ul className="flex flex-col items-stretch space-y-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  // On small screens, content is centered. On `lg`, it's aligned to the start.
                  className={`group flex items-center justify-center lg:justify-start space-x-0 lg:space-x-3 px-2 lg:px-4 py-3 rounded-xl transition-all duration-300 
                    ${
                      isActive
                        ? 'text-accent'
                        : 'text-gray-500 group-hover:text-white'
                    }`
                  }
                >
                  {/* The '<' arrow is hidden on small screens and appears on `lg` screens */}
                  <span 
                    className={`w-0 lg:w-5 text-xl font-bold text-accent transition-all duration-300 opacity-0 group-hover:opacity-100 [text-shadow:0_0_8px_rgba(34,211,238,0.8)] hidden lg:inline-block`}
                  >
                    &lt;
                  </span>
                  
                  <div
                    className={`transition-all duration-300
                      ${isActive && '[filter:drop-shadow(0_0_5px_rgba(34,211,238,0.8))]'}
                      group-hover:[filter:drop-shadow(0_0_5px_rgba(34,211,238,0.8))]`
                    }
                  >
                    <item.icon size={24} />
                  </div>
                  
                  {/* The text label is hidden on small screens and appears on `lg` screens */}
                  <span
                    className={`font-semibold transition-all duration-300 hidden lg:inline-block
                      ${isActive && '[text-shadow:0_0_8px_rgba(34,211,238,0.8)]'}
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

