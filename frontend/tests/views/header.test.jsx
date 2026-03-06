/**
 * These tests verify that HeaderView:
 * 1. Renders the brand, user info, logout button, and language button correctly.
 * 2. Displays the correct role label based on the user's role (Recruiter or Applicant).
 * 3. Calls the appropriate callbacks:
 *    - `onLogout` when the logout button is clicked.
 *    - `navigate` when the brand/logo is clicked.
 *
 * The translation function `t` is mocked to return the key directly.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import HeaderView from '../../src/views/headerView';
import '@testing-library/jest-dom';

/** 
 * Mock translation function.
 * @param {string} key - Translation key
 * @returns {string} Returns the key itself
 */
const t = (key) => key;

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const MockLanguageButton = () => <button>Lang</button>;

describe('HeaderView', () => {
    /**
     * Renders the brand, user info, logout button, and language button.
     * Ensures that user info and buttons are present and logout works.
     */
    it('renders brand, user info, logout button, and language button', () => {
        const mockUser = { username: 'HashMan', role_id: 1 };

        render(
            <HeaderView
                currentUser={mockUser}
                t={t}
                onLogout={mockLogout}
                navigate={mockNavigate}
                LanguageButton={MockLanguageButton}
            />
        );

        expect(screen.getByText('header.brand')).toBeInTheDocument();

        expect(screen.getByText('HashMan')).toBeInTheDocument();
        expect(screen.getByText('header.recruiter')).toBeInTheDocument();

        const logoutButton = screen.getByText('header.logout');
        expect(logoutButton).toBeInTheDocument();
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();

        expect(screen.getByText('Lang')).toBeInTheDocument();
    });

    /**
     * Checks that a non-recruiter user displays "Applicant" role.
     */
    it('shows "Applicant" if user is non-recruiter', () => {
        const mockUser = { username: 'AgdaOlsvenne', role_id: 2 };

        render(
            <HeaderView
                currentUser={mockUser}
                t={t}
                onLogout={mockLogout}
                navigate={mockNavigate}
                LanguageButton={MockLanguageButton}
            />
        );

        expect(screen.getByText('AgdaOlsvenne')).toBeInTheDocument();
        expect(screen.getByText('header.applicant')).toBeInTheDocument();
    });

    /**
     * Verifies that clicking on the brand/logo calls the `navigate` callback with "/".
     */
    it('calls navigate when brand is clicked', () => {
        const mockUser = { username: 'HashMan', role_id: 1 };

        render(
            <HeaderView
                currentUser={mockUser}
                t={t}
                onLogout={mockLogout}
                navigate={mockNavigate}
                LanguageButton={MockLanguageButton}
            />
        );

        const brandDiv = screen.getByText('header.brand').closest('div');
        fireEvent.click(brandDiv);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});