import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ThankYouPage } from './pages/ThankYouPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/payment-failed" element={<PaymentFailedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
