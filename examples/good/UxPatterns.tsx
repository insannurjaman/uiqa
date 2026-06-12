export function EmptyOrders({ orders }) {
  if (orders.length === 0) {
    return <p>No items yet. Create an order to get started.</p>;
  }

  return <ul>{orders.map((order) => <li key={order.id}>{order.name}</li>)}</ul>;
}

export function LoadingProducts() {
  const { data, isLoading, error } = useQuery();
  if (isLoading) {
    return <p>Loading products</p>;
  }
  if (error) {
    return <p role="alert">Unable to load products. Try again.</p>;
  }

  return <section>{data.products.map((product) => <p key={product.id}>{product.name}</p>)}</section>;
}

export function SearchCustomers({ results }) {
  return (
    <>
      <input type="search" placeholder="Search customers" />
      {results.length === 0 ? <p>No results found. Try a different search.</p> : results.map((result) => <p key={result.id}>{result.name}</p>)}
    </>
  );
}

export function SignupForm({ emailError }) {
  return (
    <form>
      <input name="email" aria-invalid={Boolean(emailError)} aria-describedby="email-help" />
      <p id="email-help">Enter a valid email address.</p>
      <button type="submit">Create account</button>
    </form>
  );
}

export function DangerZone() {
  return <button onClick={() => window.confirm("Are you sure?") && deleteWorkspace()}>Delete workspace</button>;
}

export function Checkout() {
  return (
    <section>
      <h1>Checkout</h1>
      <p>Secure encrypted payment. Contact support if payment failed.</p>
      <button>Pay now</button>
    </section>
  );
}

export function WideTable() {
  return (
    <div className="overflow-x-auto md:flex-row flex-wrap">
      <table>
        <tbody />
      </table>
    </div>
  );
}
