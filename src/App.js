import React from 'react';
import { Routes, Route, HashRouter } from "react-router-dom";
import { EscapeRoomEditor } from './EscapeRoomEditor';
import { EscapeRoomPage } from './EscapeRoomPage'


const App = () => {
  return (
      <HashRouter>
          <Routes>
              <Route path="" element={<EscapeRoomEditor />} />
              <Route path="/escape_room/:data" element={<EscapeRoomPage />} />
          </Routes>
      </HashRouter>
  );
}

export {App};