import React from 'react';
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
          <Route path="player" element={<Player />} />
          <Route path="master" element={<Master />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
