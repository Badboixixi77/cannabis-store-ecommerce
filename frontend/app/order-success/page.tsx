"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircleIcon className="mx-auto h-24 w-24 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Details
          </h3>
          {orderId && (
            <p className="text-gray-600 mb-4">
              Order ID: <span className="font-mono text-sm">{orderId}</span>
            </p>
          )}
          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/orders" className="w-full btn-primary block text-center">
            View My Orders
          </Link>
          <Link
            href="/products"
            className="w-full btn-secondary block text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
