// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mysql = require('mysql2/promise');
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// app.use(express.json());

// // DB connection pool
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Get all messages between two users
// app.get('/messages/:user1/:user2', async (req, res) => {
//   const { user1, user2 } = req.params;
//   try {
//     const [rows] = await db.query(`
//       SELECT * FROM messages
//       WHERE (sender_id = ? AND receiver_id = ?)
//          OR (sender_id = ? AND receiver_id = ?)
//       ORDER BY timestamp ASC
//     `, [user1, user2, user2, user1]);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Database error');
//   }
// });

// // Real-time chat
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Join a room named with user ID (for private messaging)
//   socket.on('join', (userId) => {
//     socket.join(`user_${userId}`);
//   });

//   // Receive and forward message
//   socket.on('private_message', async (data) => {
//     const { senderId, receiverId, message } = data;

//     // Save to DB
//     try {
//       await db.query(
//         'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
//         [senderId, receiverId, message]
//       );

//       // Emit to receiver's room
//       io.to(`user_${receiverId}`).emit('private_message', {
//         senderId,
//         receiverId,
//         message,
//         timestamp: new Date(),
//       });
//     } catch (err) {
//       console.error('DB Error:', err);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Start server
// server.listen(process.env.PORT, () => {
//   console.log(`Server running at http://localhost:${process.env.PORT}`);
// });





















// ======================================================================




// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mysql = require('mysql2/promise');

// const app = express();
// const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: "*",
// //   },
// // });


// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001", // your frontend port
//     methods: ["GET", "POST"],
//   },
// });

// app.use(require("cors")({
//   origin: "http://localhost:3001",
//   methods: ["GET", "POST", "PUT"],
// }));


// app.use(express.json());

// // ====== MySQL DB Connection Pool ======
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // ====== Get All Messages Between Two Users ======
// app.get('/messages/:user1/:user2', async (req, res) => {
//   const { user1, user2 } = req.params;
//   try {
//     const [rows] = await db.query(`
//       SELECT * FROM messages
//       WHERE (sender_id = ? AND receiver_id = ?)
//          OR (sender_id = ? AND receiver_id = ?)
//       ORDER BY timestamp ASC
//     `, [user1, user2, user2, user1]);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Database error');
//   }
// });

// // ====== Get Count of Unread Messages for a User ======
// app.get('/unread/:userId/:ladderId', async (req, res) => {
//   const { userId, ladderId } = req.params;

//   try {
//     const [rows] = await db.query(
//       `
//       SELECT 
//           u.id AS user_idd,
//           u.name,
//           u.phone,
//           u.user_id,
//           u.is_login,
//           u.ladder_id,
//           u.image,
//           IFNULL(m.unread_count, 0) AS unread_count
//       FROM 
//           users u
//       LEFT JOIN (
//           SELECT 
//               sender_id, 
//               COUNT(*) AS unread_count
//           FROM 
//               messages
//           WHERE 
//               receiver_id = ? 
//               AND is_read = 0
//           GROUP BY 
//               sender_id
//       ) AS m ON u.id = m.sender_id
//       WHERE 
//           u.id != ? 
//           AND u.ladder_id = ?
//       ORDER BY 
//           unread_count DESC;
//       `,
//       [userId, userId, ladderId]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).send('Database error');
//   }
// });



// // ====== Mark Messages as Read Between Two Users ======
// app.put('/messages/read', async (req, res) => {
//   const { senderId, receiverId } = req.body;
//   try {
//     await db.query(
//       'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
//       [senderId, receiverId]
//     );
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Database error');
//   }
// });

// // ====== SOCKET.IO Real-time Chat ======
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Join a room named with user ID
//   socket.on('join', (userId) => {
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined room user_${userId}`);
//   });

//   // Handle Private Message
//   socket.on('private_message', async (data) => {
//     const { senderId, receiverId, message } = data;

//     try {
//       // Save message in DB with is_read = 0
//       await db.query(
//         'INSERT INTO messages (sender_id, receiver_id, message, is_read) VALUES (?, ?, ?, 0)',
//         [senderId, receiverId, message]
//       );

//       // Emit message to receiver
//       io.to(`user_${receiverId}`).emit('private_message', {
//         senderId,
//         receiverId,
//         message,
//         timestamp: new Date(),
//       });

//       // Get updated unread count
//       const [countRows] = await db.query(
//         'SELECT COUNT(*) AS unread FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = 0',
//         [receiverId, senderId]
//       );

//       const unreadCount = countRows[0].unread;

//       // Send updated unread count to receiver
//       io.to(`user_${receiverId}`).emit('unread_count', {
//         from: senderId,
//         count: unreadCount
//       });

//     } catch (err) {
//       console.error('DB Error:', err);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // ====== Start Server ======
// server.listen(process.env.PORT, () => {
//   console.log(`Server running at http://localhost:${process.env.PORT}`);
// });


























