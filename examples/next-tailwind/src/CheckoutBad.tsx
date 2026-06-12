export function CheckoutBad() {
  return (
    <main className="mx-auto w-[720px] p-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <section className="mt-6">
        <label className="block text-sm font-medium">Credit card</label>
        <input className="mt-2 w-full border p-3" name="card" />
      </section>
      <button className="mt-6 bg-blue-600 px-4 py-2 text-white">Pay now</button>
    </main>
  );
}
