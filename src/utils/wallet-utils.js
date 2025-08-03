import { chainArray, transportsObject } from "./chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig } from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
const projectId = "87106bd465234d097b8a51ba585bf799";
export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, metaMaskWallet],
    },
    {
      groupName: "Other",
      wallets: [walletConnectWallet, injectedWallet],
    },
    farcasterFrame(),
  ],
  {
    appName: "Scaffold",
    projectId: projectId,
  }
);

export const wagmiConfig = createConfig({
  connectors,
  chains: chainArray,
  transports: transportsObject,
});