// =============================Final Version ===============================






// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mysql = require('mysql2/promise');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);

// // ========================
// // 🔗 SOCKET.IO SETUP
// // ========================
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3001", // Frontend port
//     methods: ["GET", "POST", "PUT"],
//     credentials: true,
//   },
// });

// // ========================
// // 🧩 MIDDLEWARES
// // ========================
// app.use(cors({
//   origin: "http://localhost:3001",
//   methods: ["GET", "POST", "PUT"],
// }));
// app.use(express.json());

// // ========================
// // 🗄️ MySQL Connection Pool
// // ========================
// const db = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'chatdb',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // ========================
// // 📜 Get Messages Between Two Users
// // ========================
// app.get('/messages/:user1/:user2', async (req, res) => {
//   const { user1, user2 } = req.params;
//   try {
//     const [rows] = await db.query(`
//       SELECT * FROM messages
//       WHERE (sender_id = ? AND receiver_id = ?)
//          OR (sender_id = ? AND receiver_id = ?)
//       ORDER BY timestamp ASC
//     `, [user1, user2, user2, user1]);

//     res.json(rows);
//   } catch (err) {
//     console.error('❌ Error fetching messages:', err);
//     res.status(500).json({ error: 'Database error fetching messages' });
//   }
// });

// // ========================
// // 🔢 Get Unread Message Count for Each User in Ladder
// // ========================
// app.get('/unread/:userId/:ladderId', async (req, res) => {
//   const { userId, ladderId } = req.params;
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//           u.id AS player_id,
//           u.name,
//           u.phone,
//           u.user_id,
//           u.is_login,
//           u.ladder_id,
//           u.image,
//           IFNULL(m.unread_count, 0) AS unread_count
//       FROM users u
//       LEFT JOIN (
//           SELECT 
//               sender_id, 
//               COUNT(*) AS unread_count
//           FROM messages
//           WHERE receiver_id = ? AND is_read = 0
//           GROUP BY sender_id
//       ) AS m ON u.id = m.sender_id
//       WHERE 
//           u.id != ? 
//           AND u.ladder_id = ?
//       ORDER BY unread_count DESC
//     `, [userId, userId, ladderId]);

//     res.json(rows);
//   } catch (err) {
//     console.error('❌ Error fetching unread counts:', err);
//     res.status(500).json({ error: 'Database error fetching unread counts' });
//   }
// });

// // ========================
// // ✅ Mark Messages as Read
// // ========================
// app.put('/messages/read', async (req, res) => {
//   const { senderId, receiverId } = req.body;

//   if (!senderId || !receiverId) {
//     return res.status(400).json({ error: 'senderId and receiverId are required' });
//   }

//   try {
//     await db.query(
//       'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
//       [senderId, receiverId]
//     );
//     res.json({ success: true });
//   } catch (err) {
//     console.error('❌ Error marking messages read:', err);
//     res.status(500).json({ error: 'Database error updating read status' });
//   }
// });

// // ========================
// // ⚡ SOCKET.IO EVENTS
// // ========================
// io.on('connection', (socket) => {
//   console.log('🟢 User connected:', socket.id);

//   // 🧩 User joins their private room
//   socket.on('join', (userId) => {
//     if (!userId) return;
//     socket.join(`user_${userId}`);
//     console.log(`📡 User ${userId} joined room user_${userId}`);
//   });

//   // 💬 Private message event
//   socket.on('private_message', async (data) => {
//     const { senderId, receiverId, message } = data;

//     if (!senderId || !receiverId || !message) {
//       console.log('⚠️ Invalid message payload:', data);
//       return;
//     }

//     try {
//       // Store in DB
//       await db.query(
//         'INSERT INTO messages (sender_id, receiver_id, message, is_read, timestamp) VALUES (?, ?, ?, 0, NOW())',
//         [senderId, receiverId, message]
//       );

//       // Emit to receiver
//       io.to(`user_${receiverId}`).emit('private_message', {
//         senderId,
//         receiverId,
//         message,
//         timestamp: new Date(),
//       });

