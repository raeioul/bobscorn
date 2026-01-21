import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../components/Footer';


describe('Footer', () => {
    it('renders the copyright branding', () => {
        render(<Footer />);
        expect(screen.getByText((content) => content.includes("raeiouL"))).toBeInTheDocument();
    });

    it('renders the contact email', () => {
        render(<Footer />);
        expect(screen.getByText('raeioul@gmail.com')).toBeInTheDocument();
    });
});
