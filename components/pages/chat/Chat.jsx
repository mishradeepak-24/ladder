
// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const Chat = ({ senderId, ladderId }) => {
//   const [players, setPlayers] = useState([]);
//   const [receiver, setReceiver] = useState(null);
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState("");
//   const [view, setView] = useState("list");
//   const chatEndRef = useRef(null);

//   // ✅ Fetch unread players
//   useEffect(() => {
//     if (!senderId || !ladderId) return;
//     axios
//       .get(`http://localhost:3000/unread/${senderId}/${ladderId}`)
//       .then((res) => setPlayers(res.data))
//       .catch((err) => console.error("❌ Error fetching players:", err));
//   }, [senderId, ladderId]);

//   // ✅ Join socket
//   useEffect(() => {
//     if (senderId) socket.emit("join", senderId);
//   }, [senderId]);

//   // ✅ Handle online/offline users
//   useEffect(() => {
//     // When the server sends the full list of online users
//     socket.on("online_users", (onlineUserIds) => {
//       setPlayers((prev) =>
//         prev.map((p) => ({
//           ...p,
//           // online: onlineUserIds.includes(p.player_id?.toString()),
//           online: onlineUserIds.map(String).includes(String(p.player_id))

//         }))
//       );
//     });

//     // When one user comes online
//     socket.on("user_online", (id) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id?.toString() === id?.toString()
//             ? { ...p, online: true }
//             : p
//         )
//       );
//     });

//     // When one user goes offline
//     socket.on("user_offline", (id) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id?.toString() === id?.toString()
//             ? { ...p, online: false }
//             : p
//         )
//       );
//     });

//     return () => {
//       socket.off("online_users");
//       socket.off("user_online");
//       socket.off("user_offline");
//     };
//   }, []);

//   // ✅ Fetch chat + mark as read
//   useEffect(() => {
//     if (!senderId || !receiver) return;

//     // Mark messages as read when chat opens
//     axios.put("http://localhost:3000/messages/read", {
//       senderId: receiver.player_id,
//       receiverId: senderId,
//     });

//     axios
//       .get(`http://localhost:3000/messages/${senderId}/${receiver.player_id}`)
//       .then((res) => {
//         const formatted = res.data.map((msg) => ({
//           text: msg.message,
//           fromSelf: msg.sender_id == senderId,
//         }));
//         setChat(formatted);
//       })
//       .catch((err) => console.error("❌ Fetch chat error:", err));
//   }, [senderId, receiver]);

//   // ✅ Receive messages live
//   useEffect(() => {
//     socket.on("private_message", (data) => {
//       if (data.senderId === receiver?.player_id) {
//         // Add to open chat window
//         setChat((prev) => [...prev, { text: data.message, fromSelf: false }]);
//       }

//       // ✅ Update unread count for unopened chats
//       setPlayers((prevPlayers) =>
//         prevPlayers.map((p) =>
//           p.player_id === data.senderId &&
//           (!receiver || receiver.player_id !== data.senderId)
//             ? { ...p, unread_count: (p.unread_count || 0) + 1 }
//             : p
//         )
//       );
//     });

//     return () => socket.off("private_message");
//   }, [receiver]);

//   // ✅ Auto scroll chat to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   // ✅ Send message
//   const sendMessage = () => {
//     if (!message.trim() || !receiver) return;

//     const msgData = {
//       senderId,
//       receiverId: receiver.player_id,
//       message,
//     };

//     socket.emit("private_message", msgData);
//     setChat((prev) => [...prev, { text: message, fromSelf: true }]);
//     setMessage("");
//   };

//   const openChat = (p) => {
//     setReceiver(p);
//     setView("chat");

//     // Reset unread count
//     setPlayers((prev) =>
//       prev.map((player) =>
//         player.player_id === p.player_id ? { ...player, unread_count: 0 } : player
//       )
//     );
//   };

//   const goBack = () => {
//     setReceiver(null);
//     setView("list");
//   };

//   return (
//     <div className="flex flex-col w-full h-full bg-gray-100 p-4 rounded-xl shadow-lg">
//       {view === "list" && (
//         <>
//           <h2 className="text-lg font-semibold mb-3 text-gray-700">
//             Messages
//           </h2>

//           {players.length === 0 ? (
//             <p className="text-gray-500">No unread players found.</p>
//           ) : (
//             <div className="space-y-2 overflow-y-auto max-h-[70vh] pr-2">
//               {players.map((p) => (
//                 <div
//                   key={p.player_id}
//                   className={`flex justify-between items-center p-3 rounded-lg shadow cursor-pointer border transition-all duration-150 ${
//                     p.online
//                       ? "bg-green-50 border-green-300 hover:bg-green-100"
//                       : "bg-white hover:bg-blue-50 border-gray-200"
//                   }`}
//                   onClick={() => openChat(p)}
//                 >
//                   <div className="flex flex-col">
//                     <div className="flex items-center space-x-2">
//                       <p className="font-semibold text-gray-700">
//                         {p.name || "Unknown Player"}
//                       </p>

