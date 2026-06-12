export function FormGood({ emailError }: { emailError?: string }) {
  return (
    <form className="mx-auto max-w-xl p-4 md:p-8">
      <label className="block text-sm font-medium" htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        className="mt-2 w-full rounded border p-2"
        aria-invalid={Boolean(emailError)}
        aria-describedby="email-help"
      />
      <p id="email-help" className="mt-1 text-sm text-slate-500">
        {emailError ? emailError : "Use the email address where you want account updates."}
      </p>
      <button type="submit" className="mt-4 rounded bg-slate-900 px-4 py-2 text-white">Create account</button>
    </form>
  );
}
