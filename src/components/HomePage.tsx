"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { bookingAbi } from "@/constants/abis/bookingAbi";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { RoomCard } from "@/components/room/RoomCard";
import { AddRoomModal } from "@/components/modals/AddRoomModal";
import { SetAvailabilityModal } from "@/components/modals/SetAvailabilityModal";
import { useReadContract } from "wagmi";
import { useWeb3Connect } from "@/hooks/web3/use-connect";
import { useMounted } from "@/hooks/use-mounted";
import { useChainCheck } from "@/hooks/web3/use-chain-check";

interface Room {
  id: number;
  category: number;
  pricePerNight: bigint;
  isAvailable: boolean;
}

export function HomePage() {
  const mounted = useMounted();
  const { address } = useWeb3Connect();
  const { isCorrectChain } = useChainCheck();
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const { data: rooms = [], refetch } = useReadContract({
    address: BOOKING_ADDRESS,
    abi: bookingAbi,
    functionName: "getAllRooms",
    enabled: mounted && !!address && isCorrectChain,
  });

  const handleSuccess = () => {
    refetch();
  };

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Welcome to Hotel Booking DApp
        </h2>
        <p className="text-muted-foreground mb-8">
          Please connect your wallet to continue
        </p>
      </div>
    );
  }

  if (!isCorrectChain) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Wrong Network</h2>
        <p className="text-muted-foreground mb-8">
          Please switch to Morph Holesky network
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      {address && (
        <div className="flex justify-end gap-3 mb-8">
          <Button
            onClick={() => setShowAddRoomModal(true)}
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            Add Room
          </Button>
          <Button
            onClick={() => setShowAvailabilityModal(true)}
            className="bg-primary hover:bg-primary/90 transition-colors"
          >
            Set Availability
          </Button>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
        {rooms.map((room, index) => (
          <div key={index} className="break-inside-avoid mb-6">
            <RoomCard room={room} onSuccess={handleSuccess} />
          </div>
        ))}
      </div>

      <AddRoomModal
        open={showAddRoomModal}
        onOpenChange={setShowAddRoomModal}
        onSuccess={handleSuccess}
      />
      <SetAvailabilityModal
        open={showAvailabilityModal}
        onOpenChange={setShowAvailabilityModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
