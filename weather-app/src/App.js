import React from 'react';
import './App.css';
import WeatherData from './components/WeatherData';
import DailySummary from './components/DailySummary';
import AlertManager from './components/AlertManager';

function App() {
  return (
    <div className="App">
      <header className="App-header text-center mt-4">
        <h1 className="display-4">Weather and Alert System</h1>
      </header>
      <main>
        <WeatherData />
        <DailySummary />
        <AlertManager />
      </main>

      <footer class="footer mt-5 text-center">
      <p class="footer-text">
        Made with <span class="text-danger"><i class="bi bi-heart-fill"></i></span>
  </p>
</footer>

    </div>
  );
}

export default App;
