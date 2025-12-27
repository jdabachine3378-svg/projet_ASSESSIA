import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Teacher } from './pages/Teacher';
import { Student } from './pages/Student';

const HomeRedirect = () => {
  const { auth } = useAuth();
  if (auth) {
    return <Navigate to={auth.role === 'Enseignant' ? '/teacher' : '/student'} replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute requiredRole="Enseignant">
                <Teacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="Etudiant">
                <Student />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
