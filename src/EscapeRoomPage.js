import React from 'react';

import { useParams } from 'react-router-dom';
import P5Sketch from './components/p5-sketch.js';


function EscapeRoomPage() {

  const { data } = useParams();

  try {
    console.log(atob(data));
    var escape_room = JSON.parse(atob(data));
  }
  catch {
    console.log("Não foi possivel dar parse no JSON.")
  }

  return (
        <P5Sketch json={escape_room} />
  );
}

export {EscapeRoomPage};
