import React, { useState, useEffect } from 'react';
import { LeafIcon } from '../UI/Icons';

const HomeSection = () => {
    const [currentStat, setCurrentStat] = useState(0);
    const [animatedNumbers, setAnimatedNumbers] = useState({
        products: 0,
        scanned: 0,
        trusted: 0
    });

    const stats = [
        { label: 'Products Tracked', value: 1247, icon: '📦', color: 'emerald' },
        { label: 'QR Codes Scanned', value: 5832, icon: '🔍', color: 'blue' },
        { label: 'Trusted Partners', value: 89, icon: '🤝', color: 'purple' }
    ];

    const features = [
        {
            title: 'End-to-End Traceability',
            description: 'Track your products from raw materials to finished goods',
            icon: '🌱',
            gradient: 'from-green-400 to-emerald-600'
        },
        {
            title: 'Secure QR Technology',
            description: 'Advanced QR codes ensure product authenticity',
            icon: '🔒',
            gradient: 'from-blue-400 to-cyan-600'
        },
        {
            title: 'Real-time Analytics',
            description: 'Monitor your supply chain with live insights',
            icon: '📊',
            gradient: 'from-purple-400 to-pink-600'
        }
    ];

    useEffect(() => {
        // Animate numbers
        const animateNumber = (target, key) => {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                setAnimatedNumbers(prev => ({
                    ...prev,
                    [key]: Math.floor(current)
                }));
            }, 50);
        };

        const timer = setTimeout(() => {
            animateNumber(1247, 'products');
            animateNumber(5832, 'scanned');
            animateNumber(89, 'trusted');
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Cycle through stats
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
            <div className="text-center max-w-6xl mx-auto">
                {/* Animated Header */}
                <div className="relative mb-8 sm:mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-75 blur-3xl rounded-full transform animate-pulse"></div>
                    <div className="relative">
                        <LeafIcon className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-emerald-600 mx-auto mb-4 sm:mb-6 animate-bounce" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                            Welcome Manufacturer
                        </h2>
                        <div className="flex items-center justify-center space-x-2 text-base sm:text-lg text-gray-600 animate-slide-up">
                            <span>Building Trust Through</span>
                            <span className="font-semibold text-emerald-600 animate-pulse">Transparency</span>
                        </div>
                    </div>
                </div>

                {/* Animated Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                                currentStat === index ? 'ring-2 ring-emerald-400 scale-105' : ''
                            }`}
                            style={{
                                animationDelay: `${index * 200}ms`
                            }}
                        >
                            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{stat.icon}</div>
                            <div className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600 mb-1 sm:mb-2`}>
                                {index === 0 ? animatedNumbers.products : 
                                 index === 1 ? animatedNumbers.scanned : 
                                 animatedNumbers.trusted}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                            style={{
                                animationDelay: `${index * 300}ms`
                            }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="relative z-10">
                                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Action Hint */}
                <div className="mt-8 sm:mt-12 animate-bounce">
                    <div className="inline-flex items-center space-x-2 text-emerald-600 font-medium text-sm sm:text-base">
                        <span>Explore the dashboard</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.5s forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default HomeSection;