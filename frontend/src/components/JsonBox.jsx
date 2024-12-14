import React from "react";

const JsonBox = ({ jsonContent, onCopy }) => {
    return (
        <div className="relative border rounded-lg bg-gray-50 p-4 max-h-64 max-w-full overflow-auto">
            {/* Pulsante Copia sempre visibile */}
            <button
                className="sticky top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 z-10"
                onClick={onCopy}
            >
                Copia
            </button>
            {/* Contenuto JSON con scrolling */}
            <pre className="text-sm text-gray-800 mt-2">
                {JSON.stringify(jsonContent, null, 2)}
            </pre>
        </div>
    );
};

export default JsonBox;