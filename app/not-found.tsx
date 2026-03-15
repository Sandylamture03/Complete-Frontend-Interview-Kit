import Link from "next/link";

export default function NotFound() {
  return (
    <section className="panel stack-md">
      <span className="eyebrow">Not found</span>
      <h1>This study page does not exist.</h1>
      <p>Use the dashboard or track browser to get back to a valid study route.</p>
      <Link href="/" className="primary-link">
        Back to dashboard
      </Link>
    </section>
  );
}
