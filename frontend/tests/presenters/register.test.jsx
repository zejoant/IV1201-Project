import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import RegisterPresenter from '../../src/presenters/registerPresenter';

/**
 * Mock implementation for react-i18next's useTranslation hook
 * to return the key itself for testing purposes.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

/**
 * Mock implementation of the RegisterView component.
 * Captures props for testing and simulates form inputs,
 * submit button, password strength display, success and error messages.
 */
vi.mock('../../src/views/registerView', () => ({
    default: vi.fn((props) => (
        <form data-testid="form" onSubmit={props.handleSubmit}>
            <input data-testid="password" value={props.password} onChange={props.handlePasswordChange}/>

            <div data-testid="strength">
                {props.getStrengthText(props.passwordStrength)}
            </div>

            {props.error && (
                <div data-testid="error">{props.error}</div>
            )}

            {props.success && (
                <div data-testid="success">Success</div>
            )}

            <button data-testid="submit" type="submit" disabled={props.loading}>
                Submit
            </button>
        </form>
    )),
}));

/**
 * Helper to render the RegisterPresenter component with optional
 * mock switchToLogin function.
 *
 * @param {Function} switchMock - Mock function to simulate switching to login.
 * @returns {RenderResult} The render result from @testing-library/react
 */
const renderRegister = (switchMock = vi.fn()) => {
    return render(
        <RegisterPresenter switchToLogin={switchMock} />
    );
};

describe('RegisterPresenter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

   /**
     * Verifies that the form and submit button are rendered correctly.
     */
    it('renders form correctly', () => {
        renderRegister();

        expect(screen.getByTestId('form')).toBeInTheDocument();
        expect(screen.getByTestId('submit')).toBeInTheDocument();
    });

    /**
     * Ensures the password strength indicator updates correctly
     * based on the entered password.
     */
    it('updates password strength correctly', () => {
        renderRegister();

        const passwordInput = screen.getByTestId('password');

        fireEvent.change(passwordInput, { target: { value: 'aaaaaaaa' } });
        expect(screen.getByTestId('strength')).toHaveTextContent('register.password_strength.weak');

        fireEvent.change(passwordInput, { target: { value: 'Aaaaaaa1' } });
        expect(screen.getByTestId('strength')).toHaveTextContent('register.password_strength.good');

        fireEvent.change(passwordInput, { target: { value: 'Aaaaaa1!' } });
        expect(screen.getByTestId('strength')).toHaveTextContent('register.password_strength.strong');
    });

   /**
     * Checks that form submission is prevented when the form is invalid.
     */
    it('stops submit when form is invalid', async () => {
        renderRegister();

        const form = screen.getByTestId('form');

        form.checkValidity = vi.fn(() => false);
        form.reportValidity = vi.fn();

        fireEvent.submit(form);

        expect(form.checkValidity).toHaveBeenCalled();
        expect(form.reportValidity).toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });

    /**
     * Tests that submitting a valid form triggers successful registration
     * and calls switchToLogin after the success timeout.
     */
    it('submits form and switches to login on success', async () => {
        const switchMock = vi.fn();

        fetch.mockResolvedValueOnce({ok: true, status: 200, json: async () => ({})});

        renderRegister(switchMock);

        const form = screen.getByTestId('form');
        form.checkValidity = vi.fn(() => true);

        fireEvent.submit(form);

        await waitFor(() => {expect(screen.getByTestId('success')).toBeInTheDocument()});

        await act(async () => {await new Promise(r => setTimeout(r, 2000))});

        expect(switchMock).toHaveBeenCalled();
    });

    /**
     * Shows server error when registration fails.
     */
    it('shows server error on failed registration', async () => {
        fetch.mockResolvedValueOnce({ok: false, status: 400, json: async () => ({ error: 'username_exists' })});

        renderRegister();

        const form = screen.getByTestId('form');
        form.checkValidity = vi.fn(() => true);

        fireEvent.submit(form);

        await waitFor(() => {expect(screen.getByTestId('error')).toHaveTextContent('sign_up.errors.username_exists')});
    });

    /**
     * Shows offline error when network request fails.
     */
    it('shows offline error on network failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Network'));

        renderRegister();

        const form = screen.getByTestId('form');
        form.checkValidity = vi.fn(() => true);

        fireEvent.submit(form);

        await waitFor(() => {expect(screen.getByTestId('error')).toHaveTextContent('register.errors.offline_login')});
    });

    /**
     * Ensures the submit button is disabled while waiting for
     * the fetch request to complete.
     */
    it('disables submit button while loading', async () => {
        let resolveFetch;

        fetch.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveFetch = resolve;
            })
        );

        renderRegister();

        const form = screen.getByTestId('form');
        form.checkValidity = vi.fn(() => true);

        fireEvent.submit(form);

        expect(screen.getByTestId('submit')).toBeDisabled();
        await act(async () => {resolveFetch({ ok: true, json: async () => ({}) })});
        await waitFor(() => expect(screen.getByTestId('submit')).not.toBeDisabled());
    });

    /**
     * Verifies that RegisterView is called with the correct props.
     */
    it('passes correct props to RegisterView', async () => {
        const ViewMock = await import('../../src/views/registerView');

        renderRegister();

        expect(ViewMock.default).toHaveBeenCalled();

        const props = ViewMock.default.mock.calls[0][0];

        expect(props).toMatchObject({username: '', password: '', error: '', loading: false, success: false, passwordStrength: 0});
        expect(typeof props.handleSubmit).toBe('function');
        expect(typeof props.handlePasswordChange).toBe('function');
        expect(typeof props.getStrengthColor).toBe('function');
        expect(typeof props.getStrengthText).toBe('function');
        expect(typeof props.switchToLogin).toBe('function');
    });
});