import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/common/NavBar'
import UserAuthForm from './pages/UserAuthForm'
import OpenRoute from './components/common/OpenRoute'
import OtpVerificationForm from './pages/OtpVerificationForm'
import EditorPage from './pages/EditorPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import Error from './pages/Error'
import ProfilePage from './pages/ProfilePage'
import BlogPage from './pages/BlogPage'
import SideNav from './components/core/SettingPage/SideNav'
import ChangePassword from './components/core/SettingPage/ChangePassword'
import EditProfilePage from './pages/EditProfilePage'
import NotificationPage from './pages/NotificationPage'
import ManageBlogs from './pages/ManageBlogs'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

function App() {
  const { initialTheme } = useSelector((state) => state.theme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, [initialTheme])
  return (
    <div>
      <Routes>
        <Route path='/editor' element={<ProtectedRoute element={<EditorPage />}/>}></Route>
        <Route path='/editor/:_id' element={<ProtectedRoute element={<EditorPage />} />}></Route>

        <Route path='/' element={<NavBar />}>
          <Route index element={<HomePage />}></Route>
          <Route path='sign-up' element={<OpenRoute element={<UserAuthForm type={'sign-up'}/>} />}></Route>
          <Route path='sign-in' element={<OpenRoute element={<UserAuthForm type={'sign-in'}/>}/>}></Route>
          <Route path='send-otp' element={<OpenRoute element={<OtpVerificationForm />}/>}></Route>
          <Route path='/search/:query' element={<SearchPage />}></Route>
          <Route path='/user/:username' element={<ProfilePage />}></Route>
          <Route path='/blog/:_id' element={<BlogPage />}></Route>
          <Route path='/dashboard' element={<ProtectedRoute element={<SideNav />} />}>
            <Route path='notifications' element={<NotificationPage />}></Route>
            <Route path='blogs' element={<ManageBlogs />}></Route>
          </Route>
          <Route path='/settings' element={<ProtectedRoute element={<SideNav />} />}>
            <Route path='edit-profile' element={<EditProfilePage />}></Route>
            <Route path='change-password' element={<ChangePassword />}></Route>
          </Route>
          <Route path='*' element={<Error />}></Route>
        </Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </div>
  )
}

export default App