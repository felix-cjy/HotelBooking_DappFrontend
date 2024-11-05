"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useContractWrite, useWaitForTransactionReceipt } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StarRating } from "@/components/ui/star-rating";
import { BOOKING_ADDRESS } from "@/constants/addresses";
import { bookingAbi } from "@/constants/abis/bookingAbi";

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(500),
});

interface AddReviewModalProps {
  roomId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddReviewModal({
  roomId,
  open,
  onOpenChange,
  onSuccess,
}: AddReviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContract, data: hash } = useContractWrite();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Review added successfully!");
      form.reset();
      onSuccess?.();
      onOpenChange(false);
      setIsLoading(false);
    }
  }, [isSuccess, form, onSuccess, onOpenChange]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      writeContract({
        address: BOOKING_ADDRESS,
        abi: bookingAbi,
        functionName: "addReview",
        args: [BigInt(roomId), BigInt(values.rating), values.comment],
      });
    } catch (error: any) {
      console.error("Add review error:", error);
      toast.error(error.reason || error.message || "Failed to add review");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Room #{roomId}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5 stars)</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading || isConfirming}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your experience (minimum 10 characters)..."
                      className="min-h-[100px]"
                      disabled={isLoading || isConfirming}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || isConfirming || form.watch("rating") === 0}
              className="w-full"
            >
              {isConfirming
                ? "Confirming..."
                : isLoading
                ? "Submitting..."
                : "Submit Review"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
