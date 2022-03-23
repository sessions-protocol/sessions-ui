import { Route, BrowserRouter, Routes, } from 'react-router-dom';
import Home from '@/pages/Home';

export default function Router() {
  return (
    <div className='Router'>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
