
"use client";
import DemoRegister from '@/components/demo/DemoRegister';
import { useSearchParams } from "next/navigation";
import React from 'react';

const DemoPageRouter = () => {
  const searchParams = useSearchParams();
  const demoType = searchParams.get("demoType");

  // Mapping demoType → ladderId
  const demoMap = {
    winlose: 1,
    best3: 154,
    best5: 155,
  };

  const ladderId = demoMap[demoType] || 1; // default 1 (winlose)

  return (
    <div>
      <DemoRegister ladderId={ladderId} />
    </div>
  );
};

export default DemoPageRouter;
