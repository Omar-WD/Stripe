import { useState } from 'react';
import './App.css';
import CheckOutForm from './components/CheckOutForm/CheckOutForm';
import ProductCard from './components/ProductCard/ProductCard';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <Elements stripe={stripePromise}>
    <div className="App">
     <ProductCard selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}  />
     <CheckOutForm selectedProduct={selectedProduct}/>
    </div>
    </Elements>
  );
}

export default App;
