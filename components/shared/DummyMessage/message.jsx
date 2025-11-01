"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://sportssolutionspro.com:8443", { transports: ["websocket"] });

const DummyMessageBoard = ({ senderId, ladderId, readOnly = false }) => {
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
    if (!message.trim() || readOnly) return;
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
    <div className="flex flex-col w-full h-full bg-gray-900 text-white p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-center flex items-center justify-center gap-2">
         ChatBoard
      </h2>

      {/* ✅ Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-inner p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
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

      {/* ✅ Hide input if readOnly */}
      {!readOnly && (
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
      )}
    </div>
  );
};

export default DummyMessageBoard;
