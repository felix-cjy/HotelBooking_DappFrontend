import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { toast } from "sonner";

export function useWeb3Connect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(),
    onSuccess() {
      console.log("Connection successful");
      toast.success("Wallet connected successfully!");
    },
    onError(error) {
      console.error("Connect error:", error);
      toast.error(error.message);
    },
  });
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    console.log("Connect button clicked");

    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask detected, attempting to connect...");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await connect();
        console.log("Connect function called");
      } else {
        console.log("MetaMask not found");
        toast.error("MetaMask not found. Please install MetaMask!");
      }
    } catch (error: any) {
      console.error("Connection error:", error);
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  return {
    address,
    isConnected,
    connect: handleConnect,
    disconnect,
  };
}
