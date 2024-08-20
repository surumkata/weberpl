import React from 'react';

import { useParams } from 'react-router-dom';
import P5Sketch from './components/p5-sketch.js';


function EscapeRoomPage() {

  const { data } = useParams();

  function fromUrlSafeBase64(str) {
    let base64 = str
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    // Padding pode ser necessário dependendo do comprimento do string
    while (base64.length % 4) {
        base64 += '=';
    }
    return atob(base64);
  }

  try {
    console.log(fromUrlSafeBase64(data));
    var escape_room = JSON.parse(fromUrlSafeBase64(data));
  }
  catch {
    console.log("Não foi possivel dar parse no JSON.")
  }

  return (
        <P5Sketch json={escape_room} />
  );
}

export {EscapeRoomPage};