//       // Update unread count for receiver
//       const [countRows] = await db.query(
//         'SELECT COUNT(*) AS unread FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = 0',
//         [receiverId, senderId]
//       );
//       const unreadCount = countRows[0].unread || 0;

//       io.to(`user_${receiverId}`).emit('unread_count', {
//         from: senderId,
//         count: unreadCount,
//       });

//       console.log(`📤 Message from ${senderId} to ${receiverId}: "${message}"`);
//     } catch (err) {
//       console.error('❌ DB Error while saving message:', err);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('🔴 User disconnected:', socket.id);
//   });
// });

// // ========================
// // 🚀 Start Server
// // ========================
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });










































































































require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ========================
// 🔗 SOCKET.IO SETUP
// ========================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend port
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// ========================
// 🧩 MIDDLEWARES
// ========================
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT"],
}));
app.use(express.json());

// ========================
// 🗄️ MySQL Connection Pool
// ========================
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'chatdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ========================
// 📜 Get Messages Between Two Users
// ========================
app.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `, [user1, user2, user2, user1]);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching messages:', err);
    res.status(500).json({ error: 'Database error fetching messages' });
  }
});

// ========================
// 🔢 Get Unread Message Count for Each User in Ladder
// ========================
app.get('/unread/:userId/:ladderId', async (req, res) => {
  const { userId, ladderId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT
          u.id AS player_id,
          u.name,
          u.phone,
          u.user_id,
          u.is_login,
          u.ladder_id,
          u.image,
          IFNULL(m.unread_count, 0) AS unread_count
      FROM users u
      LEFT JOIN (
          SELECT
              sender_id,
              COUNT(*) AS unread_count
          FROM messages
          WHERE receiver_id = ? AND is_read = 0
          GROUP BY sender_id
      ) AS m ON u.id = m.sender_id
      WHERE
          u.id != ?
          AND u.ladder_id = ?
      ORDER BY unread_count DESC
    `, [userId, userId, ladderId]);

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching unread counts:', err);
    res.status(500).json({ error: 'Database error fetching unread counts' });
  }
});

// ========================
// ✅ Mark Messages as Read
// ========================
app.put('/messages/read', async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'senderId and receiverId are required' });
  }

  try {
    await db.query(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [senderId, receiverId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error marking messages read:', err);
    res.status(500).json({ error: 'Database error updating read status' });
  }
});

// ========================
// ⚡ SOCKET.IO EVENTS
// ========================
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // 🧩 User joins their private room
  socket.on('join', (userId) => {
    if (!userId) return;

    // Store in memory
    onlineUsers.set(userId.toString(), socket.id);

    socket.join(`user_${userId}`);
    console.log(`📡 User ${userId} joined room user_${userId}`);

    // Broadcast updated online users to everyone
    io.emit('online_users', Array.from(onlineUsers.keys()));

    // Notify that specific user is online
    socket.broadcast.emit('user_online', userId);
  });

  // 💬 Private message event
  socket.on('private_message', async (data) => {
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) {
      console.log('⚠️ Invalid message payload:', data);
      return;
    }

    try {
      // Store in DB
      await db.query(
        'INSERT INTO messages (sender_id, receiver_id, message, is_read, timestamp) VALUES (?, ?, ?, 0, NOW())',
        [senderId, receiverId, message]
      );

      // Emit to receiver
      io.to(`user_${receiverId}`).emit('private_message', {
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      });

      // Update unread count for receiver
      const [countRows] = await db.query(
        'SELECT COUNT(*) AS unread FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = 0',
        [receiverId, senderId]
      );
      const unreadCount = countRows[0].unread || 0;

      io.to(`user_${receiverId}`).emit('unread_count', {
        from: senderId,
        count: unreadCount,
      });

      console.log(`📤 Message from ${senderId} to ${receiverId}: "${message}"`);
    } catch (err) {
      console.error('❌ DB Error while saving message:', err);
    }
  });

  // 🔌 Handle disconnect
  socket.on('disconnect', () => {
    let disconnectedUserId = null;

    // Find which user disconnected
    for (const [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        disconnectedUserId = uid;
        onlineUsers.delete(uid);
        break;
      }
    }

    console.log(`🔴 User disconnected: ${disconnectedUserId || socket.id}`);

    if (disconnectedUserId) {
      // Broadcast updated list
      io.emit('online_users', Array.from(onlineUsers.keys()));

      // Notify that user went offline
      io.emit('user_offline', disconnectedUserId);
    }
  });
});

// ========================
// 🚀 Start Server
// ========================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});