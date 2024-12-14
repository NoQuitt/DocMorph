import React from 'react';

const Footer = () => {
  return (
    <footer className="footer py-10 bg-gradient-to-r from-gray-800 to-black text-gray-400">
      <div className="container mx-auto text-center">
        <p className="mb-4">
          © {new Date().getFullYear()} DocMorph AI. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://github.com/NoQuitt/DocMorphAI/" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-gray-400 hover:text-white transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.486 2 12.019c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.531 2.341 1.089 2.912.833.092-.647.35-1.089.636-1.339-2.22-.253-4.555-1.113-4.555-4.945 0-1.092.39-1.984 1.029-2.682-.103-.253-.447-1.27.098-2.647 0 0 .841-.27 2.75 1.025a9.543 9.543 0 0 1 2.5-.337c.849.004 1.705.114 2.5.337 1.908-1.296 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.698 1.028 1.59 1.028 2.682 0 3.842-2.339 4.687-4.566 4.935.36.311.678.921.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .267.18.578.688.481C19.138 20.184 22 16.437 22 12.019 22 6.486 17.523 2 12 2Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
