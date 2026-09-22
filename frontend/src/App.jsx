import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Section from './pages/Section.jsx';
import Checklist from './pages/Checklist.jsx';
import Resources from './pages/Resources.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Welcome from './pages/Welcome.jsx';
import Universities from './pages/Universities.jsx';
import UniversitiesBrowse from './pages/UniversitiesBrowse.jsx';
import UniversityDetail from './pages/UniversityDetail.jsx';
import Progress from './pages/Progress.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import PersonalInfo from './pages/PersonalInfo.jsx';
import Community from './pages/Community.jsx';
import CohortRoom from './pages/CohortRoom.jsx';
import Explore from './pages/Explore.jsx';
import ActivitiesList from './pages/ActivitiesList.jsx';
import ActivityChat from './pages/ActivityChat.jsx';
import PlaceDetail from './pages/PlaceDetail.jsx';
import HelpSupport from './pages/HelpSupport.jsx';
import AboutMasar from './pages/AboutMasar.jsx';
import Terms from './pages/Terms.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
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
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/browse" element={<UniversitiesBrowse />} />
        <Route path="/universities/:slug" element={<UniversityDetail />} />
        <Route path="/checklist" element={<div className="m-page"><Checklist /></div>} />
        <Route path="/map" element={<Explore />} />
        <Route path="/map/activities" element={<ActivitiesList />} />
        <Route path="/map/place/:placeId" element={<PlaceDetail />} />
        <Route path="/activities/:activityId/chat" element={<ActivityChat />} />
        {/* Community.jsx now merges what NearbyStudents.jsx (the old /people
            page) used to do - a plain redirect keeps the header's people
            icon and Explore.jsx's "Travelers Here" link working unchanged.
            NearbyStudents.jsx itself is left in place, unused, rather than
            deleted. */}
        <Route path="/people" element={<Navigate to="/community" replace />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:groupId" element={<CohortRoom />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/personal-info" element={<PersonalInfo />} />
        <Route path="/profile/help" element={<HelpSupport />} />
        <Route path="/profile/about" element={<AboutMasar />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<div className="m-page"><ForgotPassword /></div>} />
        <Route path="/reset-password" element={<div className="m-page"><ResetPassword /></div>} />
        <Route path="/verify-email" element={<div className="m-page"><VerifyEmail /></div>} />
      </Routes>
      <BottomNav />
    </div>
  );
}
