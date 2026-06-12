export function DashboardGood() {
  const { data, isLoading, error } = useQuery();

  if (isLoading) {
    return <main className="p-4 md:p-8">Loading dashboard</main>;
  }

  if (error) {
    return <main role="alert" className="p-4 md:p-8">Unable to load dashboard. Try again.</main>;
  }

  if (data.cards.length === 0) {
    return <main className="p-4 md:p-8">No data yet. Connect a source to get started.</main>;
  }

  return (
    <main className="p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-3">
        {data.cards.map((card) => (
          <article key={card.id} className="rounded border p-4">
            <h2>{card.title}</h2>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button aria-label="Open dashboard settings" className="mt-8 rounded border p-2">
        <SettingsIcon />
      </button>
    </main>
  );
}
