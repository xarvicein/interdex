import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResult, Role, UserDTO } from "@interdex/shared";
import { apiClient } from "./client";
import { useAuthStore } from "@/store/authStore";

export function useUpdateProfile() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);
  return useMutation({
    mutationFn: async (input: { name?: string; avatarUrl?: string }) => {
      const { data } = await apiClient.patch<{ user: UserDTO }>(
        "/users/me",
        input,
      );
      return data.user;
    },
    onSuccess: (user) => {
      if (accessToken) setAuth(user, accessToken);
    },
  });
}

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<UserDTO>>("/users", {
        params: { page, pageSize },
      });
      return data;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      const { data } = await apiClient.patch<{ user: UserDTO }>(
        `/users/${id}/role`,
        { role },
      );
      return data.user;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
