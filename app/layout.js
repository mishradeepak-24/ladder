
// app/layout.js (or wherever your Redux Provider is)
"use client";
import './globals.css'
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <body>
         <Provider store={store}>
           <PersistGate loading={null} persistor={persistor}>
            {children}
           </PersistGate>
         </Provider>
       </body>
     </html>
  );
}

