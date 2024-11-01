"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useContract } from "@/hooks/web3/use-contract";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomCategory } from "@/types/room";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { bookingAbi } from "@/constants/abis/bookingAbi";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { ethers } from "ethers";

const formSchema = z.object({
  category: z.string(),
  pricePerNight: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Price must be greater than 0"
    ),
});

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddRoomModal({
  open,
  onOpenChange,
  onSuccess,
}: AddRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const contract = useContract();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      pricePerNight: "",
    },
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Room added successfully!");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
      setIsLoading(false);
    }
  }, [isSuccess, form, onSuccess, onOpenChange]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }

    try {
      setIsLoading(true);
      writeContract({
        address: BOOKING_ADDRESS,
        abi: bookingAbi,
        functionName: "addRoom",
        args: [parseInt(values.category), BigInt(values.pricePerNight)],
      });
    } catch (error: any) {
      console.error("Add room error:", error);
      toast.error(error.reason || error.message || "Failed to add room");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoomCategory.Presidential.toString()}>
                        Presidential
                      </SelectItem>
                      <SelectItem value={RoomCategory.Deluxe.toString()}>
                        Deluxe
                      </SelectItem>
                      <SelectItem value={RoomCategory.Suite.toString()}>
                        Suite
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerNight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Night (ETH)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter price in ETH"
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || isConfirming}
              className="w-full"
            >
              {isConfirming
                ? "Confirming..."
                : isLoading
                ? "Adding..."
                : "Add Room"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
