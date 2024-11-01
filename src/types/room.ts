export enum RoomCategory {
  Presidential = 0,
  Deluxe = 1,
  Suite = 2,
}

export interface Room {
  id: number;
  category: number;
  pricePerNight: bigint;
  isAvailable: boolean;
  reviews?: {
    guest: string;
    rating: number;
    comment: string;
  }[];
}

export interface Booking {
  guest: string;
  roomId: bigint;
  checkInDate: bigint;
  checkOutDate: bigint;
}

export interface RoomCardProps {
  room: Room;
  onSuccess?: () => void;
}
