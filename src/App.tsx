import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Loader } from './components/Loader/Loader';

const Account = lazy(() => import('./pages/Account').then((module) => ({ default: module.Account })));
const FilmPage = lazy(() => import('./pages/Film').then((module) => ({ default: module.FilmPage })));
const Genres = lazy(() => import('./pages/Genres').then((module) => ({ default: module.Genres })));
const MoviesGenre = lazy(() =>
  import('./pages/MoviesGenre').then((module) => ({ default: module.MoviesGenre }))
);

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
    <Suspense fallback={<Loader />}>
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
        <Route path="/genres/:genre" element={<MoviesGenre />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
