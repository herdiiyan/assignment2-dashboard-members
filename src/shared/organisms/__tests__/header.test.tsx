import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../header';

describe('Header Organism', () => {
  it('should render default user name and role', () => {
    render(<Header />);
    expect(screen.getByText('Alex Vance')).toBeDefined;
    expect(screen.getByText('Lead Architect')).toBeDefined;
  });

  it('should render custom user name and role when provided', () => {
    render(<Header userName="John Doe" userRole="Frontend Dev" />);
    expect(screen.getByText('John Doe')).toBeDefined;
    expect(screen.getByText('Frontend Dev')).toBeDefined;
  });
});
