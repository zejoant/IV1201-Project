import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import ApplicationFormPresenter from '../../src/presenters/applicationFormPresenter';
import { UserContext } from '../../src/UserContext';

/**
 * Mocks the ApplicationFormView component.
 *
 * Replaces the real view with a minimal controlled test form that exposes:
 * - Competence selection
 * - Experience input
 * - Availability date inputs
 * - Submit handling
 * - Error & success rendering
 *
 * This allows isolated testing of ApplicationFormPresenter logic.
 */
vi.mock('../../src/views/applicationFormView', () => ({
    default: vi.fn((props) => (
        <form data-testid="app-form" onSubmit={props.handleSubmit}>

            <select data-testid="competence" value={props.competenceId} onChange={(e) => props.setCompetenceId(e.target.value)}>
                <option value="">Select</option>
                {props.competenceOptions.map((c) => (
                    <option key={c.competence_id} value={c.competence_id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <input data-testid="experience" value={props.yearsOfExperience} onChange={(e) => props.setYearsOfExperience(e.target.value)}/>
            <button type="button" data-testid="add-experience" onClick={props.handleAddExperience}>
                Add Experience
            </button>

            <input data-testid="from-date" value={props.fromDate} onChange={(e) => props.setFromDate(e.target.value)}/>
            <input data-testid="to-date" value={props.toDate} onChange={(e) => props.setToDate(e.target.value)}/>
            <button type="button" data-testid="add-availability" onClick={props.handleAddAvailability}>
                Add Availability
            </button>

            {props.error && <div data-testid="error">{props.error}</div>}
            {props.success && <div data-testid="success">{props.success}</div>}
            
            <button type="submit" disabled={props.isSubmitting}>
                Submit
            </button>
        </form>
    )),
}));

/**
 * Mock competence list returned from backend.
 *
 * @type {Array<{competence_id: number, name: string}>}
 */
const mockCompetences = [{ competence_id: 1, name: 'ticket sales' }, { competence_id: 2, name: 'lotteries' }];

/**
 * Renders a component wrapped in UserContext.
 *
 * @param {React.ReactNode} ui - Component to render
 * @param {Function} [logoutMock] - Optional logout mock function
 * @returns {ReturnType<typeof render>}
 */
const renderWithContext = (ui, logoutMock = vi.fn()) => {
    return render(
        <UserContext.Provider value={{ logout: logoutMock }}>
            {ui}
        </UserContext.Provider>
    );
};

/**
 * Integration test suite for ApplicationFormPresenter.
 *
 * Covers:
 * - Competence fetching
 * - Authorization handling
 * - Adding experience validation
 * - Availability overlap validation
 * - Form submission
 * - Logout on unauthorized responses
 */
describe('ApplicationFormPresenter', () => {
    let fetchMock;
    let logoutMock;
    let onCompleteMock;
    let onBackMock;

    /**
     * Setup before each test.
     * - Resets mocks
     * - Spies on global fetch
     */
    beforeEach(() => {
        logoutMock = vi.fn();
        onCompleteMock = vi.fn();
        onBackMock = vi.fn();

        fetchMock = vi.spyOn(global, 'fetch');
    });

    /**
     * Cleanup after each test.
     * Restores all mocked functions.
     */
    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Ensures competences are fetched on component mount
     * and rendered into the select dropdown.
     */
    it('fetches competences on mount', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(
            <ApplicationFormPresenter
                onApplicationComplete={onCompleteMock}
                onBackToProfile={onBackMock}
            />,
            logoutMock
        );

        await waitFor(() =>
            expect(fetchMock).toHaveBeenCalledWith(
                '/application/list_competences',
                expect.any(Object)
            )
        );

        expect(screen.getByTestId('competence').children.length).toBe(3);
    });

    /**
     * Ensures logout is triggered when backend returns 403
     * during competence fetch.
     */
    it('calls logout when competence fetch returns 403', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 403,
            json: async () => ({ error: 'unauthorized' }),
        });

        renderWithContext(
            <ApplicationFormPresenter />,
            logoutMock
        );

        await waitFor(() => {expect(logoutMock).toHaveBeenCalled()});
    });

    /**
     * Verifies a valid experience entry is added without errors.
     */
    it('adds experience successfully', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(<ApplicationFormPresenter />);

        await waitFor(() => screen.getByTestId('competence'));

        fireEvent.change(screen.getByTestId('competence'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('experience'), { target: { value: '3' } });
        fireEvent.click(screen.getByTestId('add-experience'));

        await waitFor(() => { expect(screen.queryByTestId('error')).toBeNull() });
    });

    /**
     * Ensures validation error appears when adding experience
     * without selecting a competence.
     */
    it('shows error when adding experience without competence', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(<ApplicationFormPresenter />);

        await waitFor(() => screen.getByTestId('add-experience'));

        fireEvent.click(screen.getByTestId('add-experience'));

        await waitFor(() => { expect(screen.getByTestId('error')).toHaveTextContent('applicationForm.errors.select_competence') });
    });

    /**
     * Verifies availability can be added successfully.
     */
    it('adds availability successfully', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(<ApplicationFormPresenter />);

        await waitFor(() => screen.getByTestId('from-date'));

        const today = new Date().toISOString().split('T')[0];

        fireEvent.change(screen.getByTestId('from-date'), { target: { value: today } });
        fireEvent.change(screen.getByTestId('to-date'), { target: { value: today } });
        fireEvent.click(screen.getByTestId('add-availability'));

        await waitFor(() => { expect(screen.queryByTestId('error')).toBeNull() });
    });

    /**
     * Ensures overlapping availability periods
     * trigger validation error.
     */
    it('shows error for overlapping availability', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(<ApplicationFormPresenter />);

        await waitFor(() => screen.getByTestId('from-date'));

        const today = new Date().toISOString().split('T')[0];

        fireEvent.change(screen.getByTestId('from-date'), { target: { value: today } });
        fireEvent.change(screen.getByTestId('to-date'), { target: { value: today } });
        fireEvent.click(screen.getByTestId('add-availability'));

        fireEvent.change(screen.getByTestId('from-date'), { target: { value: today } });
        fireEvent.change(screen.getByTestId('to-date'), { target: { value: today } });
        fireEvent.click(screen.getByTestId('add-availability'));

        await waitFor(() => { expect(screen.getByTestId('error')).toHaveTextContent('applicationForm.errors.overlapping_period') });
    });

    /**
     * Ensures application submits successfully
     * when valid experience and availability are provided.
     */
    it('submits application successfully', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ success: mockCompetences }),
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ success: true }),
            });

        renderWithContext(
            <ApplicationFormPresenter
                onApplicationComplete={onCompleteMock}
            />
        );

        await waitFor(() => screen.getByTestId('competence'));

        fireEvent.change(screen.getByTestId('competence'), {target: {value: '1'}});
        fireEvent.change(screen.getByTestId('experience'), {target: {value: '5'}});
        fireEvent.click(screen.getByTestId('add-experience'));

        const today = new Date().toISOString().split('T')[0];

        fireEvent.change(screen.getByTestId('from-date'), {target: { value: today }});
        fireEvent.change(screen.getByTestId('to-date'), {target: { value: today }});
        fireEvent.click(screen.getByTestId('add-availability'));

        fireEvent.submit(screen.getByTestId('app-form'));

        await waitFor(() => {expect(fetchMock).toHaveBeenLastCalledWith('/application/apply', expect.any(Object))});
        await waitFor(() => {expect(screen.getByTestId('success')).toHaveTextContent('submitted')});
    });

    /**
   * Ensures error appears if attempting to submit
   * without adding required experience.
   */
    it('shows error if submit without experience', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ success: mockCompetences }),
        });

        renderWithContext(<ApplicationFormPresenter />);

        await waitFor(() => screen.getByTestId('app-form'));

        fireEvent.submit(screen.getByTestId('app-form'));

        await waitFor(() => {expect(screen.getByTestId('error')).toHaveTextContent('applicationForm.errors.add_competence_required')});
    });

    /**
   * Ensures logout is triggered when backend
   * returns 403 during submission.
   */
    it('calls logout when submit returns 403', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ success: mockCompetences }),
            })
            .mockResolvedValueOnce({
                ok: false,
                status: 403,
                json: async () => ({ error: 'unauthorized' }),
            });

        renderWithContext(
            <ApplicationFormPresenter />,
            logoutMock
        );

        await waitFor(() => screen.getByTestId('competence'));

        fireEvent.change(screen.getByTestId('competence'), {target: {value: '1'}});
        fireEvent.change(screen.getByTestId('experience'), {target: {value: '2'}});

        fireEvent.click(screen.getByTestId('add-experience'));

        const today = new Date().toISOString().split('T')[0];

        fireEvent.change(screen.getByTestId('from-date'), {target: {value: today}});
        fireEvent.change(screen.getByTestId('to-date'), {target: {value: today}});
        fireEvent.click(screen.getByTestId('add-availability'));
        fireEvent.submit(screen.getByTestId('app-form'));

        await waitFor(() => {expect(logoutMock).toHaveBeenCalled()});
    });
});