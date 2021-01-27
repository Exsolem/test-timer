import React, {useState,useEffect} from 'react'
import { timer, Observable } from 'rxjs'
import Timer from "./Timer/Timer";

import './App.css'




function App() {
  return (
      <div className="App">
          <Timer/>
      </div>
  );
}

export default App;
