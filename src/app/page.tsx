"use client";
import WordGame from "@/components/WordGame";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoMdClose } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { useState } from "react";
export default function Home() {
  const [showSlider, setShowSlider] = useState(false);

  const toggleSlider = () => setShowSlider((prev) => !prev);
  const { address } = useAccount();
  return (
    <>
      {address && <WordGame />}
      {!address && (
        <div className="container flex justify-center items-center mx-auto">
          <div className="w-[360px] h-[620px] border-4 border-gray-700 rounded-[2rem] shadow-2xl mx-auto p-4 bg-white flex flex-col justify-between relative overflow-hidden">
            <motion.div
              className="flex flex-col items-center text-center justify-center flex-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {/* Somnia */}
              <div className="key-chart flex gap-1">
                {["S", "O", "M", "N", "I","A"].map((letter, idx) => (
                  <motion.div
                    key={`somnia-${idx}`}
                    className="text-xs text-purple-500 font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

              {/* WORDGAME */}
              <div className="key-chart flex gap-1">
                {["W", "O", "R", "D", "G", "A", "M", "E"].map((letter, idx) => (
                  <motion.div
                    key={`word-${idx}`}
                    className="text-xs text-blue-500 font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.05 * idx,
                    }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

          
              <div className="key-chart flex gap-1">
                {[ "F", "A", "S", "T" ,"O","N"].map((letter, idx) => (
                  <motion.div
                    key={`lets-${idx}`}
                    className="text-xs text-red-400 font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.05 * idx,
                    }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

              <div className="key-chart flex gap-1">
                {["F","A","R","C","A","S","T","E","R"].map((letter, idx) => (
                  <motion.div
                    key={`lets-${idx}`}
                    className="text-xs text-red-400 font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.05 * idx,
                    }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Button to show the slider */}
            <div className="flex justify-center z-10">
              <button
                onClick={toggleSlider}
                className="retro rbtn-small text-xs"
              >
                Let's Play
              </button>
            </div>

            {/* Bottom slider panel inside card */}
            <AnimatePresence>
              {showSlider && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 h-[80%] left-0 w-full bg-gray-100 border-t border-gray-300 shadow-inner rounded-b-[2rem] p-4 z-20"
                >
                  <div className="relative mb-2">
                    {/* Close button */}
                    <button
                      onClick={toggleSlider}
                      className="absolute top-0 right-0 text-gray-500 text-xl"
                    >
                      <IoMdClose />
                    </button>

                    {/* Profile Section */}
                    <div className="flex items-center mt-4 space-y-2">
                      {/* Profile Image */}
                      <img
                        src="https://avatars.githubusercontent.com/u/82640789?v=4" 
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-gray-300 shadow"
                      />

                      {/* Name */}
                      <p className="text-xs ml-2 font-bold text-gray-700">
                        Nikku.Dev
                      </p>

                      {/* Social Links */}
                      <div className="flex gap-2 mb-2 ml-2">
                        <a
                          href="https://x.com/itsNikku876"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTwitter color="blue" />
                        </a>
                        <a
                          href="https://github.com/Kali-Decoder"
                          target="_blank"
                          rel="noreferrer"
                        ></a>
                        <FaGithub color="black" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-serif text-black">
                    <span className="font-bold">Message from the Founder:</span>
                    <br />
                    Hey there! I'm thrilled to welcome you to this little{" "}
                    <span className="font-bold">brain-boosting world</span> we
                    built. It's a mix of <span className="font-bold">fun</span>,{" "}
                    <span className="font-bold">strategy</span>, and a dash of{" "}
                    <span className="font-bold">competition</span>. Play at your
                    pace, challenge your mind, and let your{" "}
                    <span className="font-bold">STT fuel the thrill</span>.
                    Scroll down for how to get started — and most importantly,{" "}
                    <span className="font-bold">enjoy the game!</span>
                  </p>
                  <div className="text-xs font-serif mt-4 text-black space-y-2">
                    <p className="font-bold">How to Play Word Play 🧠</p>
                    <ul className="list-decimal list-inside space-y-1">
                      <li>
                        <span className="font-bold">Connect your wallet</span>{" "}
                        to get started.
                      </li>
                      <li>
                        <span className="font-bold">Deposit STT</span> and
                        click on <span className="font-bold">"Start Play"</span>
                        .
                      </li>
                      <li>
                        You’ll be given a{" "}
                        <span className="font-bold">five-letter word</span> to
                        guess.
                      </li>
                      <li>
                        The faster you guess the word{" "}
                        <span className="font-bold">without losing moves</span>,
                        the higher your{" "}
                        <span className="font-bold">multiplier reward</span> on
                        your deposit.
                      </li>
                      <li>
                        <span className="text-green-600 font-bold">Green</span>{" "}
                        = Correct letter in the correct position.
                      </li>
                      <li>
                        <span className="text-yellow-500 font-bold">
                          Yellow
                        </span>{" "}
                        = Correct letter but in the wrong position.
                      </li>
                      <li>
                        That’s it! Once the game ends,{" "}
                        <span className="font-bold">share your victory</span>{" "}
                        with your friends on Farcaster 🚀
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-center items-center mt-4">
                    <ConnectButton/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
