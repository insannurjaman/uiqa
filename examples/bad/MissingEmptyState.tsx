export function OrdersList({ orders }) {
  return <ul>{orders.map((order) => <li key={order.id}>{order.name}</li>)}</ul>;
}
