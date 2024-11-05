"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { bookingAbi } from "@/constants/abis/bookingAbi";
import { RoomCategory } from "@/types/room";

const formSchema = z.object({
  numberOfNights: z.string().min(1, "Please enter number of nights"),
});

interface BookingModalProps {
  category: RoomCategory;
  pricePerNight: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BookingModal({
  category,
  pricePerNight,
  open,
  onOpenChange,
  onSuccess,
}: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(pricePerNight);

  const { writeContract, data: hash } = useContractWrite();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfNights: "1",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Room booked successfully!");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
      setIsLoading(false);
    }
  }, [isSuccess, form, onSuccess, onOpenChange]);

  // 计算总价
  useEffect(() => {
    const nights = parseInt(form.watch("numberOfNights") || "1");
    const price = parseInt(pricePerNight);
    setTotalPrice((nights * price).toString());
  }, [form.watch("numberOfNights"), pricePerNight]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const checkInDate = Math.floor(Date.now() / 1000); // 当前时间戳（秒）
      const checkOutDate =
        checkInDate + parseInt(values.numberOfNights) * 24 * 60 * 60; // 加上预��天数（秒）

      writeContract({
        address: BOOKING_ADDRESS,
        abi: bookingAbi,
        functionName: "bookRoomByCategory",
        args: [
          BigInt(category), // RoomCategory enum value
          BigInt(checkInDate),
          BigInt(checkOutDate),
        ],
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.reason || error.message || "Failed to book room");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 显示房间信息 */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{RoomCategory[category]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p className="font-medium">{pricePerNight}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="numberOfNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Nights</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(field.value);
                            if (current > 1) {
                              field.onChange((current - 1).toString());
                            }
                          }}
                        >
                          -
                        </Button>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const current = parseInt(field.value);
                            field.onChange((current + 1).toString());
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 显示总价 */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="font-bold text-lg">{totalPrice}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isConfirming}
                className="w-full"
              >
                {isConfirming
                  ? "Confirming..."
                  : isLoading
                  ? "Booking..."
                  : "Book Now"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
