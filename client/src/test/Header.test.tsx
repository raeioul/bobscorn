import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../components/Header';


describe('Header', () => {
    it('renders branding', () => {
        render(<Header />);
        expect(screen.getByText((content) => content.includes("Bob's"))).toBeInTheDocument();
    });

    it('contains an "Order Corn" link', () => {
        render(<Header />);
        const links = screen.queryAllByRole('link');
        const orderLink = links.find(link => link.textContent?.includes('Order Corn'));
        expect(orderLink).toBeDefined();
    });
});
