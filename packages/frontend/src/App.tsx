import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import { HomePage } from "@/pages/HomePage";
import { CategoryPage } from "@/pages/CategoryPage";
import { QuestionDetailPage } from "@/pages/QuestionDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { GoogleCallbackPage } from "@/pages/GoogleCallbackPage";
import { SubmitQuestionPage } from "@/pages/SubmitQuestionPage";
import { MySubmissionsPage } from "@/pages/MySubmissionsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminReviewPage } from "@/pages/AdminReviewPage";
import { AdminCategoriesPage } from "@/pages/AdminCategoriesPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<GoogleCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/submit" element={<SubmitQuestionPage />} />
          <Route path="/my-submissions" element={<MySubmissionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/review" element={<AdminReviewPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
