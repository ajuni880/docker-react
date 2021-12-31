import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';
import Fib from './Fib'
import OtherPage from './OtherPage'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <h1>Fib</h1>
          <Link to="/">Home</Link>
          <Link to="/other">Other page</Link>
        </header>
        <Routes>
          <Route path="/" element={<Fib />}></Route>
          <Route path="/other" element={<OtherPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
