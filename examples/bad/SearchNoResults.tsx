export function CustomerSearch({ customers }) {
  const filteredCustomers = customers.filter((customer) => customer.active);
  return (
    <>
      <input type="search" placeholder="Find customers" />
      {filteredCustomers.map((customer) => (
        <p key={customer.id}>{customer.name}</p>
      ))}
    </>
  );
}
