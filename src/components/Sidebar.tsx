// src/components/Sidebar.tsx
"use client";

import { FaHome, FaUser, FaProjectDiagram, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'About', path: '/about', icon: FaUser },
    { name: 'Projects', path: '/projects', icon: FaProjectDiagram },
    { name: 'Contact', path: '/contact', icon: FaEnvelope },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex flex-col items-start justify-center bg-trueBlack text-light p-8">
            <style jsx>{`
                .text-glow {
                    text-shadow: 0 0 8px rgba(34, 211, 238, 0.8);
                }
                .icon-glow {
                    filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.8));
                }
                .group:hover .text-glow-hover {
                    text-shadow: 0 0 8px rgba(34, 211, 238, 0.8);
                }
                .group:hover .icon-glow-hover {
                    filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.8));
                }
            `}</style>
            <nav className="w-full">
                <ul className="flex flex-col items-stretch space-y-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link 
                                  href={item.path} 
                                  className={`
                                    flex items-center space-x-4 px-4 py-3 rounded-xl 
                                    transition-all duration-300
                                    bg-gray-900/60 
                                    border-2 border-transparent 
                                    group 
                                    ${isActive 
                                      ? 'text-accent' 
                                      : 'text-gray-500 hover:border-accent/50 hover:shadow-cyan-glow'
                                    }`
                                  }
                                >
                                    <item.icon 
                                        className={`h-5 w-5 transition-all duration-300 group-hover:text-accent ${isActive ? 'text-accent icon-glow' : 'icon-glow-hover'}`}
                                    />
                                    <span 
                                        className={`transition-all duration-300 group-hover:text-accent ${isActive ? 'text-glow' : 'text-glow-hover'}`}
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
};

export default Sidebar;