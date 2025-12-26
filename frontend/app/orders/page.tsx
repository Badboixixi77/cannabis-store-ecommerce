"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface Order {
  id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  street_address: string;
  city: string;
  state: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
}

export default function Orders() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            You haven't placed any orders yet.
          </p>
          <a href="/products" className="btn-primary">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    {order.street_address && (
                      <p className="text-sm text-gray-600">
                        Delivery to: {order.street_address}, {order.city},{" "}
                        {order.state}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${order.total_amount}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status === "paid"
                          ? "Paid"
                          : "Payment Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 bg-gray-200 rounded-lg">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xl">🌿</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">
                          {item.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
