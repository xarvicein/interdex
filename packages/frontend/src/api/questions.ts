import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AnswerContentType,
  Difficulty,
  PaginatedResult,
  QuestionDTO,
} from "@interdex/shared";
import { apiClient } from "./client";

export interface QuestionFilters {
  category?: string;
  difficulty?: Difficulty;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useQuestions(filters: QuestionFilters) {
  return useQuery({
    queryKey: ["questions", filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<QuestionDTO>>(
        "/questions",
        {
          params: filters,
        },
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useMyQuestions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["questions", "mine", page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<QuestionDTO>>(
        "/questions/mine",
        {
          params: { page, pageSize },
        },
      );
      return data;
    },
  });
}

export function useQuestion(id: string | undefined) {
  return useQuery({
    queryKey: ["questions", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ question: QuestionDTO }>(
        `/questions/${id}`,
      );
      return data.question;
    },
    enabled: Boolean(id),
  });
}

export interface AnswerInput {
  contentType: AnswerContentType;
  textContent?: string;
  codeContent?: string;
  codeLanguage?: string;
}

export interface CreateQuestionInput {
  title: string;
  prompt: string;
  categoryId: string;
  difficulty: Difficulty;
  tags: string[];
  answers: AnswerInput[];
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateQuestionInput) => {
      const { data } = await apiClient.post<{ question: QuestionDTO }>(
        "/questions",
        input,
      );
      return data.question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useAddAnswer(questionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AnswerInput) => {
      const { data } = await apiClient.post(
        `/questions/${questionId}/answers`,
        input,
      );
      return data.answer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", questionId] });
    },
  });
}