//                       {/* ✅ Online/offline dot */}
//                       <span
//                         className={`w-2.5 h-2.5 rounded-full ${
//                           p.online ? "bg-green-500" : "bg-gray-400"
//                         }`}
//                         title={p.online ? "Online" : "Offline"}
//                       ></span>
//                     </div>

//                     <p className="text-sm text-gray-500">{p.email}</p>

//                     {/* ✅ Individual Unread Count */}
//                     {p.unread_count > 0 && (
//                       <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
//                         {p.unread_count} unread
//                       </span>
//                     )}
//                   </div>

//                   {/* ✅ Chat Button with badge */}
//                   <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 relative">
//                     Chat
//                     {p.unread_count > 0 && (
//                       <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                         {p.unread_count}
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {view === "chat" && receiver && (
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center mb-3">
//             <button
//               onClick={goBack}
//               className="text-blue-600 hover:underline text-sm mr-3"
//             >
//               ← Back
//             </button>
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
//               <span>Chat with {receiver.name || "Player"}</span>
//               <span
//                 className={`w-2.5 h-2.5 rounded-full ${
//                   receiver.online ? "bg-green-500" : "bg-gray-400"
//                 }`}
//                 title={receiver.online ? "Online" : "Offline"}
//               ></span>
//             </h2>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto bg-white p-3 rounded-lg shadow-inner space-y-2">
//             {chat.length === 0 ? (
//               <p className="text-gray-500 text-sm text-center">
//                 No messages yet.
//               </p>
//             ) : (
//               chat.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${
//                     msg.fromSelf ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`px-3 py-2 rounded-lg max-w-[75%] ${
//                       msg.fromSelf
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           {/* Input */}
//           <div className="mt-3 flex">
//             <input
//               type="text"
//               className="flex-1 border rounded-lg px-3 py-2 mr-2"
//               placeholder="Type your message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;







// ====================31/10/25=============================================



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const Chat = ({ senderId, ladderId }) => {
//   const [players, setPlayers] = useState([]);
//   const [receiver, setReceiver] = useState(null);
//   const [chat, setChat] = useState([]);
//   const [message, setMessage] = useState("");
//   const [view, setView] = useState("list");
//   const chatEndRef = useRef(null);
//   const [replyMessages, setReplyMessages] = useState({}); // ✅ store replies for each player

//   // ✅ Fetch unread players
//   useEffect(() => {
//     if (!senderId || !ladderId) return;
//     axios
//       .get(`http://localhost:3000/unread/${senderId}/${ladderId}`)
//       .then((res) => setPlayers(res.data))
//       .catch((err) => console.error("❌ Error fetching players:", err));
//   }, [senderId, ladderId]);

//   // ✅ Join socket
//   useEffect(() => {
//     if (senderId) socket.emit("join", senderId);
//   }, [senderId]);

//   // ✅ Handle online/offline users
//   useEffect(() => {
//     socket.on("online_users", (onlineUserIds) => {
//       setPlayers((prev) =>
//         prev.map((p) => ({
//           ...p,
//           online: onlineUserIds.map(String).includes(String(p.player_id)),
//         }))
//       );
//     });

//     socket.on("user_online", (id) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id?.toString() === id?.toString()
//             ? { ...p, online: true }
//             : p
//         )
//       );
//     });

//     socket.on("user_offline", (id) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id?.toString() === id?.toString()
//             ? { ...p, online: false }
//             : p
//         )
//       );
//     });

//     return () => {
//       socket.off("online_users");
//       socket.off("user_online");
//       socket.off("user_offline");
//     };
//   }, []);

//   // ✅ Fetch chat + mark as read
//   useEffect(() => {
//     if (!senderId || !receiver) return;

//     axios.put("http://localhost:3000/messages/read", {
//       senderId: receiver.player_id,
//       receiverId: senderId,
//     });

//     axios
//       .get(`http://localhost:3000/messages/${senderId}/${receiver.player_id}`)
//       .then((res) => {
//         const formatted = res.data.map((msg) => ({
//           text: msg.message,
//           fromSelf: msg.sender_id == senderId,
//         }));
//         setChat(formatted);
//       })
//       .catch((err) => console.error("❌ Fetch chat error:", err));
//   }, [senderId, receiver]);

//   // ✅ Receive messages live
//   useEffect(() => {
//     socket.on("private_message", (data) => {
//       if (data.senderId === receiver?.player_id) {
//         setChat((prev) => [...prev, { text: data.message, fromSelf: false }]);
//       }

//       // ✅ Update unread count in list view
//       setPlayers((prevPlayers) =>
//         prevPlayers.map((p) =>
//           p.player_id === data.senderId &&
//           (!receiver || receiver.player_id !== data.senderId)
//             ? { ...p, unread_count: (p.unread_count || 0) + 1 }
//             : p
//         )
//       );
//     });

//     return () => socket.off("private_message");
//   }, [receiver]);

//   // ✅ Auto scroll chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat]);

//   // ✅ Send message inside full chat view
//   const sendMessage = () => {
//     if (!message.trim() || !receiver) return;

//     const msgData = {
//       senderId,
//       receiverId: receiver.player_id,
//       message,
//     };

//     socket.emit("private_message", msgData);
//     setChat((prev) => [...prev, { text: message, fromSelf: true }]);
//     setMessage("");
//   };

//   // ✅ Inline reply sender (list view)
//   const sendInlineReply = (player) => {
//     const replyText = replyMessages[player.player_id];
//     if (!replyText?.trim()) return;

//     const msgData = {
//       senderId,
//       receiverId: player.player_id,
//       message: replyText,
//     };

//     socket.emit("private_message", msgData);

//     // Clear the reply input for that player
//     setReplyMessages((prev) => ({ ...prev, [player.player_id]: "" }));

//     // Mark message sent visually or via toast if you want
//   };

//   const openChat = (p) => {
//     setReceiver(p);
//     setView("chat");
//     setPlayers((prev) =>
//       prev.map((player) =>
//         player.player_id === p.player_id ? { ...player, unread_count: 0 } : player
//       )
//     );
//   };

//   const goBack = () => {
//     setReceiver(null);
//     setView("list");
//   };

//   return (
//     <div className="flex flex-col w-full h-full bg-gray-100 p-4 rounded-xl shadow-lg">
//       {view === "list" && (
//         <>
//           <h2 className="text-lg font-semibold mb-3 text-gray-700">
//             Messages
//           </h2>

//           {players.length === 0 ? (
//             <p className="text-gray-500">No unread players found.</p>
//           ) : (
//             <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
//               {players.map((p) => (
//                 <div
//                   key={p.player_id}
//                   className={`p-3 rounded-lg border shadow-sm transition-all duration-150 ${
//                     p.online
//                       ? "bg-green-50 border-green-300 hover:bg-green-100"
//                       : "bg-white hover:bg-blue-50 border-gray-200"
//                   }`}
//                 >
//                   {/* Player info */}
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => openChat(p)}
//                   >
//                     <div className="flex flex-col">
//                       <div className="flex items-center space-x-2">
//                         <p className="font-semibold text-gray-700">
//                           {p.name || "Unknown Player"}
//                         </p>
//                         <span
//                           className={`w-2.5 h-2.5 rounded-full ${
//                             p.online ? "bg-green-500" : "bg-gray-400"
//                           }`}
//                         ></span>
//                       </div>
//                       <p className="text-sm text-gray-500">{p.email}</p>

//                       {p.unread_count > 0 && (
//                         <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full mt-1 inline-block">
//                           {p.unread_count} unread
//                         </span>
//                       )}
//                     </div>

//                     <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 relative">
//                       Chat
//                       {p.unread_count > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
//                           {p.unread_count}
//                         </span>
//                       )}
//                     </button>
//                   </div>

//                   {/* ✅ Inline reply box */}
//                   <div className="mt-2 flex items-center space-x-2">
//                     <input
//                       type="text"
//                       placeholder="Type your reply..."
//                       className="flex-1 border rounded-lg px-3 py-2 text-sm"
//                       value={replyMessages[p.player_id] || ""}
//                       onChange={(e) =>
//                         setReplyMessages((prev) => ({
//                           ...prev,
//                           [p.player_id]: e.target.value,
//                         }))
//                       }
//                       onKeyDown={(e) =>
//                         e.key === "Enter" && sendInlineReply(p)
//                       }
//                     />
//                     <button
//                       onClick={() => sendInlineReply(p)}
//                       className="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-600"
//                     >
//                       Send
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {view === "chat" && receiver && (
//         <div className="flex flex-col h-full">
//           <div className="flex items-center mb-3">
//             <button
//               onClick={goBack}
//               className="text-blue-600 hover:underline text-sm mr-3"
//             >
//               ← Back
//             </button>
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
//               <span>Chat with {receiver.name || "Player"}</span>
//               <span
//                 className={`w-2.5 h-2.5 rounded-full ${
//                   receiver.online ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               ></span>
//             </h2>
//           </div>

//           <div className="flex-1 overflow-y-auto bg-white p-3 rounded-lg shadow-inner space-y-2">
//             {chat.length === 0 ? (
//               <p className="text-gray-500 text-sm text-center">
//                 No messages yet.
//               </p>
//             ) : (
//               chat.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`flex ${
//                     msg.fromSelf ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`px-3 py-2 rounded-lg max-w-[75%] ${
//                       msg.fromSelf
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="mt-3 flex">
//             <input
//               type="text"
//               className="flex-1 border rounded-lg px-3 py-2 mr-2"
//               placeholder="Type your message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;













































































































