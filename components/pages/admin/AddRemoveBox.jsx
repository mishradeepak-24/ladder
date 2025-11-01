// // app/components/AddRemoveBox.tsx
// 'use client';

// import React from 'react';
// import { useState } from "react";
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import RemovePlayerBox from './RemovePlayerBox';
// import AddPlayer from './AddPlayer';
// import { Button } from '@/components/ui/button';

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
// };

// const AddRemoveBox = () => {

//   const [open, setOpen] = useState(false);

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeIn}
//       transition={{ duration: 0.5 }}
//       className="border border-gray-300 rounded-md py-8 px-4 w-full bg-white shadow-sm space-y-2"
//     >
//       <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
//         <span className="text-lg font-medium text-black">Add</span>

//        {/* <Button onClick={() => setOpen(true)}>Add Player</Button> */}
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors" onClick={() => setOpen(true)}>
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent>
//           <AddPlayer onClose={() => setOpen(false)} />
//         </DialogContent>
//         </Dialog>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <span className="text-lg font-medium text-black">Remove</span>

//         <Dialog>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[400px]">
//             <RemovePlayerBox />
//           </DialogContent>
//         </Dialog>
//       </div>
//     </motion.div>
//   );
// };

// export default AddRemoveBox;

// ================================== ===>

// app/components/AddRemoveBox.tsx
// 'use client';

// import React, { useState } from "react";
// import { motion } from 'framer-motion';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import RemovePlayerBox from './RemovePlayerBox';
// import AddPlayer from './AddPlayer';

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
// };

// const AddRemoveBox = () => {

//   const [addOpen, setAddOpen] = useState(false);
//   const [removeOpen, setRemoveOpen] = useState(false); // ✅ lifted state

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeIn}
//       transition={{ duration: 0.5 }}
//       className="border border-gray-300 rounded-md py-8 px-4 w-full bg-white shadow-sm space-y-2"
//     >
//       <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
//         <span className="text-lg font-medium text-black">Add</span>

//         <Dialog open={addOpen} onOpenChange={setAddOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent>
//             <AddPlayer onClose={() => setAddOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <span className="text-lg font-medium text-black">Remove</span>

//         <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[400px]">
//             {/* ✅ Pass onClose prop to close dialog on success */}
//             <RemovePlayerBox onClose={() => setRemoveOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//     </motion.div>
//   );
// };

// export default AddRemoveBox;

// ====================== ==>

//   'use client';

// import React, { useState } from "react";
// import { motion } from 'framer-motion';
// import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import RemovePlayerBox from './RemovePlayerBox';
// import AddPlayer from './AddPlayer';
// import MovePlayerBox from './MovePlayerBox'; // ✅ Your Move dialog component
// import { useSelector } from "react-redux";

// const fadeIn = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1 },
// };

// const AddRemoveBox = () => {

//   const [addOpen, setAddOpen] = useState(false);
//   const [removeOpen, setRemoveOpen] = useState(false);
//   const [moveOpen, setMoveOpen] = useState(false); // ✅ new state for Move

//   const user = useSelector((state) => state?.user?.user || {});
//   const ladderId = user?.ladder_id;

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={fadeIn}
//       transition={{ duration: 0.5 }}
//       className="border border-gray-300 rounded-md py-8 px-4 w-full bg-white shadow-sm space-y-4"
//     >
//       {/* Add Section */}
//       <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
//         <span className="text-lg font-medium text-black">Add</span>
//         <Dialog open={addOpen} onOpenChange={setAddOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent>
//             <AddPlayer onClose={() => setAddOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Remove Section */}
//       <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
//         <span className="text-lg font-medium text-black">Remove</span>
//         <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[400px]">
//             <RemovePlayerBox onClose={() => setRemoveOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Move Section */}
//       <div className="flex items-center justify-between gap-4 ">
//         <span className="text-lg font-medium text-black">Move</span>
//         <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
//           <DialogTrigger asChild>
//             <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
//               select
//             </button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[400px]">
//             <MovePlayerBox onCancel={() => setMoveOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//     </motion.div>
//   );
// };

// export default AddRemoveBox;










// =================== ==>

  "use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import RemovePlayerBox from "./RemovePlayerBox";
import AddPlayer from "./AddPlayer";
import MovePlayerBox from "./MovePlayerBox";
import { useSelector } from "react-redux";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const AddRemoveBox = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  const user = useSelector((state) => state?.user?.user || {});
  const ladderId = user?.ladder_id;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
      className="border border-gray-300 rounded-md py-8 px-4 w-full bg-white shadow-sm space-y-4"
    >
      {/* Add */}
      <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
        <span className="text-lg font-medium text-black">Add</span>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
              select
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="sr-only">Add Player</DialogTitle>
            <AddPlayer onClose={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Remove */}
      <div className="flex items-center justify-between gap-4 border-b-2 pb-2">
        <span className="text-lg font-medium text-black">Remove</span>
        <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
          <DialogTrigger asChild>
            <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
              select
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogTitle className="sr-only">Remove Player</DialogTitle>
            <RemovePlayerBox onClose={() => setRemoveOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Move */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-black">Move</span>
        <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
          <DialogTrigger asChild>
            <button className="text-sm text-blue-700 underline hover:text-blue-900 transition-colors">
              select
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogTitle className="sr-only">Move Player</DialogTitle>
            <MovePlayerBox onCancel={() => setMoveOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
};

export default AddRemoveBox;
