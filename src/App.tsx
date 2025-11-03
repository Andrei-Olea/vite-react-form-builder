import './styles/main.css';

import { SavingsForm } from './examples/SavingsForm';
// Example forms (uncomment to use):
// import { NewsletterFormExample } from './examples/NewsletterFormExample';
// import { ContactFormExample } from './examples/ContactFormExample';
// import { RegistrationFormBuilderExample } from './examples/RegistrationFormBuilderExample';

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>ViteJs + React Form Starter</h1>
        <p>A starter template for building React forms with validation and submission handling.</p>
        <p>By <a href='https://www.andreiolea.com' target='_blank'>Andrettix</a></p>
      </header>
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
