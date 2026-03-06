import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ApplicationDetail from '../../src/presenters/applicationDetailPresenter';
import { UserContext } from '../../src/UserContext';


/**
* Mocked navigation function used to verify redirects.
* @type {ReturnType<typeof vi.fn>}
*/
const mockNavigate = vi.fn();
/**
 * Mock implementation of useParams().
 * Allows tests to control route parameters.
 * @type {ReturnType<typeof vi.fn>}
 */
const mockUseParams = vi.fn();
/**
 * Mock implementation of useLocation().
 * Used to simulate router state passing.
 * @type {ReturnType<typeof vi.fn>}
 */
const mockUseLocation = vi.fn();

/**
 * Mocks react-router-dom hooks used by the presenter.
 * Enables isolated testing without real routing.
 */
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));


/**
 * Mocked ApplicationDetailView component.
 *
 * Provides a minimal UI surface exposing:
 * - loading indicator
 * - error rendering
 * - application status display
 * - accept/reject buttons
 *
 * This allows testing presenter logic independently
 * from visual implementation.
 */
vi.mock('../../src/views/applicationDetailView', () => ({
  default: vi.fn((props) => (
    <div>
      {props.loading && <div data-testid="loading">Loading...</div>}
      {props.detailError && (
        <div data-testid="error">{props.detailError}</div>
      )}
      {props.application && (
        <div data-testid="application">
          <span data-testid="status">
            {props.application.status}
          </span>
          <button data-testid="accept-btn" onClick={() => props.handleStatusChange('accepted')} disabled={props.updating}>
            Accept
          </button>
          <button data-testid="reject-btn" onClick={() => props.handleStatusChange('rejected')} disabled={props.updating}>
            Reject
          </button>
        </div>
      )}
    </div>
  )),
}));

/**
 * Minimal application object used when navigating
 * from the application list page.
 *
 * @type {Object}
 */
const baseApplication = { job_application_id: 1, person_id: 10, status: 'unhandled', name: 'Agda', surname: 'Olsvenne' };

/**
 * Fully populated application returned by detail endpoint.
 *
 * @type {Object}
 */
const fullApplication = {
  ...baseApplication, competences: [], availability: [],
};

/**
 * Utility helper that renders a component wrapped
 * with UserContext provider.
 *
 * @param {React.ReactNode} ui - Component under test
 * @param {Function} [logoutMock] - logout mock
 * @returns {ReturnType<typeof render>}
 */
const renderWithContext = (
  ui,
  logoutMock = vi.fn()
) => {
  return render(
    <UserContext.Provider value={{ logout: logoutMock }}>
      {ui}
    </UserContext.Provider>
  );
};

/**
 * Integration tests for ApplicationDetail presenter.
 *
 * Verifies:
 * - Data loading strategies
 * - Router state handling
 * - Backend fetching logic
 * - Status updates and rollback behavior
 * - Authorization handling (403 → logout)
 * - Loading and error UI states
 */
describe('ApplicationDetail', () => {
  let fetchMock;
  let logoutMock;

  /**
   * Setup before each test:
   * - resets mocks
   * - spies on global fetch
   * - provides default route parameter
   */
  beforeEach(() => {
    logoutMock = vi.fn();
    fetchMock = vi.spyOn(global, 'fetch');
    mockUseParams.mockReturnValue({ id: '1' });
  });

  /**
   * Restores all mocks after each test execution.
   */
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Ensures presenter loads application from router state
   * and then fetches full application details.
   */
  it('loads application from router state and fetches full details', async () => {
    mockUseLocation.mockReturnValue({ state: { application: baseApplication } });
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => { expect(fetchMock).toHaveBeenCalledWith('/application/get_application', expect.any(Object)) });
    expect(screen.getByTestId('status')).toHaveTextContent('unhandled');
  });

  /**
   * Ensures presenter fetches application list first
   * when router state is unavailable.
   */
  it('fetches list when no router state exists', async () => {
    mockUseLocation.mockReturnValue({ state: null });
    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: [baseApplication] }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => { expect(fetchMock).toHaveBeenCalledTimes(2) });
    expect(screen.getByTestId('application')).toBeInTheDocument();
  });

  /**
   * Displays error message when requested application
   * cannot be located in backend response.
   */
  it('shows error when application is not found', async () => {
    mockUseLocation.mockReturnValue({ state: null });
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: [] }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => { expect(screen.getByTestId('error')).toHaveTextContent('applicationDetail.errors.application_not_found') });
  });

  /**
   * Verifies logout is triggered when backend
   * returns HTTP 403 during list fetch.
   */
  it('logs out when list fetch returns 403', async () => {
    mockUseLocation.mockReturnValue({ state: null });
    fetchMock.mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({ error: 'unauthorized' }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => { expect(logoutMock).toHaveBeenCalled() });
  });

  /**
   * Ensures application status updates successfully
   * after accepting an application.
   */
  it('updates status successfully', async () => {
    mockUseLocation.mockReturnValue({ state: { application: baseApplication } });

    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: { status: 'accepted' } }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => screen.getByTestId('accept-btn'));

    fireEvent.click(screen.getByTestId('accept-btn'));

    await waitFor(() => { expect(fetchMock).toHaveBeenLastCalledWith('/application/update_application', expect.any(Object)); });
    await waitFor(() => { expect(screen.getByTestId('status')).toHaveTextContent('accepted') });
  });

  /**
   * Ensures optimistic UI update rolls back when
   * backend update fails.
   */
  it('rolls back status when update fails', async () => {
    mockUseLocation.mockReturnValue({ state: { application: baseApplication } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) })
      .mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ error: 'conflict' }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => screen.getByTestId('accept-btn'));

    fireEvent.click(screen.getByTestId('accept-btn'));

    await waitFor(() => { expect(screen.getByTestId('status')).toHaveTextContent('unhandled') });
    expect(screen.getByTestId('error')).toHaveTextContent('update_application.errors.conflict');
  });

  /**
   * Verifies logout occurs when update endpoint
   * returns HTTP 403.
   */
  it('logs out when update returns 403', async () => {
    mockUseLocation.mockReturnValue({ state: { application: baseApplication } });
    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) })
      .mockResolvedValueOnce({ ok: false, status: 403, json: async () => ({ error: 'unauthorized' }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    await waitFor(() => screen.getByTestId('accept-btn'));

    fireEvent.click(screen.getByTestId('accept-btn'));

    await waitFor(() => { expect(logoutMock).toHaveBeenCalled() });
  });

  /**
  * Ensures loading indicator appears during
  * initial data fetch and disappears afterward.
  */
  it('shows loading indicator initially', async () => {
    mockUseLocation.mockReturnValue({ state: { application: baseApplication } });

    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: fullApplication }) });

    renderWithContext(<ApplicationDetail />, logoutMock);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => { expect(screen.queryByTestId('loading')).toBeNull() });
  });
});