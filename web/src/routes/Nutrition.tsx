import { Card } from '../components/Card';

export function Nutrition() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Nutrition</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Nutrition facts are available to every visitor without an account. Full content is
          delivered by the content-library work orders.
        </p>
      </Card>
    </section>
  );
}
