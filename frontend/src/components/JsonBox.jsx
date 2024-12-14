import React from "react";

const JsonBox = ({ jsonContent, onCopy }) => {
    return (
        <div className="relative border rounded-lg bg-gray-50 p-4 max-h-64 overflow-auto" style={{ maxWidth: "600px" }}>
            {/* Pulsante Copia sempre visibile */}
            <button
                className="sticky top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 z-10"
                onClick={onCopy}
                style={{ position: "absolute", top: "8px", right: "8px" }}
            >
                Copia
            </button>
            {/* Contenuto JSON con scrolling */}
            <pre className="text-sm text-gray-800">
                {JSON.stringify(jsonContent, null, 2)}
            </pre>
        </div>
    );
};

export default JsonBox;
