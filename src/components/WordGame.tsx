"use client";
import { useDataContext } from "@/context/DataContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useBalance } from "wagmi";
import { motion } from "framer-motion";
const words = [
  "CHAIN",
  "BLOCK",
  "MINTS",
  "WALKS",
  "NODES",
  "COINS",
  "LAYER",
  "ETHER",
  "BYTES",
  "FEEDS",
  "PROOF",
  "VOTER",
  "STATE",
  "TRUST",
  "VALID",
  "SIGNS",
  "BUYER",
  "DEPTH",
  "FIATS",
  "VAULT",
  "VALUE",
  "LOGIC",
  "ASSET",
  "OWNER",
  "DIGIT",
  "CRISP",
  "STOCK",
  "TRADE",
  "CLOUD",
  "CODES",
  "MONEY",
  "TOKES",
  "CRASH",
  "HEDGE",
  "TOKEN",
  "LEARN",
  "SMART",
  "PRICE",
  "TREND",
  "FUNDS",
  "YIELD",
  "RISKS",
  "CLEAR",
  "MERGE",
  "SPLIT",
];

const maxAttempts = 6;

function getWarpcastShareLink({
  word,
  didWin,
  multiplier,
  depositAmount,
}: {
  word: string;
  didWin: boolean;
  multiplier: number;
  depositAmount: number;
}): string {
  const baseUrl = "https://warpcast.com/~/compose";
  const embedUrl = "https://farcaster.xyz/miniapps/lnPBREEfTQ-b/monad-word-play";

  const message = didWin
    ? `🎉 I just won ${
        depositAmount * multiplier
      } $STT in Somnia Word Game!\nBet: ${depositAmount} $MON x${multiplier}`
    : `😢 I lost the Somnia Word Game.\nThe correct word was: ${word}\nBet: Deposit Amount :${depositAmount} $MON x multiplier : ${multiplier}`;

  const shareUrl = `${baseUrl}?text=${encodeURIComponent(
    message + "\nPlay now 👉"
  )}&embeds[]=${encodeURIComponent(embedUrl)}`;

  return shareUrl;
}

