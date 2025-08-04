"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig } from "wagmi";
import { http } from "viem";
import { somniaTestnet } from "viem/chains";
import { createStorage } from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import DataContextProvider from "@/context/DataContext";
import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

const config = createConfig({
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(),
  },
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  connectors: [farcasterFrame()],
});

const queryClient = new QueryClient();

const Providers = ({ children }) => {
  useEffect(() => {
    const init = async () => {
      try {
        // Only call this ONCE when UI is ready
        sdk.actions.ready();
        console.log("✅ Farcaster ready called");
      } catch (error) {
        console.error("❌ Failed to initialize Farcaster:", error);
      }
    };

    // If you have no loading state, call immediately
    init();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#6c54f8",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          modalSize="wide"
        >
          <DataContextProvider>{children}</DataContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
