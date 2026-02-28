/**
 *
 * These tests verify that LoginView:
 * 1. Renders all UI elements correctly (title, inputs, buttons, error messages).
 * 2. Calls the appropriate callbacks when the user interacts with the form:
 *    - `setUsername` when typing in the username input.
 *    - `setPassword` when typing in the password input.
 *    - `handleSubmit` when the form is submitted.
 *    - `switchToRegister` when the sign-up button is clicked.
 * 3. Properly displays error messages when the `error` prop is set.
 *
 * The translation function `t` is mocked to return the key directly for testing purposes.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LoginView from '../../src/views/loginView';
import '@testing-library/jest-dom';

/**
 * Mock translation function.
 * @param {string} key - Translation key
 * @returns {string} Returns the key itself
 */
const t = (key) => key;

describe('LoginView', () => {
    /** Mock callback functions */
    const mockSetUsername = vi.fn();
    const mockSetPassword = vi.fn();
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());
    const mockSwitchToRegister = vi.fn();

    /** Default props for rendering LoginView */
    const defaultProps = {
        t,
        username: '',
        setUsername: mockSetUsername,
        password: '',
        setPassword: mockSetPassword,
        error: null,
        loading: false,
        handleSubmit: mockHandleSubmit,
        switchToRegister: mockSwitchToRegister,
    };

    /**
     * Ensures that the login page renders the title correctly.
     */
    it('renders the login page', () => {
        render(<LoginView {...defaultProps} />);

        expect(screen.getByText('login.title')).toBeInTheDocument();
    });

    /**
     * Verifies that typing in the username input calls `setUsername` with cleaned value.
     */
    it('calls setUsername when typing in username input', () => {
        render(<LoginView {...defaultProps} />);
        const usernameInput = screen.getByPlaceholderText('login.username_placeholder');

        fireEvent.change(usernameInput, { target: { value: 'User123!' } });
        expect(mockSetUsername).toHaveBeenCalledWith('User123');
    });

    /**
     * Verifies that typing in the password input calls `setPassword`.
     */
    it('calls setPassword when typing in password input', () => {
        render(<LoginView {...defaultProps} />);
        const passwordInput = screen.getByPlaceholderText('login.password_placeholder');

        fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
        expect(mockSetPassword).toHaveBeenCalledWith('mypassword');
    });

    /**
     * Ensures the `handleSubmit` callback is called when the form is submitted.
     */
    it('calls handleSubmit when form is submitted', () => {
        render(<LoginView {...defaultProps} />);
        const form = screen.getByRole('button', { name: /login.sign_in/i })
        fireEvent.submit(form);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    /**
     * Checks that an error message is displayed if the `error` prop is set.
     */
    it('displays error message if error prop is set', () => {
        const propsWithError = { ...defaultProps, error: 'login.errors.missing_field' };
        render(<LoginView {...propsWithError} />);

        expect(screen.getByText('login.errors.missing_field')).toBeInTheDocument();
    });

    /**
     * Verifies that clicking the sign-up button calls the `switchToRegister` callback.
     */
    it('calls switchToRegister when clicking sign up button', () => {
        render(<LoginView {...defaultProps} />);
        const signUpButton = screen.getByText('login.sign_up');
        fireEvent.click(signUpButton);
        expect(mockSwitchToRegister).toHaveBeenCalled();
    });
});