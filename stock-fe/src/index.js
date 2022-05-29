import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode 嚴格模式
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);
