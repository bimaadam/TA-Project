"use client";

import AdminRegisterForm from "@/components/auth/AdminRegisterForm";
import React from "react";

export default function AdminRegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminRegisterForm />
    </div>
  );
}
