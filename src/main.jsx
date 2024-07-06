import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './Advisor-Components/Login.jsx'
import SignUp from './Advisor-Components/SignUp.jsx'
import ConfirmEmail from './Advisor-Components/ConfirmEmail.jsx'
import ProfessionalDetails from './Advisor-Components/ProfessionalDetails.jsx'
import BankDetails from './Advisor-Components/BankDetails.jsx'
import UploadDocuments from './Advisor-Components/UploadDocuments.jsx'
import Services from './Advisor-Components/Services.jsx'
import Profile from './Advisor-Components/Profile.jsx'
import Logout from './Advisor-Components/Logout.jsx'
import Layout from './Layout.jsx'
import Dashboard from './Advisor-Components/Dashboard.jsx'
import ServiceForm from './Advisor-Components/ServiceForm.jsx'
import UserLandingPage from './User-Components/UserLandingPage.jsx'
import UserLayout from './UserLayout.jsx'
import UserCategory from './User-Components/UserCategory.jsx'
import UserAdviserProfile from './User-Components/UserAdvisorProfile.jsx'
import UserCheckoutPage from './User-Components/UserCheckoutPage.jsx'
import UserSignUp from './User-Components/UserSignUp.jsx'
import UserLogin from './User-Components/UserLogin.jsx'
import VideoCall from './Advisor-Components/VideoCall.jsx'
import { MeetingRoom } from '@mui/icons-material'
import Room from './Advisor-Components/Room.jsx'
import Payment from './Advisor-Components/Payment.jsx'
import CreatePost from './Advisor-Components/CreatePost.jsx'
import BookedServices from './User-Components/BookedServices.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <>

<Route path="/" element={<UserLayout />} >
            <Route path="/"  element={<UserLandingPage />} />
            <Route path="/createaccount" element={<UserLogin />} />
            <Route path="/category" element={<UserCategory />} />
            <Route path="/category/:advisername" element={<UserAdviserProfile />} />
            <Route path="/category/:advisername/checkout/:servicename" element={<UserCheckoutPage />} />
            <Route path="/bookedservices" element={<BookedServices />} />
     </Route>


    <Route path ="/adviser" element={<App />} />,
    <Route path="/adviser/login" element={<Login />} />,
    <Route path="/adviser/signup" element={<SignUp />} />,
    <Route path="/adviser/emailconfirmation" element={<ConfirmEmail />} />,
    <Route path="/adviser/professionaldetails" element={<ProfessionalDetails />} />,
    <Route path="/adviser/bankdetails" element={<BankDetails />} />,
    <Route path="/adviser/documentupload" element={<UploadDocuments />} />,


    <Route path='/adviser' element={<Layout />}>
      <Route path="/adviser/dashboard" element={<Dashboard />} />
      <Route path="/adviser/services" element={<Services />} />
      <Route path="/adviser/createservice" element={<ServiceForm />} />
      <Route path="/adviser/editservice" element={<ServiceForm />} />
      <Route path="/adviser/profile" element={<Profile />} />
      <Route path="/adviser/createpost" element={<CreatePost />} />
      <Route path="/adviser/logout" element={<Logout />} />
     </Route>,

     <Route path="/videocall" element={<VideoCall />} />,
     <Route path="/room/:meetingid" element={<Room />} />,

     <Route path="/payment" element={<Payment />} />,

    


  </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  ,
)
