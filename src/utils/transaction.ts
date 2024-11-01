import { toast } from "sonner";
import { Contract } from "ethers";

interface TransactionOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
  gasLimit?: number;
}

export async function handleTransaction(
  contract: Contract,
  method: string,
  args: any[],
  options: TransactionOptions = {}
) {
  const { onSuccess, onError, gasLimit = 500000 } = options;

  try {
    const tx = await contract[method](...args, { gasLimit });

    toast.loading("Please wait for transaction confirmation...");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      toast.success("Transaction successful!");
      onSuccess?.();
      return receipt;
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error: any) {
    console.error(`${method} error:`, error);
    toast.error(error.reason || error.message || "Transaction failed");
    onError?.(error);
    throw error;
  }
}
