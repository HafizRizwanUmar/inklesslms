import React from 'react';

const InklessLogo = ({ className = "h-8 w-auto" }) => {
    return (
        <img 
            src="/Logo.png" 
            alt="Inkless Logo" 
            className={className} 
        />
    );
};

export const InklessTextInfo = () => (
    <div className="flex flex-col">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Inkless<span className="text-primary">.</span>
        </h1>
        <p className="text-xs text-secondary-foreground font-sans tracking-widest uppercase">
            Digital Classroom
        </p>
    </div>
);

export default InklessLogo;
