import { Card } from '../components/Card';

export function Home() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Home</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Welcome to MicroGreens — browse freely, no account needed. Full content is delivered by
          the content-library work orders.
        </p>
      </Card>
    </section>
  );
}
