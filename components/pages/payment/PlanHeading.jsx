"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LadderBenefits from "./LadderBenefits";
import Image from "next/image";
import topLogo from "@/public/topLogo.png"

export default function PlanHeading() {
  return (
    <>
      <main
        className="px-4 py-10 relative sm:px-8 md:px-12 lg:px-20 xl:px-32 max-w-5xl mx-auto min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/bgHome.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px", // adjust size of pattern
        }}
      >

        <div className=" absolute top-[-36]  w-full flex items-center justify-center sm:justify-start sm:left-[40%] left-[2%] sm:top-[-36]">
          <Image
            src={topLogo}
            alt="bghome"
            height={100}
            width={100}
            className="w-56 sm:w-56 md:w-56 lg:w-56 "
          />
        </div>

        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center bg-yellow-100/90 border border-yellow-300 p-8 rounded-lg shadow-md"
        >
          {/* TOP HEADING */}
          <h1 className="text-3xl border-b border-black sm:text-4xl font-bold tracking-wide text-gray-800 uppercase">
            Online Sports Ladders
          </h1>

          {/* SUB HEADING */}
          <p className="text-xl sm:text-3xl font-semibold text-gray-900">
            Create and Test for Free Now!
          </p>

          {/* UPLOAD SECTION */}
          <div className="bg-yellow-200 border border-yellow-400 p-6 rounded-lg space-y-4">
            <p className="text-lg sm:text-xl font-semibold">
              Upload an EXCEL CSV file of your players’ details
              <br /> to see exactly how it would look and feel for you.
            </p>

            <p className="font-semibold text-red-600">
              No CSV file to hand ? - Check out our "demo" ladder
            </p>

            <div className="flex justify-center">
              <Link
                href="/register-page"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-md text-lg transition"
              >
                Click Here
              </Link>
            </div>

            <p className="text-sm sm:text-base text-gray-800 italic">
              <span className="font-semibold">Note:</span> Your free ladder only
              allows you to test functionality of the top ten players listed
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center py-8"
        >
          {/* CONTACT */}
          <p className="text-gray-700 text-sm sm:text-base">
            Contact:{" "}
            <span className="underline text-blue-700 cursor-pointer">
              support@sportssolutionspro.com
            </span>
          </p>
        </motion.section>

        {/* BENEFITS SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className=" w-full"
        >
          <LadderBenefits />
        </motion.section>
      </main>
    </>
  );
}
