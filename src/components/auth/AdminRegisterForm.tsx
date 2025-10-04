"use client";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";

export default function AdminRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        role: "ADMIN", // Hardcode role to ADMIN
        isVerified: true, // Admins might be auto-verified or require manual verification
      };
      const response = await authService.register(payload);
      setSuccessMessage(response.message || "Admin registration successful!");

      setTimeout(() => {
        router.push("/admin/dashboard"); // Redirect to admin dashboard after registration
        setLoading(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during registration.");
      }
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to Admin Dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Admin Registration
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Register a new admin account
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </div>
              <div>
                <Label>
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  required
                />
              </div>
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Label>Phone (Optional)</Label>
                <Input
                  name="phone"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />
              </div>
              <div>
                <Label>Avatar URL (Optional)</Label>
                <Input
                  name="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={handleChange}
                  type="url"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {successMessage && (
                <p className="text-sm text-success-500">{successMessage}</p>
              )}
              <div>
                <Button className="w-full" size="sm" type="submit">
                  {loading ? "Registering..." : "Register Admin"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
