import { Card } from '../components/Card';

export function Recipes() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Recipes</h1>
      <Card className="mt-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Recipes are open to browse with no registration. Full recipe content is delivered by the
          content-library work orders.
        </p>
      </Card>
    </section>
  );
}
