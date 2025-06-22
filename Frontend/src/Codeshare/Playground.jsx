import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function handleRun() {
    // Just a placeholder output
    setOutput(`Language: ${language}\n\nCode:\n${code}\n\nInput:\n${input}`);
  }

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: "10px", padding: "6px" }}
      >
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
      </select>

      <Editor
        height="300px"
        theme="hc-black"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
      />

      <textarea
        placeholder="Input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "80px",
          marginTop: "10px",
          padding: "8px",
          fontFamily: "monospace",
        }}
      />

      <button
        onClick={handleRun}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "1px solid white",
        }}
      >
        Run (Mock)
      </button>

      <pre
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px",
          marginTop: "10px",
          minHeight: "100px",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default CodeEditor;
