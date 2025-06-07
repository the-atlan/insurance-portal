import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Grid } from 'antd';
import AppHeader from './AppHeader';

jest.mock('next/link', () => {
    return function Link ({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    };
});

jest.mock('antd', () => {
    const originalAntd = jest.requireActual('antd');
    return {
        ...originalAntd,
        Grid: {
            ...originalAntd.Grid,
            useBreakpoint: jest.fn(),
        },
    };
});

const mockedUseBreakpoint = Grid.useBreakpoint as jest.Mock;

describe('AppHeader Component', () => {
    describe('on a desktop screen (md or larger)', () => {
        beforeEach(() => {
            mockedUseBreakpoint.mockReturnValue({ md: true });
        });

        it('should render the horizontal menu', () => {
            render(<AppHeader />);
            expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
            expect(screen.getByRole('link', { name: 'New Application' })).toBeVisible();
            expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
        });
    });

    describe('on a mobile screen (smaller than md)', () => {
        beforeEach(() => {
            mockedUseBreakpoint.mockReturnValue({ md: false });
        });

        it('should render the hamburger button instead of the horizontal menu', () => {
            render(<AppHeader />);
            expect(screen.getByRole('button', { name: /menu/i })).toBeVisible();

            expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
        });

        it('should open the drawer when the hamburger button is clicked', async () => {
            render(<AppHeader />);
            const hamburgerButton = screen.getByRole('button', { name: /menu/i });
            await userEvent.click(hamburgerButton);

            await waitFor(() => {
                expect(screen.getByText('Menu')).toBeVisible();
            });

            expect(screen.getByRole('link', { name: 'New Application' })).toBeVisible();
        });

        it('should close the drawer when a menu item is clicked', async () => {
            render(<AppHeader />);
            await userEvent.click(screen.getByRole('button', { name: /menu/i }));
            expect(screen.getByText('Menu')).toBeVisible(); // Drawer is open

            await userEvent.click(screen.getByRole('link', { name: 'Home' }));

            await waitFor(() => {
                expect(screen.queryByText('Menu')).not.toBeInTheDocument();
            });
        });
    });
});