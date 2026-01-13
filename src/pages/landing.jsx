import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AyuTraceLogo from '../components/AyuTraceLogo';
import LoginPage from './login';

// --- Custom Hook for Scroll Animations ---
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                const currentRef = ref.current;
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// --- Vegetable/Farm Images Component ---
const HeroImage = ({ className }) => (
    <div className={className}>
        <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop" 
            alt="Fresh Farm Produce" 
            className="rounded-2xl shadow-2xl object-cover w-full h-full"
        />
    </div>
);

const VegetableBasket = () => (
    <img 
        src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=400&fit=crop" 
        alt="Fresh Vegetables" 
        className="rounded-xl shadow-lg object-cover"
    />
);


// --- SVG Icons ---
const CheckIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
const LeafIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z" />
    </svg>
);
const BlockchainIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>
    </svg>
);
const GeoTagIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
    </svg>
);
const SmartContractIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);
const QrCodeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="14" y1="14" x2="14.01" y2="14"></line><line x1="17.5" y1="14" x2="17.51" y2="14"></line><line x1="14" y1="17.5" x2="14.01" y2="17.5"></line><line x1="17.5" y1="17.5" x2="17.51" y2="17.5"></line><line x1="21" y1="17.5" x2="21.01" y2="17.5"></line><line x1="17.5" y1="21" x2="17.51" y2="21"></line><line x1="21" y1="21" x2="21.01" y2="21"></line><line x1="14" y1="21" x2="14.01" y2="21"></line>
    </svg>
);
const ShieldCheckIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
);
const TrendingDownIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
        <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);



