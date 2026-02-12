"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaCircleNotch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isInitializing } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isInitializing, router]);

    return (
        <AnimatePresence mode="wait">
            {isInitializing ? (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
                >
                    <div className="relative">
                        <FaCircleNotch className="w-12 h-12 text-blue-600 animate-spin" />
                        <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full scale-150 animate-pulse"></div>
                    </div>
                    <h2 className="mt-6 text-xl font-bold text-gray-800 tracking-tight">Checking Session</h2>
                    <p className="mt-2 text-gray-500 font-medium">Verifying your secure access...</p>
                </motion.div>
            ) : isAuthenticated ? (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                >
                    {children}
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default ProtectedRoute;
