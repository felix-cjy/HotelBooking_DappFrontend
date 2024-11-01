"use client";

import Image from "next/image";
import { useWeb3Connect } from "@/hooks/web3/use-connect";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./Modetoggle";
import { useMounted } from "@/hooks/use-mounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Nav() {
  const { isConnected, address, connect, disconnect } = useWeb3Connect();
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* 左侧 Logo */}
        <div className="w-[200px]">
          <Image
            src="/Morph_mascot.PNG"
            alt="Morph Mascot"
            width={130}
            height={130}
            style={{ width: "130px", height: "auto" }}
            className="rounded-full"
          />
        </div>

        {/* 中间标题区域 */}
        <div className="flex-1 text-center">
          <span className="text-xl font-bold">Hotel Booking Dapp</span>
        </div>

        {/* 右侧钱包连接区域 */}
        <div className="w-[200px] flex justify-end items-center gap-4">
          {isConnected ? (
            <>
              <span className="text-sm text-muted-foreground">
                {shortenAddress(address)}
              </span>
              <Button variant="outline" size="sm" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => connect()}>
              Connect Wallet
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

// 辅助函数
function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
