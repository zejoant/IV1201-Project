/**
 * @description Unit tests for the ApplicationDetailView component.
 * These tests verify rendering, user interactions, and edge cases
 * using React Testing Library and Vitest.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApplicationDetailView from '../../src/views/applicationDetailView';
import '@testing-library/jest-dom';

/**
 * Mock translation function.
 * Returns the translation key directly instead of localized text.
 *
 * @param {string} key - Translation key
 * @returns {string} The same key
 */
const mockT = (key) => key;

/**
 * Mock application object used for testing.
 * Represents a typical applicant with competences and availability.
 */
const mockApplication = {
    name: 'Agda',
    surname: 'Olsvenne',
    status: 'unhandled',
    competences: [{ name: 'ticket sales', yoe: 3 }, { name: 'lotteries', yoe: 1 }],
    availabilities: [{ from_date: '2025-01-01', to_date: '2025-06-01' }],
};

/**
 * Default props passed to ApplicationDetailView.
 * Can be overridden in individual tests when needed.
 */
const defaultProps = {
    t: mockT,
    loading: false,
    application: mockApplication,
    detailError: null,
    updating: false,
    navigate: vi.fn(),
    handleStatusChange: vi.fn(),
    formatDate: (d) => d,
    getStatusClass: () => 'status-class',
};

/**
 * Test suite for ApplicationDetailView component.
 */
describe('ApplicationDetailView', () => {

    /**
     * Verifies that a loading message is displayed when the component is in loading state.
     */
    it('renders loading state', () => {
        render(
            <ApplicationDetailView {...defaultProps} loading={true} />
        );

        expect(screen.getByText('applicationDetail.loading')).toBeInTheDocument();
    });

    /**
     * Ensures that an error message is shown when no application data is provided.
     */
    it('renders error when application is missing', () => {
        render(
            <ApplicationDetailView {...defaultProps} application={null} />
        );

        expect(screen.getByText('applicationDetail.application_not_found')).toBeInTheDocument();
    });

    /**
     * Tests that the applicant's personal information (name, surname, and title) is rendered correctly.
     */
    it('renders application personal information', () => {
        render(<ApplicationDetailView {...defaultProps} />);

        expect(screen.getByText('Agda')).toBeInTheDocument();
        expect(screen.getByText('Olsvenne')).toBeInTheDocument();
        expect(screen.getByText('applicationDetail.title')).toBeInTheDocument();
    });

    /**
     * Verifies that all competences are rendered with correct years of experience formatting.
     */
    it('renders competences list', () => {
        render(<ApplicationDetailView {...defaultProps} />);

        expect(screen.getByText('applicationDetail.competences.ticket sales - 3 applicationDetail.years')).toBeInTheDocument();
        expect(screen.getByText('applicationDetail.competences.lotteries - 1 applicationDetail.year')).toBeInTheDocument();
    });

    /**
     * Ensures that availability periods are displayed correctly.
     */
    it('renders availability periods', () => {
        render(<ApplicationDetailView {...defaultProps} />);

        expect(screen.getByText('2025-01-01 applicationDetail.to 2025-06-01')).toBeInTheDocument();
    });

    /**
     * Tests that clicking the "back" button triggers navigation to the recruiter page.
     */
    it('calls navigate when back button is clicked', () => {
        const navigateMock = vi.fn();

        render(
            <ApplicationDetailView
                {...defaultProps}
                navigate={navigateMock}
            />
        );

        fireEvent.click(screen.getByText('applicationDetail.back_to_applications'));

        expect(navigateMock).toHaveBeenCalledWith('/recruiter');
    });

    /**
     * Verifies that clicking the "accept" button calls the status change handler with "accepted".
     */
    it('calls handleStatusChange when accept button is clicked', () => {
        const handler = vi.fn();

        render(
            <ApplicationDetailView
                {...defaultProps}
                handleStatusChange={handler}
            />
        );

        fireEvent.click(screen.getByText('applicationDetail.accept'));

        expect(handler).toHaveBeenCalledWith('accepted');
    });

    /**
     * Ensures that the accept button is disabled when the application status is already "accepted".
     */
    it('disables button when status already selected', () => {
        render(
            <ApplicationDetailView
                {...defaultProps}
                application={{ ...mockApplication, status: 'accepted' }}
            />
        );

        expect(screen.getByText('applicationDetail.accept')).toBeDisabled();
    });

});