import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckOutForm.css';
import axios from 'axios';

export default function CheckOutForm({ selectedProduct }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState('pay');
  const [credentials, setCredentials] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setError(e.error ? e.error.message : '');
  };

  const createPaymentIntent = async (amount) => {
    try {
      const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: amount * 100
      });
      return response.data.clientSecret;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus('processing...');
    const cardElement = elements.getElement(CardElement);
    const { name, phone, email, address } = credentials;

    try {
      const clientSecret = await createPaymentIntent(selectedProduct.price);
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name, phone, email, address: { line1: address }, }
      });

      if (paymentMethodReq.error) {
        throw new Error(paymentMethodReq.error.message);
      }

      const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id
      });

      if (confirmPayment.error) {
        throw new Error(confirmPayment.error.message);
      }

      setStatus('success');
      resetForm();
    } catch (error) {
      setError(error.message);
      setStatus('pay');
    } finally {
      setIsProcessing(false);
    }
  }

  const resetForm = () => {
    setTimeout(() => {
      setStatus('pay');
      setCredentials({
        name: '',
        phone: '',
        email: '',
        address: '',
      });
      elements.getElement(CardElement).clear();
    }, 3000);
  };

  return (
    <div className='checkOutForm'>
      <h3 className='purchase-msg'>
        {selectedProduct && (
          <span>
            You are Purchasing <span className='purchase-Product'>{selectedProduct.name}</span> for ${selectedProduct.price}
          </span>
        )}
      </h3>
      <form className="form" onSubmit={handlePayment}>
        <input type="text" placeholder="Full Name" name='name' required className="input" onChange={handleChange} value={credentials.name} />
        <input type="text" placeholder="Phone Number" name='phone' required className="input" onChange={handleChange} value={credentials.phone} />
        <input type="email" placeholder="Email" name='email' required className="input" onChange={handleChange} value={credentials.email} />
        <input type="text" placeholder="Address" name='address' required className="input" onChange={handleChange} value={credentials.address} />
        <p>{error}</p>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '20px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          onChange={handleCardChange}
        />
        <button type='submit' disabled={isProcessing || !selectedProduct}>{status}</button>
      </form>
    </div>
  );
}
