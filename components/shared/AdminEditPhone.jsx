

// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { editUserDetails } from "@/redux/slices/userSlice"; 
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";

// const AdminEditPhone = () => {
//   const dispatch = useDispatch();
//   const { user, loading, successMessage, error } = useSelector(
//     (state) => state.user
//   );

//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [open, setOpen] = useState(false); 
//   const [dialogMessage, setDialogMessage] = useState(""); 
//   const [dialogTitle, setDialogTitle] = useState("Success"); 
//   const [submitted, setSubmitted] = useState(false); // ✅ track button click

//   useEffect(() => {
//     if (user?.phone) setPhone(user.phone);
//     if (user?.name) setName(user.name);
//   }, [user]);

//   // ✅ Dialog only when button clicked + API response aata hai
//   useEffect(() => {
//     if (submitted && successMessage) {
//       setDialogTitle("Success");
//       setDialogMessage(successMessage);
//       setOpen(true); // ✅ open after success
//       setSubmitted(false);
//     }
//     if (submitted && error) {
//       setDialogTitle("Error");
//       setDialogMessage(error);
//       setOpen(true); // ✅ open after error
//       setSubmitted(false);
//     }
//   }, [successMessage, error, submitted]);

//   const handleEdit = () => {
//     if (!name.trim() || !user) return;

//     setSubmitted(true); // ✅ button click track
//     dispatch(editUserDetails({ id: user.id, user_id: user.user_id, name, phone }));
//   };

//   return (
//     <div className="w-full p-4">
//       <h2 className="font-semibold text-gray-800 sm:text-base sm:text-start text-center mb-3">
//         Admin Contact
//       </h2>

//       <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
//         <div className="flex flex-col flex-1">
//           <label className="font-semibold text-blue-900">Fullname</label>
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="h-10 rounded-none border border-gray-400 px-3 text-sm"
//             placeholder="Enter name"
//           />
//         </div>
//         <div className="flex flex-col flex-1">
//           <label className="font-semibold text-blue-900">Phone</label>
//           <Input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="h-10 rounded-none border border-gray-400 px-3 text-sm"
//             placeholder="Enter phone number"
//           />
//         </div>

//         <Button
//           onClick={handleEdit}
//           disabled={loading}
//           className="w-full sm:w-28 h-10 mt-5 bg-blue-900 rounded-none text-white font-medium hover:bg-blue-700 transition-all cursor-pointer"
//         >
//           {loading ? "Updating..." : "Edit"}
//         </Button>
//       </div>

//       {/* ✅ Dialog only after edit + API response */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{dialogTitle}</DialogTitle>
//             <DialogDescription>
//               {dialogMessage || "Update successful!"}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button onClick={() => setOpen(false)} className="bg-blue-900 text-white">
//               OK
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminEditPhone;


// ================== responsive

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { editUserDetails } from "@/redux/slices/userSlice"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminEditPhone = () => {
  const dispatch = useDispatch();
  const { user, loading, successMessage, error } = useSelector(
    (state) => state.user
  );

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false); 
  const [dialogMessage, setDialogMessage] = useState(""); 
  const [dialogTitle, setDialogTitle] = useState("Success"); 
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (submitted && successMessage) {
      setDialogTitle("Success");
      setDialogMessage(successMessage);
      setOpen(true);
      setSubmitted(false);
    }
    if (submitted && error) {
      setDialogTitle("Error");
      setDialogMessage(error);
      setOpen(true);
      setSubmitted(false);
    }
  }, [successMessage, error, submitted]);

  const handleEdit = () => {
    if (!name.trim() || !user) return;

    setSubmitted(true);
    dispatch(editUserDetails({ id: user.id, user_id: user.user_id, name, phone }));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <h2 className="font-semibold text-gray-800 text-lg sm:text-xl text-center sm:text-left mb-4">
        Admin Contact
      </h2>

      {/* ✅ Responsive form layout */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Name Field */}
        <div className="flex flex-col flex-1">
          <label className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
            Full Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-md border border-gray-400 px-3 text-sm sm:text-base"
            placeholder="Enter name"
          />
        </div>

        {/* Phone Field */}
        <div className="flex flex-col flex-1">
          <label className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
            Phone
          </label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 rounded-md border border-gray-400 px-3 text-sm sm:text-base"
            placeholder="Enter phone number"
          />
        </div>

        {/* Button */}
        <div className="flex w-full lg:w-auto justify-center lg:items-end">
          <Button
            onClick={handleEdit}
            disabled={loading}
            className="w-full sm:w-32 h-11 mt-2 sm:mt-0 bg-blue-900 rounded-md text-white font-medium hover:bg-blue-700 transition-all"
          >
            {loading ? "Updating..." : "Edit"}
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogMessage || "Update successful!"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              className="bg-blue-900 text-white hover:bg-blue-700"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEditPhone;











// ========================== ==>


//   "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { editUserDetails } from "@/redux/slices/userSlice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";

// const AdminEditPhone = ({ disabled = false }) => {
//   const dispatch = useDispatch();
//   const { user, loading, successMessage, error } = useSelector(
//     (state) => state.user
//   );

//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [open, setOpen] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState("");
//   const [dialogTitle, setDialogTitle] = useState("Success");
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (user?.phone) setPhone(user.phone);
//     if (user?.name) setName(user.name);
//   }, [user]);

 
//   useEffect(() => {
//     if (submitted && successMessage) {
//       setDialogTitle("Success");
//       setDialogMessage(successMessage);
//       setOpen(true);
//       setSubmitted(false);
//     }
//     if (submitted && error) {
//       setDialogTitle("Error");
//       setDialogMessage(error);
//       setOpen(true);
//       setSubmitted(false);
//     }
//   }, [successMessage, error, submitted]);

//   const handleEdit = () => {
//     if (!name.trim() || !user) return;

//     setSubmitted(true);
//     dispatch(editUserDetails({ id: user.id, user_id: user.user_id, name, phone }));
//   };

//   return (
//     <div className="w-full p-4">
//       <h2 className="font-semibold text-gray-800 sm:text-base sm:text-start text-center mb-3">
//         Admin Contact
//       </h2>

//       <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
//         <div className="flex flex-col flex-1">
//           <label className="font-semibold text-blue-900">Fullname</label>
//           <Input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             disabled={disabled}
//             className="h-10 rounded-none border border-gray-400 px-3 text-sm"
//             placeholder="Enter name"
//           />
//         </div>
//         <div className="flex flex-col flex-1">
//           <label className="font-semibold text-blue-900">Phone</label>
//           <Input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             disabled={disabled}
//             className="h-10 rounded-none border border-gray-400 px-3 text-sm"
//             placeholder="Enter phone number"
//           />
//         </div>

//         <Button
//           onClick={handleEdit}
//           // disabled={loading}
//            disabled={loading || disabled}
//           className="w-full sm:w-28 h-10 mt-5 bg-blue-900 rounded-none text-white font-medium hover:bg-blue-700 transition-all cursor-pointer"
//         >
//           {loading ? "Updating..." : "Edit"}
//         </Button>
//       </div>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{dialogTitle}</DialogTitle>
//             <DialogDescription>
//               {dialogMessage || "Update successful!"}
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button onClick={() => setOpen(false)} className="bg-blue-900 text-white">
//               OK
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminEditPhone;









// ===================== mobile number validate

  // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phone)) {
    //   toast.error("Phone must be exactly 10 digits!");
    //   return;
    // }