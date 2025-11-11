import { useState, useEffect } from "react";

export type UserRole = "admin" | "user";

// SECURITY WARNING: This is a frontend-only implementation using localStorage
// In production, roles MUST be validated server-side with proper authentication
// Never trust client-side role checks for security-critical operations

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem("userRole");
    return (savedRole as UserRole) || "user";
  });

  const updateRole = (newRole: UserRole) => {
    localStorage.setItem("userRole", newRole);
    setRole(newRole);
  };

  const isAdmin = role === "admin";

  return { role, isAdmin, updateRole };
};
