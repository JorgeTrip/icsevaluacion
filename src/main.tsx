/**
 * @file main.tsx
 * @description Punto de entrada principal de la aplicación React.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const elementoRaiz = document.getElementById('root');

if (elementoRaiz) {
  ReactDOM.createRoot(elementoRaiz).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
