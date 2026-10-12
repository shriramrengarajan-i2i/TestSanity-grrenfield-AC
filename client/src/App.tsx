import resolveConfig from './config/env';
import './App.css';

function App() {
  const { apiBaseUrl } = resolveConfig();

  return (
    <main className="placeholder">
      <h1>Web client</h1>
      <p>This is a placeholder landing view for the web client shell.</p>
      <p>
        API base URL: <code>{apiBaseUrl}</code>
      </p>
    </main>
  );
}

export default App;
