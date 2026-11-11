import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';
import { Input } from '../input';
import { Checkbox } from '../checkbox';
import { Badge } from '../badge';
import { Avatar } from '../avatar';
import { Card } from '../card';

describe('Shared UI Atoms', () => {
  describe('Button', () => {
    it('should render label and respond to click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply variant styles correctly', () => {
      const { rerender } = render(<Button variant="danger">Delete</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-red');

      rerender(<Button variant="secondary">Cancel</Button>);
      expect(btn.className).toContain('border');
    });

    it('should be disabled when disabled prop is passed', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Input', () => {
    it('should render input and accept text changes', () => {
      const handleChange = vi.fn();
      render(<Input placeholder="Search..." onChange={handleChange} />);
      const input = screen.getByPlaceholderText('Search...');
      fireEvent.change(input, { target: { value: 'Sarah' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should show error state styling when error prop is provided', () => {
      render(<Input error="Field is required" placeholder="Email" />);
      expect(screen.getByText('Field is required')).toBeInTheDocument();
    });
  });

  describe('Checkbox', () => {
    it('should toggle checked state on change', () => {
      const handleChange = vi.fn();
      render(<Checkbox aria-label="select-row" checked={false} onChange={handleChange} />);
      const cb = screen.getByRole('checkbox');
      expect(cb).not.toBeChecked();
      fireEvent.click(cb);
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('should render badge text', () => {
      render(<Badge variant="success">Active</Badge>);
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Avatar', () => {
    it('should render initials and name', () => {
      render(<Avatar name="Sarah Jenkins" />);
      expect(screen.getByText('SJ')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('should render card children', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });
  });
});
