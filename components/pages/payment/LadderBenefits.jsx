// ===================== ==> 20/08/2025 Prakash code

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import topLogo from "@/public/topLogo.png";
import Image from "next/image";

const benefits = [
  {
    title: "24/7 Transparent Rankings",
    points: [
      "Instant, real-time updates visible to all members.",
      "Creates continuous motivation and a buzz around the club.",
    ],
  },
  {
    title: "Self-Managing & Tamper-Proof",
    points: [
      "Players update their own results — no admin intervention.",
      "Only the winning player can move themselves up, and the beaten player is instantly notified by email.",
      "Activity log ensures every result is visible to all.",
    ],
  },
  {
    title: "Comms Made Easy",
    points: [
      "With one click within the app, players may request any player’s phone number, copy and then paste it directly into their favourite comms app in order to organise games.",
      "This ease of comms is central to encouraging players to fix up games with minimal 	effort and so increase play and ultimately, club revenue.",
    ],
  },
  {
    title: "Club Community Feel",
    points: [
      "Players can upload personal avatars, giving the ladder a friendly, close-knit club feel.",
    ],
  },
  {
    title: "Team Selection",
    points: [
      "Access to individual playing statistics adds an extra competitive edge.",
      "Stats and rankings can be used by the club for team selection and seeding in internal competitions.",
    ],
  },
  {
    title: "Boosts Participation & Club Revenue",
    points: [
      "More frequent challenges = more court bookings.",
      "Keeps top players engaged and inspires lower-ranked members to climb.",
    ],
  },
  {
    title: "Simple Setup",
    points: [
      "Import players from a CSV file in seconds.",
      "Players can add phone numbers, upload photos, and update their availability.",
    ],
  },
  {
    title: "Customisable & Flexible",
    points: [
      "Adjustable ladder sizes, challenge rules, and colour themes (“skins”).",
      "Works for tennis, squash, padel, badminton, table tennis, or any ladder-based sport.",
    ],
  },
];

const whyClubsLoveIt = [
  "Eliminates admin headaches.",
  "Increases competitive play year-round.",
  "Builds a sense of community and connection.",
  "Fair, transparent, and always accurate.",
];

const cost = [
  "Just £12 per player per year (equivalent to £1 a month) — easily covered by a small increase in court fees.",
];

export default function LadderBenefits() {
  return (
    <main className="border relative border-zinc-500 rounded-xl">
      <div className="absolute bottom-[-42]  w-full flex items-center justify-center sm:justify-start sm:left-[38%] sm:bottom-[-40]">
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
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-xl border border-gray-200 shadow-md bg-yellow-100">
          <CardContent className="p-6 space-y-6">
            {/* Intro Text */}
            <p className="text-gray-800 leading-relaxed">
              <span className="font-bold text-gray-900">SportsLaddersPro</span>{" "}
              delivers a{" "}
              <span className="font-semibold">
                fully online, tamper-proof ladder system
              </span>{" "}
              that keeps your club's competition fresh, fair, and always up to
              date — with{" "}
              <span className="font-semibold">zero ongoing admin.</span>
            </p>

            {/* Benefits */}
            <div>
              <h2 className="font-bold text-lg mb-3">Key Benefits</h2>
              <ol className="space-y-5 list-decimal list-inside text-gray-800">
                {benefits.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold">{item.title}</span>
                    {item.points.length > 0 && (
                      <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                        {item.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>

              {/* Why Clubs Love It */}
              <ul className="mt-6">
                <li>
                  <span className="font-semibold">Why Clubs Love It</span>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                    {whyClubsLoveIt.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </li>
              </ul>

              {/* Cost */}
              <ul className="mt-6">
                <span className="font-semibold">Cost</span>
                {cost.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}
