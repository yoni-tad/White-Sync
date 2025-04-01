import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Cursor from './Cursor'

export default function Board(props) {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  const { cursor, tool } = props;
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const isDrawingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  // socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      query: {token}
    });
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("canvasImage", (data) => {
        const image = new Image();
        image.src = data;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
        };
      });
    }
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let imgData = null;
    let textPosition = { x: 0, y: 0 };
    let isTyping = false;
    let currentText = "";

    if (ctx) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
    }

    const getPosition = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = canvas.getBoundingClientRect();
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };

    const startDrawing = (e) => {
      e.preventDefault();
      if (e.touches) console.log(e.touches[0]);

      const { x, y } = getPosition(e);
      isDrawingRef.current = true;
      startX.current = x;
      startY.current = y;
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    const draw = (e) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;

      const { x, y } = getPosition(e);
      if (!ctx) return;

      if (tool == "pen") {
        ctx.beginPath();
        ctx.moveTo(startX.current, startY.current);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX.current = x;
        startY.current = y;
      } else if (tool == "square") {
        ctx.putImageData(imgData, 0, 0);
        const width = x - startX.current;
        const height = y - startY.current;
        ctx.strokeRect(startX.current, startY.current, width, height);
      } else if (tool == "circle") {
        ctx.putImageData(imgData, 0, 0);
        const width = x - startX.current;
        const height = y - startY.current;
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        ctx.beginPath();
        ctx.arc(
          startX.current + width / 2,
          startY.current + height / 2,
          radius,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      } else if (tool == "erase") {
        ctx.clearRect(x - 5, y - 5, 25, 25);
      }
    };

    const endDraw = (e) => {
      e.preventDefault();
      const { x, y } = getPosition(e);
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      const ctx = canvas.getContext("2d");

      if (tool == "square") {
        const width = x - startX.current;
        const height = y - startY.current;
        ctx.strokeRect(startX.current, startY.current, width, height);
      } else if (tool == "circle") {
        const width = x - startX.current;
        const height = y - startY.current;
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

        ctx.beginPath();
        ctx.arc(
          startX.current + width / 2,
          startY.current + height / 2,
          radius,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }

      const dataUrl = canvas.toDataURL();
      if (socket) {
        socket.emit("canvasImage", dataUrl);
      }
    };

    // for text purpose
    const handleCanvasClick = (e) => {
      if (tool == "type") {
        const { x, y } = getPosition(e);
        textPosition = { x, y };
        isTyping = true;
        currentText = "";
      }
    };

    const handleKeyPress = (e) => {
      if (!isTyping) return;

      if (e.key === "enter") {
        isTyping = false;
      } else if (e.key === "Backspace") {
        currentText = currentText.slice(0, -1);
      } else {
        currentText += e.key;
      }

      ctx.fillText(currentText, textPosition.x, textPosition.y);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseout", endDraw);
    canvas.addEventListener("click", handleCanvasClick);
    window.addEventListener("keydown", handleKeyPress);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseout", endDraw);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);

      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [socket, tool]);

  // window responsive
  useEffect(() => {
    const handleWindowResize = () => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      const imgData = canvas.toDataURL();     


      setWindowSize([window.innerWidth, window.innerHeight]);

      setTimeout(() => {
        const newCtx = canvas.getContext('2d');
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
          newCtx.drawImage(img, 0, 0)
        } 
      }, 100);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="py-4">
      {tool == "erase" ? <Cursor /> : null}
      <canvas
        ref={canvasRef}
        width={windowSize[0] - 35}
        height={windowSize[1] - 170}
        style={{ backgroundColor: "white", cursor: cursor }}
      />
    </div>
  );
}
