import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaExclamationCircle,
    FaCircleNotch,
    FaArrowRight,
    FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

// Validation Schema
const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false
        }
    });

    useEffect(() => {
        if (isAuthenticated && !isSuccess) {
            router.push('/admin');
        }
    }, [isAuthenticated, router, isSuccess]);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await login(data.username, data.password, data.rememberMe);

            if (result.success) {
                setIsSuccess(true);
                // Wait 1 second to show success checkmark
                setTimeout(() => {
                    router.push('/admin');
                }, 1000);
            } else {
                setErrorMessage(result.message || 'Invalid username or password');
            }
        } catch {
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-4 font-sans selection:bg-blue-200">
            <Head>
                <title>Admin Login | Aluminum Windows</title>
            </Head>

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4 p-4 border border-blue-50"
                    >
                        {/* Abstract Aluminum Window Icon */}
                        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
                            <div className="border-2 border-blue-600 rounded-sm"></div>
                            <div className="border-2 border-blue-600 rounded-sm"></div>
                            <div className="border-2 border-blue-600 rounded-sm"></div>
                            <div className="border-2 border-blue-600 rounded-sm"></div>
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Login</h1>
                    <p className="text-blue-100 mt-2 font-medium opacity-90">Secure Access to Pricing Configuration</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 relative overflow-hidden ring-1 ring-black/5">
                    {/* Success Overlay */}
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                >
                                    <FaCheckCircle className="text-green-500 text-7xl mb-4" />
                                </motion.div>
                                <p className="text-xl font-bold text-gray-800">Login Successful</p>
                                <p className="text-gray-500">Redirecting to admin panel...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Error Message Toast-like */}
                        <AnimatePresence>
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <FaExclamationCircle className="text-red-500 shrink-0" />
                                    <p className="text-sm text-red-700 font-medium leading-tight">
                                        {errorMessage}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Fields */}
                        <div className="space-y-4">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    Username or Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <FaUser size={18} />
                                    </div>
                                    <input
                                        {...register('username')}
                                        type="text"
                                        placeholder="Enter your username"
                                        className={`w-full bg-gray-50 border-2 py-3.5 pl-12 pr-4 rounded-xl outline-none transition-all placeholder:text-gray-300
                                            ${errors.username ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-blue-500 focus:bg-white'}
                                        `}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.username.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                        <FaLock size={18} />
                                    </div>
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`w-full bg-gray-50 border-2 py-3.5 pl-12 pr-12 rounded-xl outline-none transition-all placeholder:text-gray-300
                                            ${errors.password ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:border-blue-500 focus:bg-white'}
                                        `}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Remeber Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        {...register('rememberMe')}
                                        type="checkbox"
                                        className="peer hidden"
                                    />
                                    <div className="w-5 h-5 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                        <FaCheckCircle className="text-white text-[10px] scale-0 peer-checked:scale-100 transition-transform" />
                                    </div>
                                </div>
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors font-medium">Remember me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <>
                                    <FaCircleNotch className="animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt className="transition-transform group-hover:scale-110" />
                                    <span>Sign In</span>
                                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4">
                                Need help with your access?
                            </a>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center text-blue-100/60 text-xs mt-8 font-medium">
                    &copy; 2026 Admin Portal • Aluminum Windows & Pricing Systems
                </p>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                input::placeholder {
                    color: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
