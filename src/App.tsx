import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Posts } from '@/pages/Posts';
import { Users } from '@/pages/Users';
import { Comments } from '@/pages/Comments';
import { Messages } from '@/pages/Messages';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route
              path="/"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/posts"
              element={
                <AdminLayout>
                  <Posts />
                </AdminLayout>
              }
            />
            <Route
              path="/users"
              element={
                <AdminLayout>
                  <Users />
                </AdminLayout>
              }
            />
            <Route
              path="/comments"
              element={
                <AdminLayout>
                  <Comments />
                </AdminLayout>
                }
              />
            <Route
              path="/messages"
              element={
                <AdminLayout>
                  <Messages />
                </AdminLayout>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
