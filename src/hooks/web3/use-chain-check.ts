import { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { morphHolesky } from "@/config/web3";
import { useNetwork } from "./use-network";
import { toast } from "sonner";

export function useChainCheck() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchToMorphHolesky, isSwitching } = useNetwork();

  useEffect(() => {
    if (isConnected && chainId !== morphHolesky.id) {
      toast.error("Please switch to Morph Holesky network");
      switchToMorphHolesky();
    }
  }, [chainId, isConnected]);

  return {
    isCorrectChain: chainId === morphHolesky.id,
    isSwitching,
  };
}
