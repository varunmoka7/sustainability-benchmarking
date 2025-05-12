import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-secondary-text-on-slate py-8 mt-12"> {/* Using neutral-dark from Tailwind config */}
      <div className="container mx-auto px-4 text-center text-sm">
        {/* Replace with your actual org logo path */}
        <Image 
          src="/images/org-logo-footer.svg" 
          alt="Organization Logo" 
          width={100} 
          height={30} 
          className="mx-auto mb-4" 
        />
        <p>&copy; {new Date().getFullYear()} Your Organization Name. All Rights Reserved.</p>
        <p className="mt-1">
          <Link href="/privacy-policy" className="hover:text-primary-text-on-slate transition-colors">
            Privacy Policy
          </Link>
          <span className="mx-2">|</span>
          <Link href="/terms-of-service" className="hover:text-primary-text-on-slate transition-colors">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
}
