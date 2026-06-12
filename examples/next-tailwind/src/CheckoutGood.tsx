export function CheckoutGood({ paymentError }: { paymentError?: string }) {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">Secure encrypted payment. Contact support if payment failed.</p>
      {paymentError ? <p role="alert" className="mt-4 text-sm text-red-600">{paymentError} Try another card or contact support.</p> : null}
      <section className="mt-6">
        <label className="block text-sm font-medium" htmlFor="card">Credit card</label>
        <input id="card" className="mt-2 w-full rounded border p-3" name="card" aria-describedby="card-help" />
        <p id="card-help" className="mt-1 text-sm text-slate-500">Your card details are encrypted and never stored by UIQA.</p>
      </section>
      <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white">Pay securely</button>
    </main>
  );
}
