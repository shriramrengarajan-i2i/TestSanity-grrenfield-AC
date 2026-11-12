import { Card } from '../components/Card';

export function Safety() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Safety</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Food safety guidance is available to every visitor. Full content is delivered by the
          content-library work orders.
        </p>
      </Card>
    </section>
  );
}
