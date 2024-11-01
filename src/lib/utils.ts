import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RoomCategory } from "@/types/room";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoomCategoryLabel(category: number): string {
  switch (category) {
    case RoomCategory.Presidential:
      return "Presidential";
    case RoomCategory.Deluxe:
      return "Deluxe";
    case RoomCategory.Suite:
      return "Suite";
    default:
      return "Unknown";
  }
}

export function shortenAddress(address: string | undefined): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
