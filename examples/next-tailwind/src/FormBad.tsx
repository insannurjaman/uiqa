export function FormBad() {
  return (
    <form className="mx-auto w-[640px] p-8">
      <label className="block text-sm font-medium">Email</label>
      <input name="email" className="mt-2 w-full border p-2" />
      <button type="submit" className="mt-4 bg-slate-900 px-4 py-2 text-white">Create account</button>
    </form>
  );
}
