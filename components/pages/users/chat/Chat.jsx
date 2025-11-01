// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:3000", { transports: ["websocket"] });

// const Chat = ({ userId, ladderId }) => {
//   const senderId = userId;
//   const [players, setPlayers] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   // ===== Join socket room =====
//   useEffect(() => {
//     if (senderId) {
//       socket.emit("join", senderId);
//       console.log("🟢 Joined room for user:", senderId);
//     }
//   }, [senderId]);

//   // ===== Scroll to bottom on new messages =====
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ===== Fetch players with unread counts =====
//   useEffect(() => {
//     if (!senderId || !ladderId) return;

//     const fetchPlayers = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3000/unread/${senderId}/${ladderId}`
//         );
//         setPlayers(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching players:", err);
//       }
//     };
//     fetchPlayers();
//   }, [senderId, ladderId]);

//   // ===== Fetch chat messages when player selected =====
//   useEffect(() => {
//     if (!selectedPlayer) return;

//     const fetchMessages = async () => {
//       try {
//         // ✅ Mark messages as read in DB
//         await axios.put("http://localhost:3000/messages/read", {
//           senderId: selectedPlayer.player_id, // message sender
//           receiverId: senderId, // current user
//         });

//         // ✅ Fetch messages
//         const res = await axios.get(
//           `http://localhost:3000/messages/${senderId}/${selectedPlayer.player_id}`
//         );
//         setMessages(res.data);

//         // ✅ Clear unread count in UI
//         setPlayers((prev) =>
//           prev.map((p) =>
//             p.player_id === selectedPlayer.player_id
//               ? { ...p, unread_count: 0 }
//               : p
//           )
//         );
//       } catch (err) {
//         console.error("❌ Error fetching or marking messages:", err);
//       }
//     };
//     fetchMessages();
//   }, [selectedPlayer, senderId]);

//   // ===== Listen for online users =====
//   useEffect(() => {
//     socket.on("online_users", (users) => setOnlineUsers(users));
//     return () => socket.off("online_users");
//   }, []);

//   // ===== Listen for incoming messages =====
//   useEffect(() => {
//     socket.on("private_message", (data) => {
//       if (
//         (data.senderId === selectedPlayer?.player_id &&
//           data.receiverId === senderId) ||
//         (data.receiverId === selectedPlayer?.player_id &&
//           data.senderId === senderId)
//       ) {
//         setMessages((prev) => [...prev, data]);

//         // ✅ If message was from this player, mark as read immediately
//         if (data.senderId === selectedPlayer?.player_id) {
//           axios.put("http://localhost:3000/messages/read", {
//             senderId: selectedPlayer.player_id,
//             receiverId: senderId,
//           });
//         }
//       } else {
//         // Update unread count for other players
//         setPlayers((prev) =>
//           prev.map((p) =>
//             p.player_id === data.senderId
//               ? { ...p, unread_count: (p.unread_count || 0) + 1 }
//               : p
//           )
//         );
//       }
//     });

//     return () => socket.off("private_message");
//   }, [selectedPlayer, senderId]);

//   // ===== Listen for live unread count updates =====
//   useEffect(() => {
//     socket.on("unread_count", ({ from, count }) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id === from ? { ...p, unread_count: count } : p
//         )
//       );
//     });

//     return () => socket.off("unread_count");
//   }, []);

//   // ===== Send message =====
//   const sendMessage = () => {
//     if (!input.trim() || !selectedPlayer) return;

//     const msgData = {
//       senderId,
//       receiverId: selectedPlayer.player_id,
//       message: input,
//     };

//     socket.emit("private_message", msgData);

//     setMessages((prev) => [
//       ...prev,
//       { ...msgData, timestamp: new Date(), self: true },
//     ]);
//     setInput("");
//   };

//   // ===== Check if player is online =====
//   const isOnline = (playerId) => onlineUsers.includes(playerId.toString());

