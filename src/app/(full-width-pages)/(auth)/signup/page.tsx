
import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | Admin Dashboard CV Abyzain Jaya Teknika",
  description: "Register untuk masuk sebagai Viewer",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
