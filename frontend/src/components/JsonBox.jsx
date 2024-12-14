import React from 'react';

const JsonBox = ({ jsonContent, onCopy }) => {
    return (
        <div className="json-box relative">
            <button
                onClick={onCopy}
                className="absolute top-2 right-2 bg-blue-500 text-white rounded-md px-3 py-1 text-xs font-semibold shadow hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-blue-300"
            >
                Copia
            </button>
            <pre className="text-sm text-gray-800 p-2 rounded-lg">{JSON.stringify(jsonContent, null, 2)}</pre>
        </div>
    );
};

export default JsonBox;
