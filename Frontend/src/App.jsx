import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import UserLayout from './components/UserLayout'
import Welcome from './pages/Welcome'
import ClubQuizzes from './pages/ClubQuizzes'
import Quiz from './pages/Quiz'
import QuizCompleted from './pages/QuizCompleted'
import AdminLayout from './components/QuizAdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminQuestions from './pages/AdminQuestions'
import AdminResults from './pages/AdminResults'
import { AuthProvider } from './context/authContext'
import ClubAdminLayout from './components/ClubAdminLayout'
import QuizAdminLayout from './components/QuizAdminLayout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Navigate to="/auth" replace />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/user' element={<UserLayout />}>
          <Route index element={<Welcome />} />
          <Route path='club/:clubId' element={<ClubQuizzes />} />
        </Route>
        <Route path="/quiz/:quizId/start" element={<Quiz />} />
        <Route path='/quiz/completed' element={<QuizCompleted />} />
        <Route path='/admin' element={<ClubAdminLayout />} >
          <Route index element={<Welcome />} />
          <Route path='quiz/:quizId' element={<QuizAdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='users' element={<AdminUsers />} />
            <Route path='questions' element={<AdminQuestions />} />
            <Route path='results' element={<AdminResults />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
