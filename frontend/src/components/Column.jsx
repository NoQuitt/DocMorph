import React, { useRef } from 'react';

const Column = ({ title, enabled, onFileSelect, fileName }) => {
    const fileInputRef = useRef(null);

    const handlePlusClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            className={`relative border rounded-lg bg-gray-50 flex flex-col items-center justify-center ${
                !enabled && 'opacity-50'
            }`}
        >
            <div className="section-title text-2xl font-semibold text-gray-800 tracking-wide uppercase mb-4">
                {title}
            </div>
            <div className="content w-full h-full flex flex-col items-center justify-center">
                <div
                    className="mega-plus text-9xl text-blue-500 cursor-pointer hover:text-blue-600 transition-all duration-200 transform hover:scale-125"
                    style={{marginTop: '-1rem'}} // Sposta il simbolo più in alto
                    onClick={enabled ? handlePlusClick : undefined}
                >
                    +
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={onFileSelect}/>
                <p className="file-name">{fileName}</p>
            </div>
        </div>
    );
};

export default Column;
