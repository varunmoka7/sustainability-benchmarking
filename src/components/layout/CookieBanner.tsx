'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie_consent_given');
      if (!consent) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie_consent_given', 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cookie-banner-bg text-cookie-banner-text p-4 shadow-lg z-[100] flex flex-col sm:flex-row justify-between items-center">
      <p className="text-sm mb-3 sm:mb-0 sm:mr-4">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. 
        {/* Optionally, add a link to your privacy policy here */}
        {/* <Link href="/privacy-policy" className="underline hover:text-action-teal">Learn more</Link> */}
      </p>
      <button
        onClick={handleAccept}
        className="px-5 py-2 bg-action-teal text-white text-sm font-semibold rounded-md hover:bg-action-teal-hover transition-colors whitespace-nowrap"
        aria-label="Accept and close cookie banner"
      >
        Got it
      </button>
    </div>
  );
}
