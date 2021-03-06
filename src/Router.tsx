import { Route, BrowserRouter, Routes, } from 'react-router-dom';
import HomePage from '@/pages/Home';
import { ProfilePage } from '@/pages/ProfilePage';
import { ProfileCreatePage } from '@/pages/ProfileCreatePage';
import SessionAvailablePage from '@/pages/SessionAvailablePage';
import SessionBookPage from './pages/SessionBookPage';
import SessionScheduledPage from './pages/SessionScheduledPage';
import SessionTypesPage from './pages/SessionTypes';
import AvailabilityPage from './pages/Availability';

export default function Router() {
  return (
    <div className="Router">
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/create" element={<ProfileCreatePage />} />
          <Route path="/session-types" element={<SessionTypesPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
          <Route path='/session/:sessionId'>
            <Route path='available' element={<SessionAvailablePage />} />
            <Route path='book' element={<SessionBookPage />} />
            <Route path='scheduled' element={<SessionScheduledPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
