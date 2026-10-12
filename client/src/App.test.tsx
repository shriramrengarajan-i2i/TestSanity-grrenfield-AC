import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('mounts without throwing', () => {
    render(<App />);

    expect(screen.getByText('Web client')).toBeInTheDocument();
  });
});
