'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ButtonSignIn({ className = '' }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      signOut();
    } else {
      router.push('/login');
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`btn btn-ghost ${className}`}
    >
      {session ? 'Sign Out' : 'Sign In'}
    </button>
  );
} 