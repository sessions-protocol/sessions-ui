import { Route, BrowserRouter, Routes, } from 'react-router-dom';
// import HomePage from '@/pages/Home';
import { ProfilePage } from '@/pages/ProfilePage';
import SessionAvailablePage from '@/pages/SessionAvailablePage';
import SessionBookPage from './pages/SessionBookPage';
import SessionScheduledPage from './pages/SessionScheduledPage';
import SessionTypesPage from './pages/SessionTypes';

export default function Router() {
  return (
    <div className='Router'>
      <BrowserRouter>
        <Routes>
          {/*<Route index element={<HomePage />} />*/}
          <Route index element={<ProfilePage />} />
          <Route path="/session-types" element={<SessionTypesPage/>} />
          <Route path='/session/:sessionId'>
            <Route path='available' element={<SessionAvailablePage />} />
            <Route path='book' element={<SessionBookPage />} />
            <Route path='scheduled' element={<SessionScheduledPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
