import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 bg-black/50 border-t border-white/10 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-white/60 text-sm font-medium">
                        &copy; {new Date().getFullYear()} <span className="text-yellow-400 font-bold">raeiouL</span> corn services. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                        <span>Contact:</span>
                        <a href="mailto:raeioul@gmail.com" className="text-white/80 hover:text-yellow-400 transition-colors">
                            raeioul@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
