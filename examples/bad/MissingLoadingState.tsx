export function ProductsPanel() {
  const { data } = useQuery();
  return <section>{data.products.map((product) => <p key={product.id}>{product.name}</p>)}</section>;
}
