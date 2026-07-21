import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoryDTO } from "@interdex/shared";
import { apiClient } from "./client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ categories: CategoryDTO[] }>(
        "/categories",
      );
      return data.categories;
    },
    staleTime: 60_000,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ category: CategoryDTO }>(
        `/categories/${id}`,
      );
      return data.category;
    },
    enabled: Boolean(id),
  });
}

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const { data } = await apiClient.post<{ category: CategoryDTO }>(
        "/categories",
        input,
      );
      return data.category;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: CategoryInput & { id: string }) => {
      const { data } = await apiClient.patch<{ category: CategoryDTO }>(
        `/categories/${id}`,
        input,
      );
      return data.category;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
