import React, { useEffect, useState } from "react";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: "25px",
        height: "25px",
        border: "2px solid black",
        borderRadius: "50%",
        pointerEvents: "none", 
        transform: "translate(-50%, -50%)",
        zIndex: 9999, 
      }}
    />
  );
};

export default Cursor;
