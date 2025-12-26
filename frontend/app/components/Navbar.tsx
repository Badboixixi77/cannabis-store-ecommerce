"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                🌿 Cannabis Store
              </h1>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                >
                  Orders
                </Link>
                {user.is_admin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-gray-700" />
                  <span className="text-sm text-gray-700">
                    {user.first_name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
