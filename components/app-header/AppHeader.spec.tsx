import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Grid } from 'antd';
import AppHeader from './AppHeader';
import {useTranslation} from "react-i18next";
import {ThemeContext} from "@/contexts/Theme.context";

jest.mock('next/link', () => {
    return function Link ({ children, href }: { children: React.ReactNode; href: string }) {
        return <a href={href}>{children}</a>;
    };
});

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

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

const mockedUseTranslation = useTranslation as jest.Mock;
const mockedUseBreakpoint = Grid.useBreakpoint as jest.Mock;

describe('AppHeader Component', () => {
    const originalUseContext = React.useContext;

    beforeEach(() => {
        mockedUseTranslation.mockReturnValue({
            t: (key: string) => key,
            i18n: {
                changeLanguage: jest.fn(),
                language: 'en',
            },
        });

        jest.spyOn(React, 'useContext').mockImplementation(context => {
            if (context === ThemeContext) {
                return {
                    theme: 'light',
                    toggleTheme: jest.fn(),
                };
            }
            return originalUseContext(context);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('on a desktop screen (md or larger)', () => {
        beforeEach(() => {
            mockedUseBreakpoint.mockReturnValue({ md: true });
        });

        it('should render the horizontal menu', () => {
            render(<AppHeader />);
            expect(screen.getByRole('link', { name: 'header.home' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'header.new_application' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'header.submissions' })).toBeInTheDocument();
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

            expect(screen.getByRole('link', { name: 'header.new_application' })).toBeVisible();
        });

        it('should close the drawer when a menu item is clicked', async () => {
            render(<AppHeader />);
            await userEvent.click(screen.getByRole('button', { name: /menu/i }));
            expect(screen.getByText('Menu')).toBeVisible(); // Drawer is open

            const homeLinkInDrawer = screen.getByRole('link', { name: 'header.home' });
            await userEvent.click(homeLinkInDrawer);

            await waitFor(() => {
                expect(screen.queryByText('Menu')).not.toBeInTheDocument();
            });
        });
    });
});