export function SearchGood({ results }) {
  return (
    <section className="p-4 md:p-6">
      <input type="search" placeholder="Search customers" className="w-full rounded border p-2" />
      <div className="mt-4">
        {results.length === 0 ? (
          <p>No results found. Try a different search or clear filters.</p>
        ) : (
          results.map((result) => <p key={result.id}>{result.name}</p>)
        )}
      </div>
    </section>
  );
}