//   return (
//     <div className="flex h-[600px] border rounded-lg overflow-hidden shadow-md bg-white">
//       {/* LEFT: Player list */}
//       <div className="w-1/3 border-r overflow-y-auto">
//         <div className="bg-gray-100 p-3 font-semibold text-gray-700 sticky top-0">
//           Players
//         </div>
//         {players.length === 0 && (
//           <div className="p-4 text-gray-500 text-sm">No players found</div>
//         )}
//         {players.map((player) => (
//           <div
//             key={player.player_id}
//             onClick={() => {
//               setSelectedPlayer(player);
//               // ✅ Clear unread count instantly (frontend)
//               setPlayers((prev) =>
//                 prev.map((p) =>
//                   p.player_id === player.player_id
//                     ? { ...p, unread_count: 0 }
//                     : p
//                 )
//               );
//               // ✅ Call API to mark read in DB
//               axios.put("http://localhost:3000/messages/read", {
//                 senderId: player.player_id,
//                 receiverId: senderId,
//               });
//             }}
//             className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
//               selectedPlayer?.player_id === player.player_id
//                 ? "bg-gray-200"
//                 : ""
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               <span
//                 className={`w-3 h-3 rounded-full ${
//                   isOnline(player.player_id) ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               ></span>
//               <span className="text-sm font-medium text-gray-800">
//                 {player.name}
//               </span>
//             </div>
//             {player.unread_count > 0 && (
//               <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {player.unread_count}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* RIGHT: Chat window */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-3 border-b bg-gray-50 font-semibold text-gray-700">
//           {selectedPlayer ? (
//             selectedPlayer.player_name
//           ) : (
//             <span className="text-gray-400">Select a player to start chat</span>
//           )}
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//           {selectedPlayer ? (
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex mb-2 ${
//                   msg.senderId === senderId ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] ${
//                     msg.senderId === senderId
//                       ? "bg-blue-500 text-white"
//                       : "bg-white border"
//                   }`}
//                 >
//                   {msg.message}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500 mt-20 text-sm">
//               👈 Select a player to start chatting
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {selectedPlayer && (
//           <div className="p-3 border-t flex items-center gap-2 bg-white">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;








// ========================aaj ka hai code ==========================







// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";

// const socket = io("https://sportssolutionspro.com:8443", { transports: ["websocket"] });

// const Chat = ({ userId, ladderId }) => {
//   const senderId = userId;
//   const [players, setPlayers] = useState([]);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   // ===== Join socket room =====
//   useEffect(() => {
//     if (senderId) {
//       socket.emit("join", senderId);
//       console.log("🟢 Joined room for user:", senderId);
//     }
//   }, [senderId]);

//   // ===== Scroll to bottom on new messages =====
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ===== Fetch players with unread counts =====
//   useEffect(() => {
//     if (!senderId || !ladderId) return;

//     const fetchPlayers = async () => {
//       try {
//         const res = await axios.get(
//           `https://sportssolutionspro.com:8443/unread/${senderId}/${ladderId}`
//         );
//         setPlayers(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching players:", err);
//       }
//     };
//     fetchPlayers();
//   }, [senderId, ladderId]);

//   // ===== Fetch chat messages when player selected =====
//   useEffect(() => {
//     if (!selectedPlayer) return;

//     const fetchMessages = async () => {
//       try {
//         // ✅ Mark messages as read in DB
//         await axios.put("https://sportssolutionspro.com:8443/messages/read", {
//           senderId: selectedPlayer.player_id, // message sender
//           receiverId: senderId, // current user
//         });

//         // ✅ Fetch messages
//         const res = await axios.get(
//           `https://sportssolutionspro.com:8443/messages/${senderId}/${selectedPlayer.player_id}`
//         );

//         // ✅ Normalize messages
//         const normalized = res.data.map((msg) => ({
//           senderId: msg.senderId || msg.sender_id,
//           receiverId: msg.receiverId || msg.receiver_id,
//           message: msg.message,
//           timestamp: msg.timestamp,
//           self: (msg.senderId || msg.sender_id) === senderId,
//         }));

//         setMessages(normalized);

//         // ✅ Clear unread count in UI
//         setPlayers((prev) =>
//           prev.map((p) =>
//             p.player_id === selectedPlayer.player_id
//               ? { ...p, unread_count: 0 }
//               : p
//           )
//         );
//       } catch (err) {
//         console.error("❌ Error fetching or marking messages:", err);
//       }
//     };
//     fetchMessages();
//   }, [selectedPlayer, senderId]);

//   // ===== Listen for online users =====
//   useEffect(() => {
//     socket.on("online_users", (users) => setOnlineUsers(users));
//     return () => socket.off("online_users");
//   }, []);

//   // ===== Listen for incoming messages =====
//   useEffect(() => {
//     socket.on("private_message", (data) => {
//       if (
//         (data.senderId === selectedPlayer?.player_id &&
//           data.receiverId === senderId) ||
//         (data.receiverId === selectedPlayer?.player_id &&
//           data.senderId === senderId)
//       ) {
//         setMessages((prev) => [
//           ...prev,
//           { ...data, self: data.senderId === senderId },
//         ]);

//         // ✅ If message was from this player, mark as read immediately
//         if (data.senderId === selectedPlayer?.player_id) {
//           axios.put("https://sportssolutionspro.com:8443/messages/read", {
//             senderId: selectedPlayer.player_id,
//             receiverId: senderId,
//           });
//         }
//       } else {
//         // Update unread count for other players
//         setPlayers((prev) =>
//           prev.map((p) =>
//             p.player_id === data.senderId
//               ? { ...p, unread_count: (p.unread_count || 0) + 1 }
//               : p
//           )
//         );
//       }
//     });

//     return () => socket.off("private_message");
//   }, [selectedPlayer, senderId]);

//   // ===== Listen for live unread count updates =====
//   useEffect(() => {
//     socket.on("unread_count", ({ from, count }) => {
//       setPlayers((prev) =>
//         prev.map((p) =>
//           p.player_id === from ? { ...p, unread_count: count } : p
//         )
//       );
//     });

//     return () => socket.off("unread_count");
//   }, []);

//   // ===== Send message =====
//   const sendMessage = () => {
//     if (!input.trim() || !selectedPlayer) return;

//     const msgData = {
//       senderId,
//       receiverId: selectedPlayer.player_id,
//       message: input,
//     };

//     socket.emit("private_message", msgData);

//     setMessages((prev) => [
//       ...prev,
//       { ...msgData, timestamp: new Date(), self: true },
//     ]);
//     setInput("");
//   };

//   // ===== Check if player is online =====
//   const isOnline = (playerId) => onlineUsers.includes(playerId.toString());

//   return (
//     <div className="flex h-[600px] border rounded-lg overflow-hidden shadow-md bg-white">
//       {/* LEFT: Player list */}
//       <div className="w-1/3 border-r overflow-y-auto">
//         <div className="bg-gray-100 p-3 font-semibold text-gray-700 sticky top-0">
//           Players
//         </div>
//         {players.length === 0 && (
//           <div className="p-4 text-gray-500 text-sm">No players found</div>
//         )}
//         {players.map((player) => (
//           <div
//             key={player.player_id}
//             onClick={() => {
//               setSelectedPlayer(player);
//               // ✅ Clear unread count instantly (frontend)
//               setPlayers((prev) =>
//                 prev.map((p) =>
//                   p.player_id === player.player_id
//                     ? { ...p, unread_count: 0 }
//                     : p
//                 )
//               );
//               // ✅ Call API to mark read in DB
//               axios.put("https://sportssolutionspro.com:8443/messages/read", {
//                 senderId: player.player_id,
//                 receiverId: senderId,
//               });
//             }}
//             className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
//               selectedPlayer?.player_id === player.player_id
//                 ? "bg-gray-200"
//                 : ""
//             }`}
//           >
//             <div className="flex items-center gap-2">
//               <span
//                 className={`w-3 h-3 rounded-full ${
//                   isOnline(player.player_id) ? "bg-green-500" : "bg-gray-400"
//                 }`}
//               ></span>
//               <span className="text-sm font-medium text-gray-800">
//                 {player.name}
//               </span>
//             </div>
//             {player.unread_count > 0 && (
//               <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {player.unread_count}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* RIGHT: Chat window */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-3 border-b bg-gray-50 font-semibold text-gray-700">
//           {selectedPlayer ? (
//             selectedPlayer.player_name
//           ) : (
//             <span className="text-gray-400">Select a player to start chat</span>
//           )}
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//           {selectedPlayer ? (
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex mb-2 ${
//                   msg.self ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] ${
//                     msg.self ? "bg-blue-500 text-white" : "bg-white border"
//                   }`}
//                 >
//                   {msg.message}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-500 mt-20 text-sm">
//               👈 Select a player to start chatting
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {selectedPlayer && (
//           <div className="p-3 border-t flex items-center gap-2 bg-white">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;










// =========================== sham ka code =======================================







"use client";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const Chat = ({ userId, ladderId }) => {
  const senderId = userId;
  const [players, setPlayers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
  const messagesEndRef = useRef(null);

  // ===== Join socket room =====
  useEffect(() => {
    if (senderId) {
      socket.emit("join", senderId);
      console.log("🟢 Joined room for user:", senderId);
    }
  }, [senderId]);

  // ===== Scroll to bottom on new messages =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== Fetch players with unread counts =====
  useEffect(() => {
    if (!senderId || !ladderId) return;

    const fetchPlayers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/unread/${senderId}/${ladderId}`
        );
        // ✅ Sort alphabetically by player.name
        const sortedPlayers = [...res.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPlayers(sortedPlayers);
      } catch (err) {
        console.error("❌ Error fetching players:", err);
      }
    };
    fetchPlayers();
  }, [senderId, ladderId]);

  // ===== Fetch chat messages when player selected =====
  useEffect(() => {
    if (!selectedPlayer) return;

    const fetchMessages = async () => {
      try {
        await axios.put("http://localhost:3000/messages/read", {
          senderId: selectedPlayer.player_id,
          receiverId: senderId,
        });

        const res = await axios.get(
          `http://localhost:3000/messages/${senderId}/${selectedPlayer.player_id}`
        );

        const normalized = res.data.map((msg) => ({
          senderId: msg.senderId || msg.sender_id,
          receiverId: msg.receiverId || msg.receiver_id,
          message: msg.message,
          timestamp: msg.timestamp,
          self: (msg.senderId || msg.sender_id) === senderId,
        }));

        setMessages(normalized);

        // ✅ Just update unread count, do not reorder
        setPlayers((prev) =>
          prev.map((p) =>
            p.player_id === selectedPlayer.player_id
              ? { ...p, unread_count: 0 }
              : p
          )
        );
      } catch (err) {
        console.error("❌ Error fetching or marking messages:", err);
      }
    };
    fetchMessages();
  }, [selectedPlayer, senderId]);

  // ===== Listen for online users =====
  useEffect(() => {
    socket.on("online_users", (users) => setOnlineUsers(users));
    return () => socket.off("online_users");
  }, []);

  // ===== Listen for incoming messages =====
  useEffect(() => {
    socket.on("private_message", (data) => {
      if (
        (data.senderId === selectedPlayer?.player_id &&
          data.receiverId === senderId) ||
        (data.receiverId === selectedPlayer?.player_id &&
          data.senderId === senderId)
      ) {
        setMessages((prev) => [
          ...prev,
          { ...data, self: data.senderId === senderId },
        ]);

        if (data.senderId === selectedPlayer?.player_id) {
          axios.put("http://localhost:3000/messages/read", {
            senderId: selectedPlayer.player_id,
            receiverId: senderId,
          });
        }
      } else {
        // ✅ Update unread count but don't reorder
        setPlayers((prev) =>
          prev.map((p) =>
            p.player_id === data.senderId
              ? { ...p, unread_count: (p.unread_count || 0) + 1 }
              : p
          )
        );
      }
    });

    return () => socket.off("private_message");
  }, [selectedPlayer, senderId]);

  // ===== Listen for live unread count updates =====
  useEffect(() => {
    socket.on("unread_count", ({ from, count }) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.player_id === from ? { ...p, unread_count: count } : p
        )
      );
    });

    return () => socket.off("unread_count");
  }, []);

  // ===== Send message =====
  const sendMessage = () => {
    if (!input.trim() || !selectedPlayer) return;

    const msgData = {
      senderId,
      receiverId: selectedPlayer.player_id,
      message: input,
    };

    socket.emit("private_message", msgData);

    setMessages((prev) => [
      ...prev,
      { ...msgData, timestamp: new Date(), self: true },
    ]);
    setInput("");
  };

  // ===== Check if player is online =====
  const isOnline = (playerId) => onlineUsers.includes(playerId.toString());

  // ===== Filtered players based on search =====
  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden shadow-md bg-white">
      {/* LEFT: Player list */}
      <div className="w-1/3 border-r flex flex-col">
        {/* Sticky Header + Search */}
        <div className="bg-gray-100 p-3 sticky top-0 z-10">
          <div className="font-semibold text-gray-700 mb-2">Players</div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players..."
            className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none"
          />
        </div>

        {/* Scrollable player list */}
        <div className="flex-1 overflow-y-auto">
          {filteredPlayers.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">No players found</div>
          ) : (
            filteredPlayers.map((player) => (
              <div
                key={player.player_id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setPlayers((prev) =>
                    prev.map((p) =>
                      p.player_id === player.player_id
                        ? { ...p, unread_count: 0 }
                        : p
                    )
                  );
                  axios.put(
                    "http://localhost:3000/messages/read",
                    {
                      senderId: player.player_id,
                      receiverId: senderId,
                    }
                  );
                }}
                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedPlayer?.player_id === player.player_id
                    ? "bg-gray-200"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isOnline(player.player_id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-sm font-medium text-gray-800">
                    {player.name}
                  </span>
                </div>
                {player.unread_count > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {player.unread_count}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b bg-gray-50 font-semibold text-gray-700">
          {selectedPlayer ? (
            selectedPlayer.player_name
          ) : (
            <span className="text-gray-400">Select a player to start chat</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {selectedPlayer ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  msg.self ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] ${
                    msg.self ? "bg-blue-500 text-white" : "bg-white border"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-20 text-sm">
              👈 Select a player to start chatting
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedPlayer && (
          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
