import { SavingsForm } from './components/SavingsForm';
import './styles/main.css';

// Example forms (uncomment to use):
// import { NewsletterFormExample } from './examples/NewsletterFormExample';
// import { ContactFormExample } from './examples/ContactFormExample';

function App() {
  return (
    <main className="app">
      <div className="page-head"><img src="img/ahorro-bienestar-head-form.jpg" /></div>
      <div className="container">
        <SavingsForm />
        {/* <NewsletterFormExample /> */}
      </div>
    </main>
  );
}

export default App;
