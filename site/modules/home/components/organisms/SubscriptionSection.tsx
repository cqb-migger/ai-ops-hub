import React, { useState } from 'react';
import toast from 'react-hot-toast';

function SubscriptionSection() {
  const urlSubscription =
    'https://d2xeaazpoe.execute-api.ap-southeast-1.amazonaws.com/api/subscribe';
  const [email, setEmail] = useState('');
  const submitForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    return fetch(urlSubscription, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: `{"email":"${email}"}`,
    })
      .then(async (response) => {
        const { status } = response;

        if (status >= 200 && status < 300) {
          return response.json();
        }

        throw await response.json();
      })
      .then(() => {
        toast.success('Subscribed!');
        setEmail('');
      })
      .catch((error) => {
        toast.error(error.error);
      });
  };

  return (
    <section className="section subscription">
      <div className="container">
        <form
          id="newsletter"
          className="subscription__form"
          method="POST"
          action={urlSubscription}
        >
          <div className="subscription__form-inner">
            <h2 className="section__title mb-5 lg:mb-[50px]">Stay to update</h2>
            <div className="form-group">
              <input
                id="email"
                required
                type="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitForm}
              >
                Subscribe
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SubscriptionSection;
