import { useSwitchChain } from "wagmi";
import { morphHolesky } from "@/config/web3";
import { toast } from "sonner";

export function useNetwork() {
  const { switchChain, isPending } = useSwitchChain({
    onSuccess() {
      toast.success("Network switched successfully");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const switchToMorphHolesky = async () => {
    try {
      await switchChain({ chainId: morphHolesky.id });
    } catch (error: any) {
      console.error("Network switch error:", error);
      toast.error(error.message || "Failed to switch network");
    }
  };

  return {
    switchToMorphHolesky,
    isSwitching: isPending,
  };
}
