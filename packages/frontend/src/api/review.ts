import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AnswerDTO,
  PaginatedResult,
  QuestionDTO,
  ReviewStatus,
} from "@interdex/shared";
import { apiClient } from "./client";

export function useReviewQuestionQueue(
  status: ReviewStatus,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ["review", "questions", status, page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<QuestionDTO>>(
        "/review/questions",
        {
          params: { status, page, pageSize },
        },
      );
      return data;
    },
  });
}

export function useDecideQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      decision,
      note,
    }: {
      id: string;
      decision: "approve" | "reject";
      note?: string;
    }) => {
      const { data } = await apiClient.post<{ question: QuestionDTO }>(
        `/review/questions/${id}/${decision}`,
        { note },
      );
      return data.question;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useReviewAnswerQueue(
  status: ReviewStatus,
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: ["review", "answers", status, page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<
        PaginatedResult<AnswerDTO & { question: { id: string; title: string } }>
      >("/review/answers", { params: { status, page, pageSize } });
      return data;
    },
  });
}

export function useDecideAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      decision,
      note,
    }: {
      id: string;
      decision: "approve" | "reject";
      note?: string;
    }) => {
      const { data } = await apiClient.post<{ answer: AnswerDTO }>(
        `/review/answers/${id}/${decision}`,
        { note },
      );
      return data.answer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}
