"use client";

import { useEffect, useState } from "react";
import { useContract } from "@/hooks/web3/use-contract";
import { Room } from "@/types/room";
import { RoomCard } from "./RoomCard";
import { AddRoomModal } from "../modals/AddRoomModal";
import { Button } from "@/components/ui/button";

export function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { bookingContract } = useContract();

  const fetchRooms = async () => {
    try {
      if (!bookingContract) return;
      const result = await bookingContract.getAllRooms();
      setRooms(result as Room[]);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingContract) {
      fetchRooms();
    }
  }, [bookingContract]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Available Rooms</h2>
        <Button onClick={() => setShowAddModal(true)}>Add Room</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      <AddRoomModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchRooms}
      />
    </div>
  );
}
