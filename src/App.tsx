import './styles/main.css';

import { SavingsForm } from './examples/SavingsForm';
// Example forms (uncomment to use):
// import { NewsletterFormExample } from './examples/NewsletterFormExample';
// import { ContactFormExample } from './examples/ContactFormExample';
import { RegistrationFormBuilderExample } from './examples/RegistrationFormBuilderExample';

function App() {
  return (
    <main className="app">
      <div className="page-head"><img src="img/ahorro-bienestar-head-form.jpg" /></div>
      <div className="container">
        {/* Production Form */}
        <SavingsForm />

        {/* Example Forms - Choose one to preview */}
        {/* <NewsletterFormExample /> */}
        {/* <ContactFormExample /> */}
        {/* <RegistrationFormBuilderExample /> */}
      </div>
    </main>
  );
}

export default App;
