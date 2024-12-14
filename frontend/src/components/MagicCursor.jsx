import React, { useEffect, useState } from "react";

const MagicCursor = () => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Rileva dispositivi mobili
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setCursor({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{
        top: cursor.y,
        left: cursor.x,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="h-4 w-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full shadow-lg animate-ping" />
    </div>
  );
};

export default MagicCursor;
