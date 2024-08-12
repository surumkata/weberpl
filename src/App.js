import React from 'react';
import BlockEditor from './BlockEditor';
import EscapeRoomPage from './EscapeRoomPage'
import { Routes, Route, HashRouter } from "react-router-dom";



const App = () => {
  return (
      <HashRouter>
          <Routes>
              <Route path="" element={<BlockEditor />} />
              <Route path="/escape_room/:data" element={<EscapeRoomPage />} />
          </Routes>
      </HashRouter>
  );
}

export default App;