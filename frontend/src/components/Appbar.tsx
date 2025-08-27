import React, { useState, useEffect } from "react"
import { Avatar } from "./BlogCard"
import { Link, useNavigate } from "react-router-dom"

export const Appbar = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setShowDropdown(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
        setShowDropdown(false);
    };

    const handleProfileClick = () => {
        navigate("/profile");
        setShowDropdown(false);
    };

    return (
        <div 
            className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="flex justify-between items-center px-6 lg:px-10 py-4 max-w-7xl mx-auto">
                <Link 
                    to={'/blogs'} 
                    className="font-extrabold text-2xl text-teal-700 hover:text-teal-800 transition-all duration-300 cursor-pointer hover:scale-105 transform"
                >
                    PENSCAPE
                </Link>

                <div className="flex items-center space-x-4">
                    <Link to={`/publish`}>
                        <button 
                            type="button" 
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full px-6 py-2.5 text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-lg hover:shadow-2xl"
                        >
                            ✍️ New Post
                        </button>
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 hover:shadow-md"
                        >
                            <Avatar size={"big"} name="harkirat" />
                            <svg 
                                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                                    showDropdown ? 'rotate-180' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gold/20 transition-all duration-300 flex items-center space-x-2 hover:pl-5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center space-x-2 hover:pl-5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}