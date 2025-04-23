import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Dashboard Admin Abyzain Jaya Teknika",
  description: "Login untuk masuk ke Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
