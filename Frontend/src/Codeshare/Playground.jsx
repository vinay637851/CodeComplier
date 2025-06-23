import React, { useState,useEffect } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
const socket = io("https://codecomplier-backend.onrender.com");

function Playground() {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");

  function handleCode(value){
    socket.emit("send_message", value);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setCode(data);
    }); 
  })

  return (
    <div className="bg-gray-800 h-screen flex flex-col text-white">
      <div className=" border-b border-gray-700 flex justify-center items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700  rounded px-4 py-2 focus:outline-none"
        >
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="flex-1">
        <Editor
          onChange={handleCode}
          height="100%"
          theme="vs-dark"
          value={code}
          language={language}
        />
      </div>
      <div className="mb-1 border-t border-gray-600 ">
        hello
      </div>
    </div>
  );
}

export default Playground;
