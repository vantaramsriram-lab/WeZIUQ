import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import UserLayout from './pages/UserLayout'
import Quiz from './pages/Quiz'
import QuizCompleted from './pages/QuizCompleted'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminQuestions from './pages/AdminQuestions'
import AdminResults from './pages/AdminResults'
import { AuthProvider } from './context/authContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element = {<Navigate to="/auth" replace />}/> 
        <Route path='/auth' element={<Auth />} />
        <Route path='/user' element={<UserLayout />} />
        <Route path='/user/quiz' element={<Quiz />} />
        <Route path='/quiz/completed' element={<QuizCompleted />} />
        <Route path='/admin' element={<AdminLayout />} >
          <Route index element={<AdminDashboard />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='questions' element={<AdminQuestions />} />
          <Route path='results' element={<AdminResults />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
