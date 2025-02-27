'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ButtonLogin({ className = '' }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`btn btn-primary ${className}`}
    >
      {session ? 'Dashboard' : 'Get Started'}
    </button>
  );
} 