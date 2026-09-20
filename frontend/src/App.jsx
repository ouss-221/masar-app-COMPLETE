import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Section from './pages/Section.jsx';
import Checklist from './pages/Checklist.jsx';
import Resources from './pages/Resources.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Welcome from './pages/Welcome.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import { useLanguage } from './i18n/LanguageContext.jsx';

export default function App() {
  const { lang } = useLanguage();

  if (!lang) {
    return (
      <Routes>
        <Route path="*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <div className="m-shell">
      <Header />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Home />} />
        <Route path="/section/:slug" element={<div className="m-page"><Section /></div>} />
        <Route path="/checklist" element={<div className="m-page"><Checklist /></div>} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<div className="m-page"><Login /></div>} />
        <Route path="/forgot-password" element={<div className="m-page"><ForgotPassword /></div>} />
        <Route path="/reset-password" element={<div className="m-page"><ResetPassword /></div>} />
        <Route path="/verify-email" element={<div className="m-page"><VerifyEmail /></div>} />
      </Routes>
      <BottomNav />
    </div>
  );
}
