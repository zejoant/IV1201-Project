/**
 *
 * These tests verify that PersonPageView:
 * 1. Displays the welcome section including the username and subtitle.
 * 2. Renders all personal information fields correctly (name, surname, username, email, person number).
 * 3. Calls the `onApplyNow` callback when the "Apply Now" button is clicked.
 * 4. Shows default text for missing optional fields (name, surname, email, etc.).
 *
 * The translation function `t` is mocked to return the key directly for testing.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import PersonPageView from '../../src/views/personPageView';
import '@testing-library/jest-dom';

describe('PersonPageView', () => {
    /** Mock user data with all fields */
    const mockUser = {
        username: 'HashMan',
        name: 'Hash',
        surname: 'Man',
        email: 'hashman@example.com',
        person_number: '123456-7890'
    };

    /** Mock callback functions */
    const mockOnApplyNow = vi.fn();
    const mockOnViewMyApplications = vi.fn();

    /**
     * Mock translation function.
     * @param {string} key - Translation key
     * @returns {string} Returns the key itself
     */
    const t = (key) => key;

    /**
     * Checks that the welcome section renders correctly with the username
     * and welcome subtitle.
     */
    it('renders the welcome section with username', () => {
        render(
            <PersonPageView
                currentUser={mockUser}
                t={t}
                onApplyNow={mockOnApplyNow}
                onViewMyApplications={mockOnViewMyApplications}
            />
        );

        expect(screen.getByText(/personPage.welcome_title/i)).toBeInTheDocument();
        expect(screen.getAllByText(mockUser.username).length).toBe(2);
        expect(screen.getByText(/personPage.welcome_subtitle/i)).toBeInTheDocument();
    });

    /**
     * Verifies that all personal information fields are rendered correctly.
     */
    it('renders all personal information fields correctly', () => {
        render(
            <PersonPageView
                currentUser={mockUser}
                t={t}
                onApplyNow={mockOnApplyNow}
                onViewMyApplications={mockOnViewMyApplications}
            />
        );

        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser.surname)).toBeInTheDocument();
        expect(screen.getAllByText(mockUser.username).length).toBe(2);
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
        expect(screen.getByText(mockUser.person_number)).toBeInTheDocument();
    });

    /**
     * Ensures that clicking the "Apply Now" button triggers the onApplyNow callback.
     */
    it('calls onApplyNow when "Apply Now" button is clicked', () => {
        render(
            <PersonPageView
                currentUser={mockUser}
                t={t}
                onApplyNow={mockOnApplyNow}
                onViewMyApplications={mockOnViewMyApplications}
            />
        );

        const applyButton = screen.getByText('personPage.actions.apply_now');
        fireEvent.click(applyButton);
        expect(mockOnApplyNow).toHaveBeenCalled();
    });

    /**
     * Tests that default text is displayed when optional fields are missing
     * (name, surname, email, person number).
     */
    it('renders default text when optional fields are missing', () => {
        const incompleteUser = { username: 'TestUser' };
        render(
            <PersonPageView
                currentUser={incompleteUser}
                t={t}
                onApplyNow={mockOnApplyNow}
                onViewMyApplications={mockOnViewMyApplications}
            />
        );

        expect(screen.getAllByText('TestUser').length).toBe(2);
        expect(screen.getAllByText(/personPage.not_provided/i).length).toBeGreaterThan(0);
    });
});