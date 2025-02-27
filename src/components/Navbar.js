'use client';

import ButtonLogin from './ButtonLogin';
import ButtonSignIn from './ButtonSignin';

export default function Navbar({ scrollToSection }) {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="text-3xl font-bold ml-4">ZyverAI</a>
      </div>
      <div className="navbar-center flex gap-4">
        <button 
          onClick={() => scrollToSection('pricing')}
          className="btn btn-ghost text-base font-medium hover:scale-105 transition-transform"
        >
          Pricing
        </button>
        <button 
          onClick={() => scrollToSection('faq')}
          className="btn btn-ghost text-base font-medium hover:scale-105 transition-transform"
        >
          FAQ
        </button>
      </div>
      <div className="navbar-end gap-4 mr-4">
        <div className="h-9">
          <ButtonSignIn className="btn-sm h-9" />
        </div>
        <div className="h-9">
          <ButtonLogin className="btn-sm h-9" />
        </div>
      </div>
    </div>
  );
}
