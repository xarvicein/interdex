import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { UserDTO } from "@interdex/shared";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { PageSpinner } from "@/components/Spinner";
import { toast } from "@/store/toastStore";

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("accessToken");

    if (!accessToken) {
      toast({ title: "Google sign-in failed", variant: "destructive" });
      navigate("/login", { replace: true });
      return;
    }

    apiClient
      .get<{ user: UserDTO }>("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(({ data }) => {
        setAuth(data.user, accessToken);
        navigate("/", { replace: true });
      })
      .catch(() => {
        toast({ title: "Google sign-in failed", variant: "destructive" });
        navigate("/login", { replace: true });
      });
  }, [navigate, setAuth]);

  return <PageSpinner />;
}
