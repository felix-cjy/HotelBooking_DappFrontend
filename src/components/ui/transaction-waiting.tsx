import { Loader2 } from "lucide-react";

interface TransactionWaitingProps {
  message?: string;
}

export function TransactionWaiting({
  message = "Waiting for transaction confirmation...",
}: TransactionWaitingProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
