import { SavingsForm } from './components/SavingsForm';
import './styles/main.css';

function App() {
  return (
    <main className="app">
      <div className="page-head"><img src="img/ahorro-bienestar-head-form.jpg" /></div>
      <div className="container">
        <SavingsForm />
      </div>
    </main>
  );
}

export default App;
