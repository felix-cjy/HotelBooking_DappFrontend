"use client";

import { useMemo } from "react";
import { Contract } from "ethers";
import { bookingAbi } from "@/constants/abis/bookingAbi";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { useWeb3Connect } from "./use-connect";

export function useContract() {
  const { provider } = useWeb3Connect();

  const bookingContract = useMemo(() => {
    if (!provider) return null;

    const contract = new Contract(BOOKING_ADDRESS, bookingAbi, provider);

    console.log("Contract initialized:", contract);

    return contract;
  }, [provider]);

  return { bookingContract };
}
