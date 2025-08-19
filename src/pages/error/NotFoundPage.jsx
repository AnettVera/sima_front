import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404Page = () => {
  const navigate = useNavigate();

  const goToLanding = () => {
    navigate('/dashboard');  
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* Logo */}
        <div className="mx-auto w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
          <span className="text-white font-bold text-2xl">SIMA</span>
        </div>

        {/* Número 404 */}
        <h1 className="text-h1-mobile md:text-h1-desktop font-bold text-white mb-2" style={{ fontSize: '7rem' }}>
          404
        </h1>

        {/* Título principal */}
        <h2 className="font-bold text-white mb-4 text-2xl">
          Oops! Esta página no existe.
        </h2>

        {/* Subtítulo */}
        <p className="text-muted mb-6 text-lg">
          Pero no te preocupes, aún hay muchas cosas por descubrir.
        </p>

        <button
          onClick={goToLanding}
          className="w-full btn-primary px-6 py-3 rounded-md bg-white text-green-900 font-semibold text-lg shadow-md hover:bg-green-700 hover:text-white transition-all"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Error404Page;
