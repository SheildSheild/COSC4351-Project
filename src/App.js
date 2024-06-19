import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const { TextDecoder, TextEncoder } = require('util');
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