export default function WordGame() {
  const [targetWord, setTargetWord] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [board, setBoard] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});
  const [multiplier, setMultiplier] = useState(5);
  const [gameStart, setGameStart] = useState(false);
  const [depositAmount, setDepositAmout] = useState(0);
  const [isClaim, setIsClaim] = useState(false);
  const { depositPlay, resolveGame, claimReward } = useDataContext();
  const { address } = useAccount();
  const [shareWarpUrl,setShareWarpUrl] = useState("");
  const { data, isError, isLoading } = useBalance({
    address,
    watch: true,
  });
  const formatted = data?.formatted
    ? parseFloat(data.formatted).toFixed(2)
    : "0.00";
  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words?.length)];
    setTargetWord(randomWord);
    setBoard(
      Array(maxAttempts)
        .fill(null)
        .map(() => Array(5).fill(""))
    );
  }, []);

  const handleSubmit = async () => {
    if (currentGuess?.length !== 5) {
      setMessage("Guess must be 5 letters long.");
      return;
    }

    if (attempts >= maxAttempts) {
      setMessage("No more attempts left.");
      return;
    }

    const newBoard = [...board];
    const row = newBoard[attempts];
    const guess = currentGuess.toUpperCase();
    const targetCounts: { [key: string]: number } = {};

    for (const letter of targetWord) {
      targetCounts[letter] = (targetCounts[letter] || 0) + 1;
    }

    const rowClasses: string[] = Array(5).fill("absent");
    const newUsedKeys = { ...usedKeys };

    for (let i = 0; i < 5; i++) {
      row[i] = guess[i];
      if (guess[i] === targetWord[i]) {
        rowClasses[i] = "correct";
        targetCounts[guess[i]]--;
        newUsedKeys[guess[i]] = "correct";
      }
    }

    for (let i = 0; i < 5; i++) {
      if (rowClasses[i] !== "correct" && targetCounts[guess[i]]) {
        rowClasses[i] = "present";
        targetCounts[guess[i]]--;
        if (newUsedKeys[guess[i]] !== "correct") {
          newUsedKeys[guess[i]] = "present";
        }
      } else if (!newUsedKeys[guess[i]]) {
        newUsedKeys[guess[i]] = "absent";
      }
    }

    setUsedKeys(newUsedKeys);
    setBoard(newBoard);
    setAttempts(attempts + 1);
    setMultiplier(5 - attempts);
    setCurrentGuess("");

    if (guess === targetWord) {
      toast.success("🎉 Congratulations! You guessed the word.");
      const id = localStorage.getItem("betID");
      const _depositAmount = localStorage.getItem("depositAmount");
      let status = await resolveGame(Number(id), 1);

      let shareUrl = getWarpcastShareLink({
        word: targetWord,
        didWin: true,
        multiplier,
        depositAmount: Number(_depositAmount),
      });
      setShareWarpUrl(shareUrl);
      if (status) {
        setGameStart(false);
        setIsClaim(true);
      }
    } else if (attempts + 1 >= maxAttempts) {
      toast.error(`😢 Game Over! The word was ${targetWord}.`);
      const id = localStorage.getItem("betID");
      const _depositAmount = localStorage.getItem("depositAmount");

      let status = await resolveGame(Number(id), 0);
      let shareUrl = getWarpcastShareLink({
        word: targetWord,
        didWin: false,
        multiplier,
        depositAmount: Number(_depositAmount),
      });
      setShareWarpUrl(shareUrl);
      if (status) {
        setGameStart(false);
        setIsClaim(true);
      } else {
        setGameStart(false);
        setIsClaim(true);
      }
    } else {
      // toast.error(`Wrong Guess Multiplier decrease ${multiplier}`);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) {
      toast.error("Add Some Amount");
      return;
    }
    let status = await depositPlay(depositAmount);
    if (status) {
      setGameStart(true);
    } else {
      setGameStart(false);
    }
  };
  const resetGame = () => {
    const emptyBoard = Array.from({ length: maxAttempts }, () =>
      Array(5).fill("")
    ); // Clear the board
    setBoard(emptyBoard);
    setCurrentGuess("");
    setAttempts(0);
    setUsedKeys({});
    setMessage("");
    setMultiplier(5);

    toast.info("Game reset. Ready to start again!");
  };

  const handleClaim = async () => {
    let id = localStorage.getItem("betID");
    let status = await claimReward(Number(id));
    if (status) {
      setIsClaim(false);
      setGameStart(false);
    } else {
      setIsClaim(false);
    }
    resetGame();
  };

  return (
    <motion.div
      className="w-[375px] h-[667px] mx-auto border-[10px] border-black rounded-[2rem] shadow-xl overflow-hidden bg-white flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="h-10 bg-black w-full flex justify-center items-center text-green-400 text-xs font-semibold">
        {address?.slice(0, 6) + "..." + address?.slice(-4)}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2 border-4 p-4 mb-6 justify-center">
          {board.map((row, rowIndex) =>
            row.map((letter, i) => {
              const className = (() => {
                if (rowIndex >= attempts) return "border bg-white";
                const currentLetter = board[rowIndex][i];
                const targetLetter = targetWord[i];
                if (currentLetter === targetLetter)
                  return "bg-green-500 text-white";
                else if (targetWord.includes(currentLetter))
                  return "bg-yellow-400 text-white";
                return "bg-gray-300 text-black";
              })();
              return (
                <div
                  key={`${rowIndex}-${i}`}
                  className={`text-center text-xl font-bold rounded w-12 h-12 flex items-center justify-center ${className}`}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col gap-2 mb-2">
          {gameStart ? (
            <>
              <input
                type="text"
                maxLength={5}
                value={currentGuess}
                className="text-xs px-2 py-2 border-2  rounded"
                onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                placeholder="Enter your guess"
              />
              <button
                onClick={handleSubmit}
                className="retro rbtn-small text-xs mb-4"
              >
                Try
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={depositAmount}
                name="depositAmount"
                className="text-xs px-2 py-2 border-2  rounded"
                onChange={(e) => setDepositAmout(e.target.value)}
                placeholder="Place your amount to play"
              />
              <button
                onClick={handleDeposit}
                className="retro rbtn-small text-xs mb-4"
              >
                Start Play
              </button>
            </>
          )}
          {isClaim && (
            <>
              <button
                onClick={handleClaim}
                className="retro rbtn-small text-xs mb-4"
              >
                claim Amount
              </button>

             
            </>
          )}
           <button className="retro rbtn-small text-xs mb-4">
                <a
                  href={shareWarpUrl}
                  target="_blank"
                  className="text-xs"
                  rel="noopener noreferrer"
                >
                  Share on Farcaster
                </a>
              </button>
        </div>

        <p className="text-xs text-red-400 mb-2">{message}</p>

        <div className="grid grid-cols-13 gap-1 text-xs">
          {[...Array(26)].map((_, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
              <div
                key={letter}
                className={`text-center border rounded p-1 ${
                  usedKeys[letter] || "bg-white"
                }`}
              >
                {letter}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-8 mb-4">
          <h1 className="text-xs font-bold uppercase">Winning Multiplier</h1>
          <div className="bg-blue-400 text-white px-3 py-1 rounded font-bold text-xs">
            {multiplier}x
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xs font-bold uppercase">Max Attempts</h1>
          <div className="bg-red-400 text-white px-3 py-1 rounded font-bold text-xs">
            {maxAttempts}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xs font-bold uppercase">Balance</h1>
          <div className="bg-red-400 text-white px-3 py-1 rounded font-bold text-xs">
            {formatted} {data?.symbol}
          </div>
        </div>
        <div className="flex justify-center items-center mt-4">
          <ConnectButton />
        </div>
      </div>
    </motion.div>
  );
}
