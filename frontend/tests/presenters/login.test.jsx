import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPresenter from '../../src/presenters/loginPresenter';

vi.mock('../../src/views/loginView', () => ({
  default: vi.fn(({ handleSubmit, username, setUsername, password, setPassword, error, loading }) => (
    <form data-testid="login-form" onSubmit={handleSubmit}>
      <input
        data-testid="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        data-testid="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div data-testid="error">{error}</div>}
      <button type="submit" disabled={loading}>Login</button>
    </form>
  )),
}));

describe('LoginPresenter', () => {
  let fetchMock;
  let setCurrentUserMock;
  let switchToRegisterMock;

  beforeEach(() => {
    setCurrentUserMock = vi.fn();
    switchToRegisterMock = vi.fn();
    fetchMock = vi.spyOn(global, 'fetch');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits form successfully and sets current user', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: { username: 'AgdaOlsvenne', role_id: 2 } }) });

    render(<LoginPresenter setCurrentUser={setCurrentUserMock} switchToRegister={switchToRegisterMock} />);

    fireEvent.change(screen.getByTestId('username'), { target: { value: 'AgdaOlsvenne' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(setCurrentUserMock).toHaveBeenCalledWith({ username: 'AgdaOlsvenne', role_id: 2 }));
    expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify({ username: 'AgdaOlsvenne', role_id: 2 }));
  });

  it('shows error when sign_in fails', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'invalid_credentials' }) });

    render(<LoginPresenter setCurrentUser={setCurrentUserMock} switchToRegister={switchToRegisterMock} />);

    fireEvent.change(screen.getByTestId('username'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'wrongpass' } });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('sign_in.errors.invalid_credentials'));
    expect(setCurrentUserMock).not.toHaveBeenCalled();
  });

  it('shows error when fetching profile fails', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'not_found' }) });

    render(<LoginPresenter setCurrentUser={setCurrentUserMock} switchToRegister={switchToRegisterMock} />);

    fireEvent.change(screen.getByTestId('username'), { target: { value: 'AgdaOlsvenne' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('id.errors.not_found'));
    expect(setCurrentUserMock).not.toHaveBeenCalled();
  });

  it('does not submit when form is invalid', async () => {
    render(<LoginPresenter setCurrentUser={setCurrentUserMock} switchToRegister={switchToRegisterMock} />);

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(setCurrentUserMock).not.toHaveBeenCalled());
  });
});