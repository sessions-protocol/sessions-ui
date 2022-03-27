import { Route, BrowserRouter, Routes, } from 'react-router-dom';
import HomePage from '@/pages/Home';
import SessionAvailablePage from '@/pages/SessionAvailablePage';
import SessionBookPage from './pages/SessionBookPage';
import SessionScheduledPage from './pages/SessionScheduledPage';

export default function Router() {
  return (
    <div className='Router'>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
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