// --- Landing Page Component ---
const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [featuresRef, featuresVisible] = useOnScreen({ threshold: 0.2 });
    const [ctaRef, ctaVisible] = useOnScreen({ threshold: 0.3 });
    const [benefitsRef, benefitsVisible] = useOnScreen({ threshold: 0.2 });

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="bg-gradient-to-b from-amber-50 via-white to-stone-50 text-gray-800 font-sans">
            {/* Header - Clean Single Bar */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                <div className={`transition-all duration-500 ${isScrolled ? 'px-0 py-0' : 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3'}`}>
                    <div className={`flex justify-between items-center backdrop-blur-xl px-8 shadow-lg border transition-all duration-500 ${
                        isScrolled 
                            ? 'bg-white/60 py-3 rounded-none border-white/20' 
                            : 'bg-white/70 py-3.5 rounded-full border-white/40'
                    }`}>
                        {/* Logo */}
                        <AyuTraceLogo size="small" showText={false} onClick={() => navigate('/landing')} className="cursor-pointer" />
                        
                        {/* Navigation - Centered with proper spacing */}
                        <nav className="hidden lg:flex items-center gap-12">
                            <a href="#features" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-[18px]">Features</a>
                            <a href="#benefits" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-[18px]">Benefits</a>
                            <a href="#" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-[18px]">Product</a>
                            <a href="#footer" onClick={(e) => { e.preventDefault(); document.getElementById('footer').scrollIntoView({ behavior: 'smooth' }); }} className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-[18px] cursor-pointer">Contact</a>
                        </nav>
                        
                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleLoginClick} 
                                className="text-gray-700 font-semibold px-5 py-2 rounded-full hover:bg-emerald-50 transition-all duration-300 text-[18px]"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={handleSignupClick} 
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-[18px]"
                            >
                                Start for Free
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Unique Design with Video */}
            <main className="relative min-h-screen flex items-center overflow-hidden pt-12">
                {/* Background with Image/Video */}
                <div className="absolute inset-0 z-0">
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700"></div>
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop&q=80')`
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-800/50 to-transparent"></div>
                </div>
                
                {/* Content - Asymmetric Layout */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 py-20">
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* Left Content - Takes more space */}
                        <div className="lg:col-span-7 text-left">
                            {/* Animated badge */}
                            <div className={`inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full px-4 py-2 mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-emerald-100 text-sm font-medium">Blockchain-Powered Transparency</span>
                            </div>

                            <h1 className={`text-5xl lg:text-8xl font-black text-white mb-6 leading-[1.1] transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                Freshness You<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Can Trust.</span>
                            </h1>
                            
                            <p className={`text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                Leveraging blockchain to bring unparalleled transparency to perishable food supply chains. Reduce spoilage, prevent losses, from farm to fork.
                            </p>
                            
                            <div className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                <button
                                    onClick={() => navigate('/verify')}
                                    className="group bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center gap-2"
                                >
                                    <span>Scan a Product</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className={`grid grid-cols-3 gap-6 transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <p className="text-3xl font-bold text-white mb-1">10K+</p>
                                    <p className="text-sm text-gray-300">Products Tracked</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <p className="text-3xl font-bold text-white mb-1">50+</p>
                                    <p className="text-sm text-gray-300">Partners</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <p className="text-3xl font-bold text-white mb-1">99.9%</p>
                                    <p className="text-sm text-gray-300">Accurate</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Floating Cards */}
                        <div className="lg:col-span-5 relative h-[600px] hidden lg:block">
                            {/* Animated floating card 1 */}
                            <div className={`absolute top-0 right-0 bg-white rounded-3xl shadow-2xl p-6 w-64 transition-all duration-1000 delay-700 hover:scale-105 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} animate-float`}>
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                    <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">100% Verified</h3>
                                <p className="text-sm text-gray-600">Blockchain Tracked Supply Chain</p>
                            </div>

                            {/* Animated floating card 2 */}
                            <div className={`absolute top-40 -right-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-6 w-72 transition-all duration-1000 delay-900 hover:scale-105 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} animate-float-delayed`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <GeoTagIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Real-time Tracking</p>
                                        <p className="text-emerald-100 text-xs">GPS-enabled</p>
                                    </div>
                                </div>
                                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full w-3/4 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Animated floating card 3 */}
                            <div className={`absolute bottom-20 right-4 bg-white rounded-3xl shadow-2xl p-5 w-60 transition-all duration-1000 delay-1100 hover:scale-105 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} animate-float`}>
                                <img 
                                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop" 
                                    alt="Fresh Organic Produce" 
                                    className="rounded-2xl mb-3 w-full h-32 object-cover"
                                />
                                <p className="text-sm font-semibold text-gray-900">Organic Farm Harvest</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </main>

            {/* Features Section - Animated Icon Grid */}
            <section id="features" ref={featuresRef} className="py-20 bg-gradient-to-b from-white to-emerald-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Future of Fresh<br />Food Integrity</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hover over each feature to discover how we're revolutionizing food transparency
                        </p>
                    </div>

                    {/* Animated Icon Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 - Blockchain */}
                        <div className={`group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden min-h-[320px] border border-gray-100 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Icon State - Default */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50">
                                <div className="w-28 h-28 bg-teal-50 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500">
                                    <BlockchainIcon className="w-14 h-14 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center px-4">Immutable Blockchain</h3>
                            </div>
                            
                            {/* Expanded State - On Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700 p-8 flex flex-col justify-between opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 rounded-3xl">
                                <div>
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                                        <BlockchainIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Blockchain Ledger</h3>
                                    <p className="text-white/90 text-base leading-relaxed">
                                        Every transaction recorded on an immutable blockchain, guaranteeing transparency and preventing fraud.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Secure</span>
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Transparent</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Geo-Tagged */}
                        <div className={`group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden min-h-[320px] border border-gray-100 delay-100 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Icon State - Default */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50">
                                <div className="w-28 h-28 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500">
                                    <GeoTagIcon className="w-14 h-14 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center px-4">Geo-Tagged Tracking</h3>
                            </div>
                            
                            {/* Expanded State - On Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 p-8 flex flex-col justify-between opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 rounded-3xl">
                                <div>
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                                        <GeoTagIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">GPS Provenance</h3>
                                    <p className="text-white/90 text-base leading-relaxed">
                                        GPS-enabled tracking pinpoints exact origins, verifying authenticity and cold chain compliance.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Real-time</span>
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Smart Contract */}
                        <div className={`group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden min-h-[320px] border border-gray-100 delay-200 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Icon State - Default */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50">
                                <div className="w-28 h-28 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500">
                                    <SmartContractIcon className="w-14 h-14 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center px-4">Smart Automation</h3>
                            </div>
                            
                            {/* Expanded State - On Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 p-8 flex flex-col justify-between opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 rounded-3xl">
                                <div>
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                                        <SmartContractIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Fresh Results</h3>
                                    <p className="text-white/90 text-base leading-relaxed">
                                        Automated validation of temperature, humidity, and handling ensures food safety compliance.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Automated</span>
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Safe</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 4 - Post-Harvest */}
                        <div className={`group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden min-h-[320px] border border-gray-100 delay-300 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Icon State - Default */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 group-hover:opacity-0 group-hover:scale-50">
                                <div className="w-28 h-28 bg-purple-50 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-500">
                                    <TrendingDownIcon className="w-14 h-14 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center px-4">Reduce Losses</h3>
                            </div>
                            
                            {/* Expanded State - On Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 p-8 flex flex-col justify-between opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 rounded-3xl">
                                <div>
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                                        <TrendingDownIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Minimize Waste</h3>
                                    <p className="text-white/90 text-base leading-relaxed">
                                        Monitor spoilage risk in real-time and support farmers with transparent tracking.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Efficient</span>
                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">Smart</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className={`text-center mt-16 transition-all duration-700 delay-500 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <p className="text-gray-600 mb-6">Ready to transform your supply chain?</p>
                        <button
                            onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Explore Benefits
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits Section - New */}
            <section id="benefits" ref={benefitsRef} className="py-20 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 transition-all duration-700 ${benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transform Your Perishable<br />Supply Chain Today</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join leading food processors and distributors in the freshness revolution
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className={`bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${benefitsVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Instant Verification</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Scan any QR code to instantly verify product authenticity and view its complete cold chain journey.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className={`bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 delay-100 ${benefitsVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BlockchainIcon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Blockchain Security</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Immutable records ensure data integrity and prevent tampering throughout the entire supply chain.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className={`bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 delay-200 ${benefitsVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <LeafIcon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Ensure Post-Harvest Quality</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Monitor temperature and conditions in real-time to minimize spoilage and support sustainable farming.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Enhanced CTA Section */}
            <section id="get-started" ref={ctaRef} className="py-24 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop')] bg-cover bg-center"></div>
                </div>
                
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Start Your Journey<br />Towards a Healthier Future</h2>
                    <p className="text-xl md:text-2xl text-emerald-50 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of farmers, distributors, and consumers building a transparent food ecosystem.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <button
                            onClick={handleSignupClick}
                            className="bg-white text-emerald-600 font-bold px-10 py-5 rounded-full shadow-2xl hover:bg-amber-50 transition-all duration-300 transform hover:scale-110 text-lg"
                        >
                            Verify a Product
                        </button>
                        <button
                            onClick={() => navigate('/verify')}
                            className="bg-transparent border-2 border-white text-white font-bold px-10 py-5 rounded-full hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-110 text-lg"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Stats or Trust Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-4xl font-bold text-white mb-2">10,000+</p>
                            <p className="text-emerald-50">Products Tracked</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-4xl font-bold text-white mb-2">50+</p>
                            <p className="text-emerald-50">Partner Organizations</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-4xl font-bold text-white mb-2">99.9%</p>
                            <p className="text-emerald-50">Data Accuracy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="footer" className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="col-span-1">
                            <AyuTraceLogo size="medium" showText={false} />
                            <p className="text-gray-400 mt-4">Building a transparent future for fresh food supply chains.</p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Case Studies</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 All rights reserved. Building a transparent future for fresh food.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Sign Up Page Component ---
const SignUpPage = ({ navigateTo }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-stone-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-center mb-6">
                        <AyuTraceLogo size="medium" showText={false} onClick={() => navigateTo('landing')} />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Create Your Account</h2>
                    <p className="text-center text-gray-500 mb-8">Join the platform for transparent supply chain management.</p>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" placeholder="Enter your full name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition bg-white appearance-none">
                                <option value="" disabled selected>Select your role</option>
                                <option value="manufacturer">Manufacturer</option>
                                <option value="admin">Admin</option>
                                <option value="seller">Seller/Reseller</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105">
                            Create Account
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <button onClick={() => navigateTo('login')} className="font-semibold text-emerald-600 hover:underline">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'signup', 'login'

    const navigateTo = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    return (
        <div>
            {currentPage === 'landing' && <LandingPage navigateTo={navigateTo} />}
            {currentPage === 'signup' && <SignUpPage navigateTo={navigateTo} />}
            {currentPage === 'login' && <LoginPage navigateTo={navigateTo} />}
            {/* You can add a login page component here later */}
            {/* {currentPage === 'login' && <LoginPage navigateTo={navigateTo} />} */}
        </div>
    );
}

