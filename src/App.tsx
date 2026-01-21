import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Account } from './pages/Account';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { FilmPage } from './pages/Film';
import { Genres } from './pages/Genres';
import { Loader } from './components/Loader/Loader';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profileQuery } = useAuth();

  if (profileQuery.isPending) {
    return <Loader />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route path="/movie/:id" element={<FilmPage />} />
      <Route path="/genres" element={<Genres />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
