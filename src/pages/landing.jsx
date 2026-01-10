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
                // Use a variable to avoid issues with the ref being null during cleanup
                const currentRef = ref.current;
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// --- SVG Icons ---
const LeafIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
        <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
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

// --- Video Animation Component ---
const VideoAnimation = () => {
    const videoPath = "/PlantScanning.mp4"; // Path from public folder
    return (
        <div className="relative w-full max-w-xs sm:max-w-sm h-48 sm:h-64 md:h-80 flex items-center justify-center bg-black/10 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <video
                className="w-full h-full object-cover"
                src={videoPath}
                autoPlay
                loop
                muted
                playsInline
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

// --- Landing Page Component ---
const LandingPage = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const [featuresRef, featuresVisible] = useOnScreen({ threshold: 0.2 });
    const [ctaRef, ctaVisible] = useOnScreen({ threshold: 0.3 });

    const features = [
        { icon: <BlockchainIcon />, title: "Immutable Blockchain Ledger", description: "Every step, from farm to fork, is permanently recorded on a tamper-proof ledger, ensuring ultimate data integrity and freshness verification." },
        { icon: <GeoTagIcon />, title: "Geo-Tagged Provenance", description: "GPS-enabled data capture pinpoints the exact origin of every product, verifying its source and tracking cold chain compliance." },
        { icon: <SmartContractIcon />, title: "Smart Contract Automation", description: "Automated validation of temperature, humidity, and handling ensures food safety compliance at every stage of the supply chain." },
        { icon: <QrCodeIcon />, title: "Consumer Transparency Portal", description: "A simple QR scan on the final product reveals the entire journey, empowering consumers with verifiable proof of freshness." },
    ];

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="bg-stone-50 text-gray-800 font-sans">
            {/* Header */}
            <header className={`fixed top-0 left-0 w-full z-20 p-2 sm:p-4 md:p-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
                <div className="responsive-container flex justify-between items-center bg-white/50 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-sm border border-stone-200/80">
                    <AyuTraceLogo size="small" showText={false} onClick={() => navigate('landing')} />
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={handleLoginClick} className="text-gray-600 font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-emerald-100 transition-colors text-sm sm:text-base">
                            Login
                        </button>
                        <button onClick={handleSignupClick} className="bg-emerald-600 text-white font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-stone-100"></div>
                <div className="absolute top-0 -left-1/3 w-2/3 h-2/3 bg-emerald-200/50 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 -right-1/3 w-2/3 h-2/3 bg-green-200/50 rounded-full filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
                <div className="relative responsive-container z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className={`responsive-text-3xl lg:text-6xl xl:text-7xl font-extrabold text-gray-800 mb-4 leading-tight transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                            Freshness You Can Trust.
                        </h1>
                        <p className={`responsive-text-base md:text-xl max-w-xl mx-auto lg:mx-0 text-gray-600 mb-6 sm:mb-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                            Leveraging blockchain to bring unparalleled transparency to perishable food supply chains. Reduce spoilage, prevent losses, from farm to fork.
                        </p>
                        <div className={`flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-4 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                            <button
                                onClick={() => navigate('/verify')}
                                className="w-full sm:w-auto bg-emerald-600 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                            >
                                Scan a Product
                            </button>
                            <button
                                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                className="w-full sm:w-auto bg-white text-emerald-600 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-xl hover:bg-stone-100 transition-all duration-300 transform hover:scale-105 border border-emerald-200 text-sm sm:text-base"
                            >
                                Explore the Tech
                            </button>
                        </div>
                    </div>
                    <div className={`flex justify-center items-center mt-8 lg:mt-0 transition-opacity duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <VideoAnimation />
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" ref={featuresRef} className="section-responsive bg-white">
                <div className="responsive-container">
                    <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="responsive-text-2xl md:text-4xl font-bold mb-3">The Future of Fresh Food Integrity</h2>
                        <p className="responsive-text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Our platform provides a single source of truth, creating a transparent ecosystem for farmers, food processors, and consumers.
                        </p>
                    </div>
                    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-12 sm:mt-16 transition-all duration-700 ${featuresVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex flex-col gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={feature.title}
                                    onMouseEnter={() => setActiveFeature(index)}
                                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 border-2 ${activeFeature === index ? 'bg-emerald-50 border-emerald-300 shadow-lg scale-105' : 'bg-white border-transparent hover:border-gray-200 hover:shadow-md'}`}
                                >
                                    <h3 className="responsive-text-lg font-bold text-gray-800">{feature.title}</h3>
                                    <p className={`text-gray-600 transition-all duration-300 responsive-text-sm ${activeFeature === index ? 'mt-2 opacity-100' : 'h-0 opacity-0 lg:opacity-100 lg:h-auto lg:mt-2'}`}>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[350px] lg:sticky lg:top-24">
                            <div className="bg-stone-100 rounded-xl sm:rounded-2xl w-full h-full flex items-center justify-center p-6 sm:p-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={`${feature.title}-details`}
                                        className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center text-center p-6 sm:p-8 ${activeFeature === index ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <div className="mb-4 sm:mb-6 bg-emerald-100 p-4 sm:p-5 rounded-full">
                                            {React.cloneElement(feature.icon, { className: "h-8 w-8 sm:h-12 sm:w-12 text-emerald-500" })}
                                        </div>
                                        <h3 className="responsive-text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">{feature.title}</h3>
                                        <p className="text-gray-600 max-w-sm responsive-text-sm">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section id="get-started" ref={ctaRef} className="bg-gradient-to-br from-emerald-50 via-green-50 to-stone-100 section-responsive">
                <div className={`responsive-container text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="responsive-text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Transform Your Perishable Supply Chain Today</h2>
                        <p className="responsive-text-base md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join the revolution in food freshness verification. Experience complete cold chain transparency from farm to fork with our cutting-edge blockchain technology.
                        </p>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
                            <button
                                onClick={handleSignupClick}
                                className="w-full sm:w-auto bg-emerald-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:bg-emerald-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
                            >
                                Start Your Journey
                            </button>
                            <button
                                onClick={() => navigate('/verify')}
                                className="w-full sm:w-auto bg-white text-emerald-600 font-bold px-8 py-4 rounded-full border-2 border-emerald-600 shadow-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 text-lg"
                            >
                                Verify a Product
                            </button>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100 transform hover:scale-105 transition-all duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <QrCodeIcon className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Verification</h3>
                                <p className="text-gray-600 text-sm">Scan any QR code to instantly access the complete product journey and authenticity proof.</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100 transform hover:scale-105 transition-all duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BlockchainIcon className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Blockchain Security</h3>
                                <p className="text-gray-600 text-sm">Immutable records ensure data integrity and prevent tampering throughout the supply chain.</p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100 transform hover:scale-105 transition-all duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LeafIcon className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduce Post-Harvest Losses</h3>
                                <p className="text-gray-600 text-sm">Monitor spoilage risk in real-time and support local farmers with transparent cold chain tracking.</p>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-emerald-200">
                            <p className="text-gray-600 text-sm lg:text-base mb-4">Trusted by leading food processors and distributors</p>
                            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                                <div className="text-gray-400 font-semibold">Food Processor Partner</div>
                                <div className="text-gray-400 font-semibold">Quality Inspected</div>
                                <div className="text-gray-400 font-semibold">Cold Chain Verified</div>
                                <div className="text-gray-400 font-semibold">Consumer Trusted</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 FreshTrace. Building a transparent future for fresh food.</p>
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

