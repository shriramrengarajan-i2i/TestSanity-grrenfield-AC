import { Card } from '../components/Card';

export function Varieties() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Varieties</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Explore microgreen varieties here, no sign-in required. Full catalogue content is
          delivered by the content-library work orders.
        </p>
      </Card>
    </section>
  );
}
