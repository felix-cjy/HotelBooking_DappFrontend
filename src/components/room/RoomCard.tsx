"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatEther } from "ethers";
import { Button } from "@/components/ui/button";
import { getRoomCategoryLabel } from "@/lib/utils";
import { Room } from "@/types/room";
import { BookingModal } from "@/components/modals/BookingModal";
import { AddReviewModal } from "@/components/modals/AddReviewModal";
import { useWeb3Connect } from "@/hooks/web3/use-connect";
import { Star, MessageSquare } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { RoomCategory } from "@/types/room";

interface RoomCardProps {
  room: Room;
  onSuccess?: () => void;
}

export function RoomCard({ room, onSuccess }: RoomCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { address } = useWeb3Connect();
  const roomCategory = Number(room.category);

  // 直接从 room 对象获取评论
  const validReviews =
    room.reviews?.filter(
      (review) => review && typeof review.rating === "number" && review.comment
    ) || [];

  const averageRating =
    validReviews.length > 0
      ? validReviews.reduce((acc, review) => acc + Number(review.rating), 0) /
        validReviews.length
      : 0;

  const getRoomImage = (category: number): string => {
    switch (category) {
      case RoomCategory.Presidential:
        return "/2071.jpg";
      case RoomCategory.Deluxe:
        return "/2149.jpg";
      case RoomCategory.Suite:
        return "/7715.jpg";
      default:
        return "/2149.jpg";
    }
  };

  // 处理价格显示
  const displayPrice = useMemo(() => {
    try {
      if (!room.pricePerNight) return 0;

      // 直接返回数值，不使用 formatEther
      return Number(room.pricePerNight);
    } catch (error) {
      console.error("Error formatting price:", error, room.pricePerNight);
      return 0;
    }
  }, [room.pricePerNight]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="relative h-[240px] w-full group">
        <Image
          src={getRoomImage(roomCategory)}
          alt={getRoomCategoryLabel(roomCategory)}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              #{String(Number(room.id)).padStart(2, "0")}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              {getRoomCategoryLabel(roomCategory)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {displayPrice}
              <span className="text-sm ml-1 text-gray-500 font-normal">
                per night
              </span>
            </p>
          </div>
        </div>

        {validReviews.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-sm">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({validReviews.length} reviews)
              </span>
            </div>

            <div className="space-y-2">
              {validReviews.slice(0, 2).map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Number(review.rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {review.comment}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {shortenAddress(review.guest)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 hover:translate-y-[-1px] transition-all active:translate-y-[1px]"
            onClick={() => setShowBookingModal(true)}
            disabled={!room.isAvailable || !address}
          >
            {room.isAvailable ? "Book Now" : "Not Available"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowReviewModal(true)}
            disabled={!address}
            size="icon"
            className="hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        category={roomCategory}
        pricePerNight={Number(room.pricePerNight).toString()}
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
        onSuccess={onSuccess}
      />
      <AddReviewModal
        roomId={Number(room.id)}
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        onSuccess={onSuccess}
      />
    </div>
  );
}
