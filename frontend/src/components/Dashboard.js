// src/components/Dashboard.js
import React from 'react';
import Sidebar from './Sidebar';

export default function Dashboard({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra lateral */}
      <Sidebar />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {children ? (
          children
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
              Bem-vinda ao Dashboard
            </h1>
            <p className="text-gray-600">
              Selecione uma opção no menu lateral para começar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
