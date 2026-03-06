import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PersonPagePresenter from '../../src/presenters/personPagePresenter';
import { UserContext } from '../../src/UserContext';

/**
 * Mock react-i18next translation hook.
 *
 * Returns the translation key itself to avoid loading
 * translation files during testing.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

/**
 * Mock PersonPageView component.
 *
 * Instead of rendering the real UI, this mock exposes
 * received props so tests can verify presenter behavior.
 */
vi.mock('../../src/views/personPageView', () => ({
    default: vi.fn((props) => (
        <div>
            <div data-testid="username">
                {props.currentUser?.username}
            </div>
            <button data-testid="apply-btn" onClick={props.onApplyNow}>
                Apply
            </button>
        </div>
    )),
}));

/**
 * Mock user object used in tests.
 */
const mockUser = {
    username: 'AgdaOlsvenne',
    name: 'Agda',
    surname: 'Olsvenne',
};

/**
 * Utility function that renders a component wrapped
 * with UserContext.Provider.
 *
 * @param {React.ReactElement} ui - Component to render.
 * @param {Object|null} [user=mockUser] - User value supplied to context.
 * @returns {ReturnType<typeof render>}
 */
const renderWithContext = (ui, user = mockUser) => {
    return render(
        <UserContext.Provider value={{ currentUser: user }}>
            {ui}
        </UserContext.Provider>
    );
};

/**
 * Test suite for PersonPagePresenter behavior.
 */
describe('PersonPagePresenter', () => {
    let applyMock;

    beforeEach(() => {
        applyMock = vi.fn();
        vi.clearAllMocks();
    });

    /**
     * Verifies that the presenter reads the current user
     * from UserContext and passes it to the view.
     */
    it('renders current user from context', () => {
        renderWithContext(
            <PersonPagePresenter
                onApplyNow={applyMock}
            />
        );

        expect(screen.getByTestId('username')).toHaveTextContent('AgdaOlsvenne');
    });

    /**
     * Ensures the component handles absence of a user
     * without crashing and renders an empty username.
     */
    it('renders correctly when no user is present', () => {
        renderWithContext(
            <PersonPagePresenter
                onApplyNow={applyMock}
            />,
            null
        );

        expect(screen.getByTestId('username')).toHaveTextContent('');
    });

    /**
     * Confirms that clicking the Apply button triggers
     * the provided onApplyNow callback exactly once.
     */
    it('calls onApplyNow when apply button is clicked', () => {
        renderWithContext(
            <PersonPagePresenter
                onApplyNow={applyMock}
            />
        );

        fireEvent.click(screen.getByTestId('apply-btn'));

        expect(applyMock).toHaveBeenCalledTimes(1);
    });

    /**
     * Validates that PersonPagePresenter passes the correct
     * props to PersonPageView, including:
     *  - currentUser from context
     *  - onApplyNow callback
     *  - translation function (t)
     */
    it('passes correct props to PersonPageView', async () => {
        const ViewMock = await import('../../src/views/personPageView');

        renderWithContext(
            <PersonPagePresenter onApplyNow={applyMock} />
        );

        const firstCallProps = ViewMock.default.mock.calls[0][0];

        expect(firstCallProps).toMatchObject({currentUser: mockUser, onApplyNow: applyMock});
        expect(typeof firstCallProps.t).toBe('function');
    });
});