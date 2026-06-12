export function SearchBad({ customers }) {
  const filteredCustomers = customers.filter((customer) => customer.active);

  return (
    <section className="p-6">
      <input type="search" placeholder="Search customers" className="w-full border p-2" />
      <div className="mt-4">
        {filteredCustomers.map((customer) => (
          <p key={customer.id}>{customer.name}</p>
        ))}
      </div>
    </section>
  );
}
