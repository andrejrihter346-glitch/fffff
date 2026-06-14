import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface text-text-primary font-sans antialiased">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
