import React from 'react';

interface SectionProps {
  title: string;
  emoji?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, emoji, children, className = '' }) => {
  return (
    <section className={`w-full mb-6 ${className}`}>
      <div className="mb-3 flex items-center justify-center min-h-[44px]">
        <div className="h-[2px] flex-1 max-w-[120px] bg-[var(--accent)] opacity-70 mr-4" />
        <div className="flex items-center">
          {emoji && <span className="text-2xl mr-3">{emoji}</span>}
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        </div>
        <div className="h-[2px] flex-1 max-w-[120px] bg-[var(--accent)] opacity-70 ml-4" />
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};

export default Section;
