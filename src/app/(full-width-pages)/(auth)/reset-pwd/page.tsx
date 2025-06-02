import { ResetPassword } from "@/components/auth/ResetPwd";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lupa Password | Admin Abyzain Jaya Teknika",
    description: "",
}

export default function ResetPasswordPage() {
    return <ResetPassword />
}