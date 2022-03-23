import { Route, BrowserRouter, Routes, } from 'react-router-dom';
import HomePage from '@/pages/Home';
import BookPage from '@/pages/BookPage';

export default function Router() {
  return (
    <div className='Router'>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/book' element={<BookPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
