import React from 'react';
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { FrontOnly } from './FrontOnly'
import { WithBackend } from './WithBackend'
import './App.css';

function App() {
  return <>
    <HashRouter>
      <div className='w-3/6 mx-auto my-2'>
        <div className='flex justify-evenly'>
          <Link to='/front-only' className=''>Front Only</Link>
          <Link to='/'>With Backend</Link>
        </div>
        <Routes>
          <Route path="/front-only" element={<FrontOnly/>}/>
          <Route path="/" element={<WithBackend/>}/>
        </Routes>
      </div>
    </HashRouter>
  </>
}

export default App;
