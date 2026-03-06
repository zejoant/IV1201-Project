/**
 *
 * These tests verify that RecruiterDashboardView:
 * 1. Renders table headers and application rows correctly.
 * 2. Calls the `requestSort` callback when a table header is clicked.
 * 3. Calls the `handleRowClick` callback when a row is clicked.
 * 4. Displays the loading indicator when `loading` is true.
 * 5. Displays an error message when `error` is set.
 * 6. Shows a "no data" message when the `sortedApplications` array is empty.
 *
 * Mock functions are used for sorting, row click, and status class calculation.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import RecruiterDashboardView from '../../src/views/recruiterDashboardView';
import '@testing-library/jest-dom';

/**
 * Mock translation function.
 * @param {string} key - Translation key
 * @returns {string} Returns the key itself
 */
const t = (key) => key;

describe('RecruiterDashboardView', () => {
    let mockRequestSort, mockGetStatusClass, mockHandleRowClick;

    /** Default props with sample applications */
    const defaultProps = {
        t,
        loading: false,
        error: null,
        sortConfig: { key: 'name', direction: 'asc' },
        sortedApplications: [
            { job_application_id: 1, name: 'Agda', surname: 'Olsvenne', status: 'unhandled' },
            { job_application_id: 2, name: 'Bob', surname: 'Bobber', status: 'accepted' },
        ],
        requestSort: vi.fn(),
        getStatusClass: vi.fn((status) => `status-${status}`),
        handleRowClick: vi.fn(),
    };

    /** Reset mocks before each test */
    beforeEach(() => {
        mockRequestSort = vi.fn();
        mockGetStatusClass = vi.fn((status) => `status-${status}`);
        mockHandleRowClick = vi.fn();
    });

    /**
     * Verifies that the table headers and application rows render correctly
     * including names, surnames, IDs, and status badges.
     */
    it('renders table headers and data rows', () => {
        render(
            <RecruiterDashboardView
                {...defaultProps}
                requestSort={mockRequestSort}
                getStatusClass={mockGetStatusClass}
                handleRowClick={mockHandleRowClick}
            />
        );

        // Check headers
        expect(screen.getByText(/recruiterDashboard.columns.name/)).toBeInTheDocument();
        expect(screen.getByText('recruiterDashboard.columns.surname')).toBeInTheDocument();
        expect(screen.getByText('recruiterDashboard.columns.application_id')).toBeInTheDocument();
        expect(screen.getByText('recruiterDashboard.columns.status')).toBeInTheDocument();

        // Check first application row
        expect(screen.getByText('Agda')).toBeInTheDocument();
        expect(screen.getByText('Olsvenne')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('recruiterDashboard.status.unhandled')).toBeInTheDocument();

        // Check second application row
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Bobber')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('recruiterDashboard.status.accepted')).toBeInTheDocument();
    });

    /**
     * Ensures clicking on table headers calls the `requestSort` callback
     * with the correct column key.
     */
    it('calls requestSort when a header is clicked', () => {
        render(
            <RecruiterDashboardView
                {...defaultProps}
                requestSort={mockRequestSort}
                getStatusClass={mockGetStatusClass}
                handleRowClick={mockHandleRowClick}
            />
        );

        const nameHeader = screen.getByText(/recruiterDashboard.columns.name/);
        fireEvent.click(nameHeader);
        expect(mockRequestSort).toHaveBeenCalledWith('name');

        const statusHeader = screen.getByText('recruiterDashboard.columns.status');
        fireEvent.click(statusHeader);
        expect(mockRequestSort).toHaveBeenCalledWith('status');
    });

    /**
     * Verifies that clicking a table row calls `handleRowClick`
     * with the correct application object.
     */
    it('calls handleRowClick when a row is clicked', () => {
        render(
            <RecruiterDashboardView
                {...defaultProps}
                requestSort={mockRequestSort}
                getStatusClass={mockGetStatusClass}
                handleRowClick={mockHandleRowClick}
            />
        );

        const row = screen.getByText('Agda').closest('tr');
        fireEvent.click(row);
        expect(mockHandleRowClick).toHaveBeenCalledWith(defaultProps.sortedApplications[0]);
    });

    /**
     * Checks that the loading indicator is displayed when `loading` is true.
     */
    it('displays loading indicator when loading is true', () => {
        render(
            <RecruiterDashboardView {...defaultProps} loading={true} />
        );
        expect(screen.getByText('recruiterDashboard.loading')).toBeInTheDocument();
    });

    /**
     * Ensures an error message is displayed if `error` is set.
     */
    it('displays error message when error is set', () => {
        render(
            <RecruiterDashboardView {...defaultProps} error="recruiterDashboard.error_occurred" />
        );
        expect(screen.getByText('recruiterDashboard.error_occurred')).toBeInTheDocument();
    });

    /**
     * Verifies that the "no data" message is shown when the applications array is empty.
     */
    it('shows no data message when applications array is empty', () => {
        render(
            <RecruiterDashboardView {...defaultProps} sortedApplications={[]} />
        );
        expect(screen.getByText('recruiterDashboard.no_data')).toBeInTheDocument();
    });
});