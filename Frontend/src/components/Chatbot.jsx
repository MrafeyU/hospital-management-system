
// // components/common/Chatbot.jsx
// import React, { useEffect, useRef, useState } from "react";
// import "../styles/Chatbot.css";

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hi! Ask me any medical or health-related question." }
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatRef = useRef(null);

//   const handleToggle = () => setIsOpen(!isOpen);

//   const handleSend = async (e) => {
//     if (e.key !== "Enter" || !input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5001/chatbot", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input })
//       });

//       const data = await res.json();
//       const botReply = data.response || "Sorry, I couldn't understand that.";

//       setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
//     } catch (err) {
//       console.error("❌ Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Server Error. Please try again later." }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <>
//       <button className="chat-toggle" onClick={handleToggle}>
//         {isOpen ? "✖" : "💬"}
//       </button>

//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chat-header">Chatbot</div>
//           <div className="chat-messages" ref={chatRef}>
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`chat-message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//             {loading && <div className="chat-message bot">Typing...</div>}
//           </div>
//           <input
//             type="text"
//             placeholder="Ask a question..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleSend}
//             disabled={loading}
//             className="chat-input"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default Chatbot;











import React, { useEffect, useRef, useState } from "react";
import "../styles/Chatbot.css";
import { getAuth } from "firebase/auth";

// 🔁 You should replace this with your actual role-fetching logic (context, props, or local storage)
const getUserRole = () => {
  return localStorage.getItem("role") || "guest";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m your assistant. Ask anything about your profile, health, or system features." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const auth = getAuth();
  const uid = auth.currentUser?.uid || "";
  const role = getUserRole();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = async (e) => {
    if (e.key !== "Enter" || !input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          uid,
          role
        })
      });

      const data = await res.json();
      const botReply = data.response || "Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("❌ Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server Error. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <button className="chat-toggle" onClick={handleToggle}>
        {isOpen ? "✖" : "💬"}
      </button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chat-header">
            Chatbot Assistant
            <span onClick={handleToggle} style={{ float: "right", cursor: "pointer" }}>✖</span>
          </div>
          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">Typing...</div>}
          </div>
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSend}
            className="chat-input"
            disabled={loading}
          />
        </div>
      )}
    </>
  );
};

export default Chatbot;
