import { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import { UserProvider, UserContext } from '../src/UserContext';

/**
 * Test component that consumes UserContext to verify login, logout, and currentUser state.
 */
const TestComponent = () => {
    const { currentUser, login, logout } = useContext(UserContext);

    return (
        <div>
            <div data-testid="user">{currentUser ? currentUser.name : 'null'}</div>
            <button data-testid="login" onClick={() => login({name: 'Berra'})}>Login</button>
            <button data-testid="logout" onClick={logout}>Logout</button>
        </div>
    );
};

describe('UserProvider', () => {

    /**
     * Runs before each test:
     * - Clears localStorage 
     * - Mocks the global fetch function to return a resolved OK response.
     * - Clears all Vitest mocks 
     */
    beforeEach(() => {
        localStorage.clear();
        global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
        vi.clearAllMocks();
    });

    /**
     * Verifies that the context initializes with no user when localStorage is empty.
     */
    it('initializes with no user if localStorage is empty', () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('null');
    });

    /**
     * Ensures that a user stored in localStorage is restored on mount.
     */
    it('restores user from localStorage on mount', () => {
        localStorage.setItem('currentUser', JSON.stringify({ name: 'Agda' }));

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('Agda');
    });

    /**
     * Tests that calling login updates currentUser state and stores it in localStorage.
     */
    it('login sets currentUser and updates localStorage', () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        act(() => { screen.getByTestId('login').click() });

        expect(screen.getByTestId('user').textContent).toBe('Berra');
        expect(JSON.parse(localStorage.getItem('currentUser')).name).toBe('Berra');
    });

    /**
    * Tests that logout clears currentUser state, removes localStorage entry,
    * and sends a POST request to the sign-out endpoint.
    */
    it('logout clears currentUser, localStorage, and calls fetch', async () => {
        localStorage.setItem('currentUser', JSON.stringify({ name: 'Brunhilda' }));

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByTestId('user').textContent).toBe('Brunhilda');

        await act(async () => { screen.getByTestId('logout').click() });

        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(localStorage.getItem('currentUser')).toBeNull();
        expect(global.fetch).toHaveBeenCalledWith('/account/sign_out', { method: 'POST', credentials: 'include' });
    });

    /**
   * Ensures that logout handles fetch failures gracefully
   * and still clears state and localStorage.
   */
    it('logout handles fetch failure', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));

        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        await act(async () => { screen.getByTestId('logout').click() });

        expect(screen.getByTestId('user').textContent).toBe('null');
        expect(localStorage.getItem('currentUser')).toBeNull();
    });
});