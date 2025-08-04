"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { useEthersSigner } from "@/utils/signer";
import { ethers,Contract } from "ethers";
import { toast } from "react-hot-toast";
import { DiceManiaABI, DiceManiaAddress } from "@/constant";
interface DataContextProps {
  depositPlay: (amount: number) => Promise<boolean>;
  resolveGame: (_id: number, _multiplier: number) => Promise<boolean>;
  claimReward: (_id: number) => Promise<boolean>;
}
interface DataContextProviderProps {
  children: ReactNode;
}

// Context initialization
const DataContext = React.createContext<DataContextProps | undefined>(
  undefined
);

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const { chain, address } = useAccount();
  const [activeChain, setActiveChainId] = useState<number | undefined>(
    chain?.id
  );
  useEffect(() => {
    setActiveChainId(chain?.id);
  }, [chain?.id]);

  const signer = useEthersSigner({ chainId: activeChain });

  const getContractInstance = async (
    contractAddress: string,
    contractAbi: any
  ): Promise<Contract | undefined> => {
    try {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      return contractInstance;
    } catch (error) {
      console.log("Error in deploying contract");
      return undefined;
    }
  };

  const depositPlay = async (amount: number) => {
    const id = toast.loading("Starting your game...");
    try {
      const mainContract = await getContractInstance(
        DiceManiaAddress,
        DiceManiaABI
      );

      if (mainContract) {
        // Convert to wei (assuming amount is in ETH)
        const valueInWei = ethers.utils.parseEther(amount.toString());
        let tx = await mainContract.deposit(valueInWei, {
          value: valueInWei,
        });
        await tx.wait();
        let betID = await mainContract.userID();
        betID = +betID.toString();
        console.log("Bet iD ",betID);
        // 🔐 Save to localStorage
        localStorage.setItem("betID", (betID-1).toString());
        localStorage.setItem("depositAmount",amount.toString());
        toast.success("Game Started", { id });
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Some issue in backend", { id });
      return false;
    }
  };

  const resolveGame = async (_id: number, _multiplier: number) => {
    const toastId = toast.loading("Resolving game...");
    const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const RPC_URL = "http://dream-rpc.somnia.network/";
    try {
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      console.log(provider,wallet,PRIVATE_KEY);
      const contract = new ethers.Contract(
        DiceManiaAddress,
        DiceManiaABI,
        wallet
      );

      console.log(contract);

      const tx = await contract.resolve(_id, _multiplier);
      await tx.wait();
      toast.success("Game resolved successfully", { id: toastId });
      return true;
    } catch (error) {
      console.error("Resolve error:", error);
      toast.error("Failed to resolve the game", { id: toastId });
      return false;
    }
  };

  const claimReward = async (_id: number) => {
    const toastId = toast.loading("Claiming reward...");

    try {
      const mainContract = await getContractInstance(
        DiceManiaAddress,
        DiceManiaABI
      );

      if (mainContract) {
        const tx = await mainContract.claimReward(_id, {
          value: 0,
        });
        await tx.wait();
        toast.success("Reward claimed!", { id: toastId });
        return true;
      }
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("Nothing to Claim ", { id: toastId });
      return false;
    }
  };

  useEffect(() => {
    if (!signer) return;
  }, [signer, activeChain]);

  return (
    <DataContext.Provider
      value={{
        depositPlay,
        resolveGame,
        claimReward,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook to use DataContext
export const useDataContext = (): DataContextProps => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
};

export default DataContextProvider;
