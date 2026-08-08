import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import Player from './pages/Player';
import Master from './pages/Master';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="player/:code" element={<Player />} />
          <Route path="master/:code" element={<Master />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
