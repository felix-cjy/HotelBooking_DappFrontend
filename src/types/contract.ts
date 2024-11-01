import { Room } from "./room";

export interface BookingContract {
  write: {
    addReview: (
      args: [bigint, number, string]
    ) => Promise<{ wait: () => Promise<void> }>;
    addRoom: (
      args: [string, string, bigint, string]
    ) => Promise<{ wait: () => Promise<void> }>;
    setRoomAvailability: (
      args: [bigint, boolean]
    ) => Promise<{ wait: () => Promise<void> }>;
  };
  read: {
    getAllRooms: () => Promise<Room[]>;
  };
}
