/**
 * @description Unit tests for the ApplicationFormView component.
 * These tests validate form rendering, user interactions,
 * state updates, and submission behavior using Vitest and
 * React Testing Library.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ApplicationFormView from '../../src/views/applicationFormView';
import '@testing-library/jest-dom';

/**
 * Mock translation function.
 * Returns the key directly instead of localized text.
 *
 * @param {string} key - Translation key
 * @returns {string} The same key
 */
const t = (key) => key;

/**
 * Default props used for rendering ApplicationFormView.
 * Individual tests may override these values as needed.
 */
const defaultProps = {
    t,
    competenceId: '',
    setCompetenceId: vi.fn(),
    yearsOfExperience: '',
    setYearsOfExperience: vi.fn(),
    experienceList: [],
    availabilityList: [],
    fromDate: '',
    setFromDate: vi.fn(),
    toDate: '',
    setToDate: vi.fn(),
    error: null,
    success: null,
    isSubmitting: false,
    competenceOptions: [{ competence_id: 1, name: 'lotteries' }, { competence_id: 2, name: 'ticket sales' }],
    loadingCompetences: false,
    fetchError: null,
    handleAddExperience: vi.fn(),
    handleRemoveExperience: vi.fn(),
    handleAddAvailability: vi.fn(),
    handleRemoveAvailability: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    formatDateForDisplay: (d) => d,
    getTodayDate: () => '2025-01-01',
    onBackToProfile: vi.fn(),
};

/**
 * Test suite for ApplicationFormView component.
 */
describe('ApplicationFormView', () => {

    /**
     * Ensures that the form title and subtitle are rendered correctly.
     */
    it('renders form title and subtitle', () => {
        render(<ApplicationFormView {...defaultProps} />);

        expect(screen.getByText('applicationForm.title')).toBeInTheDocument();
        expect(screen.getByText('applicationForm.subtitle')).toBeInTheDocument();
    });

    /**
     * Verifies that clicking the back button triggers navigation to the profile page.
     */
    it('calls back navigation when back button is clicked', () => {
        const backMock = vi.fn();

        render(
            <ApplicationFormView {...defaultProps} onBackToProfile={backMock} />
        );

        fireEvent.click(screen.getByText(/applicationForm.back/));

        expect(backMock).toHaveBeenCalled();
    });

    /**
     * Tests that selecting a competence updates the selected competence ID.
     */
    it('calls setCompetenceId when selecting competence', () => {
        render(<ApplicationFormView {...defaultProps} />);

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: '1' },
        });

        expect(defaultProps.setCompetenceId).toHaveBeenCalled();
    });

    /**
     * Ensures that typing into the experience field updates the years of experience state.
     */
    it('calls setYearsOfExperience when typing experience', () => {
        render(<ApplicationFormView {...defaultProps} />);

        const input = screen.getByPlaceholderText(
            'applicationForm.placeholders.experience_example'
        );

        fireEvent.change(input, { target: { value: '3' } });

        expect(defaultProps.setYearsOfExperience).toHaveBeenCalled();
    });

    /**
     * Verifies that clicking the "add competence" button calls the add experience handler.
     */
    it('calls handleAddExperience when clicking add competence', () => {
        render(<ApplicationFormView {...defaultProps} />);

        fireEvent.click(
            screen.getByText('applicationForm.buttons.add_competence')
        );

        expect(defaultProps.handleAddExperience).toHaveBeenCalled();
    });

    /**
     * Ensures that the experience list is rendered when items are present.
     */
    it('shows experience list when items exist', () => {
        render(
            <ApplicationFormView
                {...defaultProps}
                experienceList={[
                    { competence_name: 'lotteries', yoe: 3 },
                ]}
            />
        );

        expect(screen.getByText('applicationForm.competences.ticket sales')).toBeInTheDocument();
    });

    /**
     * Verifies that clicking the remove button calls the experience removal handler with the correct index.
     */
    it('calls remove experience handler', () => {
        const removeMock = vi.fn();

        render(
            <ApplicationFormView
                {...defaultProps}
                handleRemoveExperience={removeMock}
                experienceList={[
                    { competence_name: 'lotteries', yoe: 3 },
                ]}
            />
        );

        fireEvent.click(screen.getByText('applicationForm.buttons.remove'));

        expect(removeMock).toHaveBeenCalledWith(0);
    });

    /**
     * Ensures that clicking the add period button triggers the availability handler.
     */
    it('adds availability period', () => {
        render(<ApplicationFormView {...defaultProps} />);

        fireEvent.click(screen.getByText('applicationForm.buttons.add_period'));

        expect(defaultProps.handleAddAvailability).toHaveBeenCalled();
    });

    /**
     * Verifies that availability periods are displayed correctly.
     */
    it('renders availability list', () => {
        render(
            <ApplicationFormView
                {...defaultProps}
                availabilityList={[
                    { from_date: '2025-01-01', to_date: '2025-02-01' },
                ]}
            />
        );

        const item = screen.getAllByText('2025-01-01 applicationForm.to 2025-02-01');

        expect(item).toHaveLength(2);
    });

    /**
     * Tests that clicking remove on an availability calls the correct handler with index.
     */
    it('calls remove availability handler', () => {
        const removeMock = vi.fn();

        render(
            <ApplicationFormView
                {...defaultProps}
                availabilityList={[{ from_date: '2025-01-01', to_date: '2025-02-01' }]}
                handleRemoveAvailability={removeMock}
            />
        );

        fireEvent.click(screen.getByText('applicationForm.buttons.remove'));

        expect(removeMock).toHaveBeenCalledWith(0);
    });

    /**
     * Ensures that the submit button is disabled when required lists are empty.
     */
    it('disables submit button when lists are empty', () => {
        render(<ApplicationFormView {...defaultProps} />);

        expect(screen.getByRole('button', { name: /submit/ })).toBeDisabled();
    });

    /**
     * Verifies that the submit button is enabled when all required data is present.
     */
    it('enables submit button when requirements are met', () => {
        render(
            <ApplicationFormView
                {...defaultProps}
                experienceList={[{ competence_name: 'lotteries', yoe: 3 }]}
                availabilityList={[{ from_date: '2025', to_date: '2026' }]}
            />
        );

        expect(screen.getByRole('button', { name: /submit/ })).not.toBeDisabled();
    });

    /**
     * Tests that submitting the form triggers the submit handler.
     */
    it('calls submit handler', () => {
        const submitMock = vi.fn((e) => e.preventDefault());

        render(
            <ApplicationFormView
                {...defaultProps}
                handleSubmit={submitMock}
                experienceList={[{ competence_name: 'lotteries', yoe: 3 }]}
                availabilityList={[{ from_date: '2025', to_date: '2026' }]}
            />
        );

        fireEvent.submit(screen.getByRole('button', { name: /submit/ }));

        expect(submitMock).toHaveBeenCalled();
    });

});