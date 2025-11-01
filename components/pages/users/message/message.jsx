// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// // ⚙️ Socket connection (backend server ka URL daalein)
// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const MessageBoard = ({ senderId, ladderId }) => {
//   const [messages, setMessages] = useState([]); // all group messages
//   const [message, setMessage] = useState("");
//   const [senderName, setSenderName] = useState("Unknown");
//   const chatEndRef = useRef(null);

//   // 🟢 Fetch sender name from backend using senderId
//   useEffect(() => {
//     if (!senderId) return;
//     axios
//       .get(`http://localhost:3000/player/${senderId}`)
//       .then((res) => setSenderName(res.data?.name || "Unknown"))
//       .catch(() => setSenderName("Unknown"));
//   }, [senderId]);

//   // 🟢 Join ladder-specific room
//   useEffect(() => {
//     if (ladderId) {
//       socket.emit("join_room", ladderId);
//     }
//   }, [ladderId]);

//   // 🟢 Listen for incoming group messages
//   useEffect(() => {
//     socket.on("group_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("group_message");
//   }, []);

//   // 🟢 Fetch old messages (from DB)
//   useEffect(() => {
//     if (!ladderId) return;
//     axios
//       .get(`http://localhost:3000/group-messages/${ladderId}`)
//       .then((res) => setMessages(res.data || []))
//       .catch((err) => console.error("❌ Error fetching messages:", err));
//   }, [ladderId]);

//   // 🟢 Auto-scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 🟢 Send new message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msgData = {
//       senderId,
//       senderName,
//       ladderId,
//       message,
//       timestamp: new Date(),
//     };

//     // Emit to socket & update local UI
//     socket.emit("group_message", msgData);
//     setMessages((prev) => [...prev, msgData]);
//     setMessage("");
//   };

//   return (
//     <div className="flex flex-col w-full h-[80vh] bg-gray-100 p-4 rounded-xl shadow-lg">
//       <h2 className="text-lg font-semibold mb-3 text-gray-700">
//         📢 Public Message Board
//       </h2>

//       {/* Messages section */}
//       <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-inner space-y-3">
//         {messages.length === 0 ? (
//           <p className="text-gray-500 text-sm text-center">
//             No messages yet. Be the first to post!
//           </p>
//         ) : (
//           messages.map((msg, i) => (
//             <div key={i} className="flex flex-col">
//               <div className="bg-gray-200 px-3 py-2 rounded-lg shadow max-w-[75%]">
//                 <p className="text-sm whitespace-pre-line">{msg.message}</p>
//               </div>
//               <p className="text-xs text-gray-600 mt-1">
//                 <strong>{msg.senderName || "Unknown"}</strong> •{" "}
//                 {new Date(msg.timestamp).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </p>
//             </div>
//           ))
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Message input */}
//       <div className="mt-4 flex">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 border rounded-lg px-3 py-2 mr-2"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageBoard;






// "use client";

// import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const MessageBoard = ({ senderId, ladderId }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [senderName, setSenderName] = useState("Unknown");
//   const chatEndRef = useRef(null);

//   // ✅ Fetch sender name
//   useEffect(() => {
//     if (!senderId) return;
//     axios
//       .get(`http://localhost:3000/player/${senderId}`)
//       .then((res) => setSenderName(res.data?.name || "Unknown"))
//       .catch(() => setSenderName("Unknown"));
//   }, [senderId]);

//   // ✅ Join ladder room
//   useEffect(() => {
//     if (ladderId) socket.emit("join_room", ladderId);
//   }, [ladderId]);

//   // ✅ Listen for new messages
//   useEffect(() => {
//     socket.on("group_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//     return () => socket.off("group_message");
//   }, []);

//   // ✅ Fetch previous messages
//   useEffect(() => {
//     if (!ladderId) return;
//     axios
//       .get(`http://localhost:3000/group-messages/${ladderId}`)
//       .then((res) => setMessages(res.data || []))
//       .catch((err) => console.error("❌ Error fetching messages:", err));
//   }, [ladderId]);

//   // ✅ Scroll to bottom after messages update (ensures first & new messages visible)
//   useLayoutEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
//     }
//   }, [messages]);

//   // ✅ Send message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msgData = {
//       senderId,
//       senderName,
//       ladderId,
//       message,
//       timestamp: new Date(),
//     };

//     socket.emit("group_message", msgData);
//     setMessages((prev) => [...prev, msgData]);
//     setMessage("");
//   };

//   return (
//     <div className="flex flex-col w-full h-[80vh] bg-gray-100 p-4 rounded-xl shadow-lg">
//       <h2 className="text-lg font-semibold mb-3 text-gray-700 text-center">
//         📢 Public Message Board
//       </h2>

//       {/* ✅ Scrollable Message Area */}
//       <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white rounded-lg shadow-inner">
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//           {messages.length === 0 ? (
//             <p className="text-gray-500 text-sm text-center">
//               No messages yet. Be the first to post!
//             </p>
//           ) : (
//             messages.map((msg, i) => (
//               <div key={i} className="flex flex-col">
//                 <div className="bg-gray-200 px-3 py-2 rounded-lg shadow max-w-[80%] break-words">
//                   <p className="text-sm whitespace-pre-line">{msg.message}</p>
//                 </div>
//                 <p className="text-xs text-gray-600 mt-1">
//                   <strong>{msg.senderName || "Unknown"}</strong> •{" "}
//                   {new Date(msg.timestamp).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             ))
//           )}
//           <div ref={chatEndRef} />
//         </div>
//       </div>

//       {/* ✅ Input Section — Always Visible */}
//       <div className="mt-3 flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 border-none focus:ring-0 outline-none px-3 py-2 text-sm"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-semibold"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageBoard;








"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://sportssolutionspro.com:8443", { transports: ["websocket"] });

const MessageBoard = ({ senderId, ladderId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("Unknown");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!senderId) return;
    axios
      .get(`https://sportssolutionspro.com:8443/player/${senderId}`)
      .then((res) => setSenderName(res.data?.name || "Unknown"))
      .catch(() => setSenderName("Unknown"));
  }, [senderId]);

  useEffect(() => {
    if (ladderId) socket.emit("join_room", ladderId);
  }, [ladderId]);

  useEffect(() => {
    socket.on("group_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("group_message");
  }, []);

  useEffect(() => {
    if (!ladderId) return;
    axios
      .get(`https://sportssolutionspro.com:8443/group-messages/${ladderId}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [ladderId]);

  useLayoutEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = {
      senderId,
      senderName,
      ladderId,
      message,
      timestamp: new Date(),
    };
    socket.emit("group_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full h-[80vh] bg-gray-900 text-white p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-center flex items-center justify-center gap-2">
           ChatBoard
      </h2>

      {/* ✅ Scrollable Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg shadow-inner p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">
            No messages yet. Be the first to post!
          </p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <div className="bg-gray-700 px-3 py-2 rounded-lg shadow max-w-[80%] break-words">
                <p className="text-sm whitespace-pre-line">{msg.message}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <strong className="text-gray-200">
                  {msg.senderName || "Unknown"}
                </strong>{" "}
                •{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ✅ Visible Input Box */}
      <div className="mt-3 flex items-center bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-lg sticky bottom-0">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-white border-none focus:ring-0 outline-none px-3 py-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBoard;


