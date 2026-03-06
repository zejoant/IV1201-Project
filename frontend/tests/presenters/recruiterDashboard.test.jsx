import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RecruiterDashboard from '../../src/presenters/recruiterDashboardPresenter';
import { UserContext } from '../../src/UserContext';

/**
 * Mock translation hook.
 *
 * Returns translation keys directly to avoid loading
 * localization files during tests.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

/**
 * Mock React Router navigation.
 * Allows verification of navigation calls.
 */
const navigateMock = vi.fn();

/**
 * Partially mocks react-router-dom by replacing `useNavigate`
 * with a mock function. This prevents real navigation during
 * tests while keeping all other router functionality intact.
 */
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

/**
 * Mock RecruiterDashboardView.
 *
 * This replaces the real UI and exposes presenter props
 * for verification through rendered test elements.
 */
vi.mock('../../src/views/recruiterDashboardView', () => ({
    default: vi.fn((props) => (
        <div>
            {props.loading && (
                <div data-testid="loading">Loading</div>
            )}

            {props.error && (
                <div data-testid="error">{props.error}</div>
            )}

            <ul data-testid="list">
                {props.sortedApplications.map((app) => (
                    <li key={app.job_application_id} data-testid="row" onClick={() => props.handleRowClick(app)}>
                        {app.name}
                    </li>
                ))}
            </ul>

            {/* Sort Button */}
            <button data-testid="sort-btn" onClick={() => props.requestSort('name')}>
                Sort
            </button>
        </div>
    )),
}));

/**
 * Mock logout function injected via UserContext.
 */
const mockLogout = vi.fn();

/**
 * Mock application dataset used for testing.
 */
const mockApps = [{ job_application_id: 1, name: 'Berra', status: 'accepted' }, { job_application_id: 2, name: 'Agda', status: 'rejected' }];

/**
 * Renders RecruiterDashboard wrapped in UserContext.
 *
 * @returns {ReturnType<typeof render>}
 */
const renderDashboard = () => {
    return render(
        <UserContext.Provider value={{ logout: mockLogout }}>
            <RecruiterDashboard />
        </UserContext.Provider>
    );
};

/**
 * Test suite validating RecruiterDashboard presenter behavior.
 */
describe('RecruiterDashboard', () => {

    /**
   * Reset mocks and stub fetch before each test
   * to ensure isolation between test cases.
   */
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    /**
    * Ensures applications are fetched on mount and rendered
    * after loading completes.
    */
    it('fetches and displays applications on mount', async () => {
        fetch.mockResolvedValueOnce({ok: true, status: 200, json: async () => ({success: mockApps})});

        renderDashboard();

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        await waitFor(() => {expect(screen.getAllByTestId('row')).toHaveLength(2)});
        expect(fetch).toHaveBeenCalledWith('/application/list_applications', { credentials: 'include' });
    });

    /**
     * Verifies that a 403 response triggers logout,
     * indicating an expired or invalid session.
     */
    it('logs out on 403 response', async () => {
        fetch.mockResolvedValueOnce({ok: false, status: 403, json: async () => ({})});

        renderDashboard();

        await waitFor(() => {expect(mockLogout).toHaveBeenCalled()});
    });

    /**
   * Confirms that network failures display an
   * offline error message.
   */
    it('shows error on fetch failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        renderDashboard();

        await waitFor(() => {expect(screen.getByTestId('error')).toHaveTextContent('recruiterDashboard.errors.offline')});
    });

     /**
   * Ensures applications are sorted alphabetically
   * when a sort request is triggered.
   */
    it('sorts applications by name when sort is requested', async () => {
        fetch.mockResolvedValueOnce({ok: true, status: 200, json: async () => ({success: mockApps})});

        renderDashboard();

        await waitFor(() => {expect(screen.getAllByTestId('row')).toHaveLength(2)});

        let rows = screen.getAllByTestId('row');
        expect(rows[0]).toHaveTextContent('Berra');
        expect(rows[1]).toHaveTextContent('Agda');

        fireEvent.click(screen.getByTestId('sort-btn'));

        rows = screen.getAllByTestId('row');
        expect(rows[0]).toHaveTextContent('Agda');
        expect(rows[1]).toHaveTextContent('Berra');
    });

    /**
   * Verifies toggling between ascending and descending
   * sort order when the same column is selected repeatedly.
   */
    it('toggles sort direction when clicking same column twice', async () => {
        fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: mockApps }) });

        renderDashboard();

        await waitFor(() => screen.getAllByTestId('row'));

        const sortBtn = screen.getByTestId('sort-btn');

        fireEvent.click(sortBtn);
        let rows = screen.getAllByTestId('row');
        expect(rows[0]).toHaveTextContent('Agda');

        fireEvent.click(sortBtn);
        rows = screen.getAllByTestId('row');
        expect(rows[0]).toHaveTextContent('Berra');
    });

    /**
   * Ensures clicking an application row navigates
   * to the application details page with correct state.
   */
    it('navigates when row is clicked', async () => {
        fetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: mockApps }) });

        renderDashboard();

        await waitFor(() => screen.getAllByTestId('row'));

        fireEvent.click(screen.getAllByTestId('row')[1]);

        expect(navigateMock).toHaveBeenCalledWith('/recruiter/application/2', { state: { application: mockApps[1] } });
    });

    /**
   * Confirms that the presenter supplies the correct
   * initial props and helper functions to the view.
   */
    it('passes correct props to RecruiterDashboardView', async () => {
        const ViewMock = await import('../../src/views/recruiterDashboardView');
        fetch.mockResolvedValueOnce({ok: true, status: 200, json: async () => ({success: mockApps})});

        renderDashboard();

        await waitFor(() => {expect(ViewMock.default).toHaveBeenCalled()});

        const props = ViewMock.default.mock.calls[0][0];

        expect(props).toMatchObject({loading: true, error: '', sortConfig: {key: 'job_application_id', direction: 'asc'}});
        expect(typeof props.requestSort).toBe('function');
        expect(typeof props.handleRowClick).toBe('function');
        expect(typeof props.getStatusClass).toBe('function');
        expect(typeof props.t).toBe('function');
    });
});