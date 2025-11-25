import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Shield, ArrowRight, GraduationCap } from 'lucide-react';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero Section with Image */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
                <div className="relative h-[500px] overflow-hidden">
                    <img
                        src="/hero.png"
                        alt="Students studying"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>

                <div className="absolute inset-0 z-20 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl">
                            <div className="flex items-center space-x-4 mb-6">
                                <img
                                    src="/logo.png"
                                    alt="IGDTUW Logo"
                                    className="w-20 h-20 rounded-full shadow-lg"
                                />
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                                        IGDTUW EDUHub
                                    </h1>
                                    <p className="text-lg text-gray-300 mt-1">
                                        Indira Gandhi Delhi Technical University for Women
                                    </p>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Access comprehensive study materials, lecture notes, and resources for all engineering branches.
                                Your one-stop platform for academic excellence.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="group px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-primary/25"
                                >
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/auth')}
                                    className="px-8 py-4 glass glass-hover text-white font-semibold rounded-xl transition-all duration-300 border border-white/20"
                                >
                                    Student Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Welcome to IGDTUW EDUHub</h2>
                    <p className="text-gray-400 text-lg">
                        A centralized platform designed to help students access educational resources,
                        study materials, and placement preparation guides across all engineering disciplines.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {/* Feature 1 */}
                    <div className="glass p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-xl mb-4 group-hover:bg-primary/30 transition-colors">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Comprehensive Resources</h3>
                        <p className="text-gray-400">
                            Semester-wise study materials, lecture notes, previous year papers, and reference books for all subjects.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-xl mb-4 group-hover:bg-secondary/30 transition-colors">
                            <Users className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Placement Support</h3>
                        <p className="text-gray-400">
                            Company-specific preparation guides, interview experiences, and career roadmaps from seniors.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-xl mb-4 group-hover:bg-accent/30 transition-colors">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Organized & Secure</h3>
                        <p className="text-gray-400">
                            Well-structured content with role-based access, ensuring quality and relevance of all materials.
                        </p>
                    </div>
                </div>

                {/* Library Image Section */}
                <div className="glass p-8 rounded-2xl max-w-5xl mx-auto mb-16">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Extensive Digital Library</h3>
                            <p className="text-gray-400 mb-4">
                                Our platform hosts a vast collection of educational resources including:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center space-x-2">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    <span>Lecture notes and presentations</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    <span>Previous year question papers</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    <span>Reference books and study guides</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                    <span>Lab manuals and project reports</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src="/library.png"
                                alt="Digital Library"
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="glass p-12 rounded-2xl text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Ready to Access Resources?</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Join thousands of IGDTUW students already using our platform to excel in their studies.
                    </p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
                    >
                        Create Account Now
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© 2025 IGDTUW EDUHub. All rights reserved.</p>
                    <p className="text-sm mt-2">Indira Gandhi Delhi Technical University for Women</p>
                </div>
            </div>
        </div>
    );
}
