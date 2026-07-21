import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponse, UserDTO } from "@interdex/shared";
import { apiClient } from "./client";
import { useAuthStore } from "@/store/authStore";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/register",
        input,
      );
      return data;
    },
    onSuccess: (data) => setAuth(data.user, data.accessToken),
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthResponse>("/auth/login", input);
      return data;
    },
    onSuccess: (data) => setAuth(data.user, data.accessToken),
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
    onSettled: () => {
      clear();
      queryClient.clear();
    },
  });
}

export function useGoogleSsoStatus() {
  return useQuery({
    queryKey: ["auth", "google-status"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ enabled: boolean }>(
        "/auth/google/status",
      );
      return data.enabled;
    },
    staleTime: Infinity,
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ user: UserDTO }>("/auth/me");
      return data.user;
    },
    enabled: Boolean(accessToken),
    retry: false,
  });
}
