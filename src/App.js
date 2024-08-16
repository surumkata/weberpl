import React from 'react';
import { Routes, Route, HashRouter } from "react-router-dom";
import { Editor } from './Editor';
import { EscapeRoomPage } from './EscapeRoomPage'


const App = () => {
  return (
      <HashRouter>
          <Routes>
              <Route path="" element={<Editor />} />
              <Route path="/escape_room/:data" element={<EscapeRoomPage />} />
          </Routes>
      </HashRouter>
  );
}

export {App};