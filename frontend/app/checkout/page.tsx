"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Address {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function Checkout() {
  const { user, token } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
  });
  const [notes, setNotes] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, items, router]);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create address
      const addressResponse = await axios.post(
        `${API_URL}/addresses`,
        address,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const addressId = addressResponse.data.id;

      // Create order
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const orderResponse = await axios.post(
        `${API_URL}/orders`,
        {
          items: orderItems,
          addressId,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderResponse.data;

      // Create payment intent
      const paymentResponse = await axios.post(
        `${API_URL}/payments/create-payment-intent`,
        { orderId: order.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret } = paymentResponse.data;

      // Redirect to Stripe Checkout or handle payment
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order_id=${order.id}`,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
      } else {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-success?order_id=${order.id}`);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.error || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user || items.length === 0) {
    return <div>Loading...</div>;
  }

  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    required
                    className="input-field"
                    value={address.streetAddress}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="input-field"
                      value={address.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      className="input-field"
                      value={address.state}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      className="input-field"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      className="input-field"
                      value={address.country}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="input-field"
                    placeholder="Any special instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay $${finalTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
