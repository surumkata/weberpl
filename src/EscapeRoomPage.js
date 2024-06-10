import React from 'react';

import './blocks/customblocks';
import './generator/generator';
import { useParams } from 'react-router-dom';
import P5Sketch from './components/p5-sketch';


function EscapeRoomPage() {

  const { data } = useParams();

  try {
    var escape_room = JSON.parse(atob(data));
  }
  catch {
    console.log("Não foi possivel dar parse no JSON.")
  }

  return (
        <P5Sketch json={escape_room} />
  );
}

export default EscapeRoomPage;
