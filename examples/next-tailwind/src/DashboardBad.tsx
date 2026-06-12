export function DashboardBad() {
  const { data } = useQuery();

  return (
    <main className="min-w-[960px] p-8">
      <div className="flex flex-row gap-4">
        {data.cards.map((card) => (
          <article key={card.id} className="w-[420px] border p-4">
            <h2>{card.title}</h2>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
      <table className="mt-8 w-full">
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
