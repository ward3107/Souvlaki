import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './src/pwa';
import { initSmoothScroll } from './src/smoothScroll';

initSmoothScroll();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
