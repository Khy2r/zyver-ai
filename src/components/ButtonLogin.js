'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ButtonLogin() {
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
      className="btn btn-primary"
    >
      {session ? 'Dashboard' : 'Get Started'}
    </button>
  );
} 