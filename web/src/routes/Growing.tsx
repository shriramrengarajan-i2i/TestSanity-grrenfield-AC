import { Card } from '../components/Card';

export function Growing() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Growing</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Growing guides live here, open to every visitor. Full guide content is delivered by the
          content-library work orders.
        </p>
      </Card>
    </section>
  );
}
