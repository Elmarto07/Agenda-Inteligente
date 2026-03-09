import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import HomeView from './views/HomeView';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <InstallPrompt />
        <nav className="top-nav">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/dia">Día</NavLink>
          <NavLink to="/semana">Semana</NavLink>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/dia" element={<DayView />} />
            <Route path="/semana" element={<WeekView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
