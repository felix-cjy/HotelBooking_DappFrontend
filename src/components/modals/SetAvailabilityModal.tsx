"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingAbi } from "@/constants/abis/bookingAbi";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { RoomCategory } from "@/types/room";

interface Room {
  id: number;
  category: number;
  pricePerNight: bigint;
  isAvailable: boolean;
}

interface SetAvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SetAvailabilityModal({
  open,
  onOpenChange,
  onSuccess,
}: SetAvailabilityModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: allRooms, refetch } = useContractRead({
    address: BOOKING_ADDRESS,
    abi: bookingAbi,
    functionName: "getAllRooms",
  }) as { data: Room[] | undefined; refetch: () => void };

  const { writeContract, data: hash } = useContractWrite();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Room availability updated successfully!");
      refetch();
      onSuccess?.();
      setIsLoading(false);
    }
  }, [isSuccess, refetch, onSuccess]);

  const handleSetAvailability = async (roomId: number, newStatus: boolean) => {
    try {
      setIsLoading(true);
      writeContract({
        address: BOOKING_ADDRESS,
        abi: bookingAbi,
        functionName: "setRoomAvailability",
        args: [BigInt(roomId), newStatus],
      });
    } catch (error: any) {
      console.error("Set availability error:", error);
      toast.error(
        error.reason || error.message || "Failed to update availability"
      );
      setIsLoading(false);
    }
  };

  const getCategoryString = (category: number) => {
    switch (category) {
      case 0:
        return "Presidential";
      case 1:
        return "Deluxe";
      case 2:
        return "Suite";
      default:
        return "Unknown";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Room Availability</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="p-2 text-left">No.</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Price/Night</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {allRooms?.map((room) => (
                  <tr key={room.id} className="border-b">
                    <td className="p-2">{room.id.toString()}</td>
                    <td className="p-2">{getCategoryString(room.category)}</td>
                    <td className="p-2">{formatPrice(room.pricePerNight)}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          room.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSetAvailability(room.id, !room.isAvailable)
                        }
                        disabled={isLoading || isConfirming}
                        className={`w-full ${
                          isLoading || isConfirming ? "opacity-50" : ""
                        }`}
                      >
                        {isConfirming && room.id === Number(hash)
                          ? "Confirming..."
                          : isLoading && room.id === Number(hash)
                          ? "Updating..."
                          : `Set to ${
                              room.isAvailable ? "Unavailable" : "Available"
                            }`}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatPrice(value: bigint): string {
  try {
    return Number(value).toString();
  } catch (error) {
    console.error("Error formatting price value:", error);
    return "0";
  }
}
