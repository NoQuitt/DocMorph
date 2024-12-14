import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambiato rispetto a React 17
import './index.css';
import App from './App';

// Seleziona l'elemento root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Usa il nuovo metodo render
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
