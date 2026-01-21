import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CooldownWatch } from '../components/CooldownWatch';


describe('CooldownWatch', () => {
    it('renders the remaining time correctly', () => {
        render(<CooldownWatch remainingTime={45} />);
        expect(screen.getByText('45s')).toBeInTheDocument();
    });

    it('renders the "Wait Time" label', () => {
        render(<CooldownWatch remainingTime={45} />);
        expect(screen.getByText('Wait Time')).toBeInTheDocument();
    });

    it('handles 0s remaining time', () => {
        render(<CooldownWatch remainingTime={0} />);
        expect(screen.getByText('0s')).toBeInTheDocument();
    });
});
