import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PortfoliosPage from "@/pages/PortfoliosPage";
import InvestmentsPage from "@/pages/InvestmentsPage";
import InvestorsPage from "@/pages/InvestorsPage";
import { LoansPage } from "@/pages/LoansPage";
import { LoanDetailPage } from "@/pages/LoanDetailPage";
import ReportsPage from "@/pages/ReportsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              //</ProtectedRoute>
            }
          />
          
          <Route
            path="/portfolios"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PortfoliosPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/investments"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InvestmentsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/investors"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InvestorsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LoansPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/loans/:loanId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <LoanDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ReportsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
