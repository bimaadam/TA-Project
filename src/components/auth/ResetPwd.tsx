
"use client"

import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

export const ResetPassword = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (

        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                    <Link
                        href="/signin"
                        className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <ChevronLeftIcon />
                        Back to Signin
                    </Link>
                </div>
                <div className="justify-center mt-60 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-5 sm:mb-8">
                            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                Forgot Password
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Reset your password
                            </p>
                        </div>
                        {submitted ? (
                            <div className="text-green-600 text-sm mb-4">
                                If your email is registered, you will receive a reset link.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email address
                                    </label>
                                    <Input
                                        id="email"
                                        type="emai"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    type="submit"
                                >
                                    Reset your password
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};