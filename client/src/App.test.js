import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders initial total values as zero', () => {
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('0 MWh')).toBeInTheDocument();
    expect(screen.getByText('0 FT²')).toBeInTheDocument();
  });

  it('updates total cost when quantity changes', () => {
    const batteryRow = screen.getByRole('row', { name: /MegapackXL/i });
    const input = within(batteryRow).getByLabelText(/quantity count/i);
    fireEvent.change(input, { target: { value: '1' } });

 
    expect(screen.getByText('$120,000')).toBeInTheDocument();
  });

  it('updates total energy when quantity changes', () => {
    const batteryRow = screen.getByRole('row', { name: /MegapackXL/i });
    const input = within(batteryRow).getByLabelText(/quantity count/i);
    fireEvent.change(input, { target: { value: '1' } });

 
    expect(screen.getByText('4 MWh')).toBeInTheDocument();
  });

  it('updates total size when quantity changes', () => {
    const batteryRow = screen.getByRole('row', { name: /MegapackXL/i });
    const input = within(batteryRow).getByLabelText(/quantity count/i);
    fireEvent.change(input, { target: { value: '1' } });

 
    expect(screen.getByText('400 FT²')).toBeInTheDocument();
  });
});