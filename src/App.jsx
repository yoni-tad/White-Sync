import { useEffect, useState } from "react";
import Board from "./components/Board";
import {
  Copy,
  Star,
  Square,
  Circle,
  Type,
  Eraser,
  Pen,
  Trash,
} from "lucide-react";
import toast, { toastConfig } from "react-simple-toasts";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/dark.css";
toastConfig({
  theme: "dark",
});
toast("🎉 Welcome to White Sync!", { position: "top-right" });

export default function App() {
  const [tools, setTools] = useState("pen");
  const [cursor, setCursor] = useState("crosshair");

  const generateToken = async () => {
    try {
      const response = await fetch("http://localhost:4040/generate-invite");
      const data = await response.json();

      if (data.token) {
        setToken(data.token);
      }
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  function toolHandler(tool) {
    switch (tool) {
      case "pen":
        setTools("pen");
        setCursor("crosshair");
        break;

      case "square":
        setTools("square");
        setCursor("crosshair");
        break;

      case "circle":
        setTools("circle");
        setCursor("crosshair");
        break;

      case "type":
        setTools("type");
        setCursor("text");
        break;

      case "erase":
        setTools("erase");
        setCursor("none");
        break;

      default:
        break;
    }
  }

  function copy() {
    var dummy = document.createElement("input"),
    text = window.location.origin + window.location.pathname + window.location.search;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast("✅ Share link copied");
  }

  return (
    <>
      <div className="h-screen flex flex-col p-4">
        {/* Header */}
        <div className="bg-pink-400 text-white px-6 py-2 rounded-lg flex justify-between items-center gap-6">
          <p className="flex-1 text-2xl font-bold">White Sync</p>
          <Copy className="cursor-pointer" onClick={copy} />
          <a href="">
            <Star fill="#ffe140" color="#ffe140" />
          </a>
        </div>

        {/* Draw */}
        <div className="flex-1">
          <Board cursor={cursor} tool={tools} />
        </div>

        {/* Tools */}
        <div className="sticky bg-pink-100 px-6 py-4 rounded-lg flex justify-around text-black">
          <Pen
            size={36}
            className={
              tools == "pen"
                ? "cursor-pointer p-2 bg-pink-300 rounded-full"
                : "cursor-pointer p-2 rounded-full"
            }
            onClick={() => toolHandler("pen")}
          />
          <Square
            size={36}
            className={
              tools == "square"
                ? "cursor-pointer p-2 bg-pink-300 rounded-full"
                : "cursor-pointer p-2 rounded-full"
            }
            onClick={() => toolHandler("square")}
          />
          <Circle
            size={36}
            className={
              tools == "circle"
                ? "cursor-pointer p-2 bg-pink-300 rounded-full"
                : "cursor-pointer p-2 rounded-full"
            }
            onClick={() => toolHandler("circle")}
          />
          <Type
            size={36}
            className={
              tools == "type"
                ? "cursor-pointer p-2 bg-pink-300 rounded-full"
                : "cursor-pointer p-2 rounded-full"
            }
            onClick={() => toolHandler("type")}
          />
          <Eraser
            size={36}
            className={
              tools == "erase"
                ? "cursor-pointer p-2 bg-pink-300 rounded-full"
                : "cursor-pointer p-2 rounded-full"
            }
            onClick={() => toolHandler("erase")}
          />
        </div>
      </div>
    </>
  );
}
