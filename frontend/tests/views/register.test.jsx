/**
 *
 * These tests verify that RegisterView:
 * 1. Renders all form input fields and buttons correctly.
 * 2. Calls the appropriate input change handlers (`setName`, `setSurname`, `setEmail`, `setPersonNumber`, `setUsername`) when typing.
 * 3. Calls `handlePasswordChange` when the password input changes.
 * 4. Calls `handleSubmit` when the registration form is submitted.
 * 5. Displays an error message when the `error` prop is set.
 * 6. Displays a success message when the `success` prop is true.
 * 7. Calls `switchToLogin` when the "sign in" button is clicked.
 *
 * Mock functions are used to simulate state updates and event handling.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import RegisterView from '../../src/views/registerView';
import '@testing-library/jest-dom';

describe('RegisterView', () => {
    let mockSetUsername,
        mockSetName,
        mockSetSurname,
        mockSetEmail,
        mockSetPersonNumber,
        mockHandlePasswordChange,
        mockHandleSubmit,
        mockGetStrengthColor,
        mockGetStrengthText,
        mockSwitchToLogin;

    /**
     * Mock translation function.
     * @param {string} key - Translation key
     * @returns {string} Returns the key itself
     */
    const t = (key) => key;

    /**
     * defaultProps contains default values for all props used by RegisterView
     */
    const defaultProps = {
        t,
        username: '',
        password: '',
        name: '',
        surname: '',
        email: '',
        pnr: '',
        error: null,
        loading: false,
        success: false,
        passwordStrength: 2,
        setUsername: vi.fn(),
        setName: vi.fn(),
        setSurname: vi.fn(),
        setEmail: vi.fn(),
        setPersonNumber: vi.fn(),
        handlePasswordChange: vi.fn(),
        handleSubmit: vi.fn((e) => e.preventDefault()),
        getStrengthColor: vi.fn(() => 'green'),
        getStrengthText: vi.fn(() => 'Medium'),
        switchToLogin: vi.fn(),
    };

    /**
     * beforeEach resets all mock functions before each test to ensure test isolation
     */
    beforeEach(() => {
        mockSetUsername = vi.fn();
        mockSetName = vi.fn();
        mockSetSurname = vi.fn();
        mockSetEmail = vi.fn();
        mockSetPersonNumber = vi.fn();
        mockHandlePasswordChange = vi.fn();
        mockHandleSubmit = vi.fn((e) => e.preventDefault());
        mockGetStrengthColor = vi.fn(() => 'green');
        mockGetStrengthText = vi.fn(() => 'Medium');
        mockSwitchToLogin = vi.fn();
    });

    /** Verifies that all input fields and buttons render correctly */
    it('renders all inputs, buttons', () => {
        render(
            <RegisterView
                {...defaultProps}
                setUsername={mockSetUsername}
                setName={mockSetName}
                setSurname={mockSetSurname}
                setEmail={mockSetEmail}
                setPersonNumber={mockSetPersonNumber}
                handlePasswordChange={mockHandlePasswordChange}
                handleSubmit={mockHandleSubmit}
                getStrengthColor={mockGetStrengthColor}
                getStrengthText={mockGetStrengthText}
                switchToLogin={mockSwitchToLogin}
            />
        );

        // Input placeholders
        expect(screen.getByPlaceholderText('register.placeholders.first_name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('register.placeholders.last_name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('register.placeholders.email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('register.placeholders.pnr')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('register.placeholders.username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('register.placeholders.password')).toBeInTheDocument();

        // Buttons
        expect(screen.getByText('register.buttons.create_account')).toBeInTheDocument();
        expect(screen.getByText(/register.buttons.sign_in/)).toBeInTheDocument();
    });

    /** Ensures handleSubmit is called when the form is submitted */
    it('calls handleSubmit when the form is submitted', () => {
        render(<RegisterView {...defaultProps} handleSubmit={mockHandleSubmit} />);
        const form = screen.getByRole('button', { name: /register.buttons.create_account/i })
        fireEvent.submit(form);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    /** Tests that typing in inputs calls the correct handlers */
    it('calls input change handlers', () => {
        render(
            <RegisterView
                {...defaultProps}
                setName={mockSetName}
                setSurname={mockSetSurname}
                setEmail={mockSetEmail}
                setPersonNumber={mockSetPersonNumber}
                setUsername={mockSetUsername}
                handlePasswordChange={mockHandlePasswordChange}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.first_name'), { target: { value: 'Agda' } });
        expect(mockSetName).toHaveBeenCalledWith('Agda');

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.last_name'), { target: { value: 'Olsvenne' } });
        expect(mockSetSurname).toHaveBeenCalledWith('Olsvenne');

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.email'), { target: { value: 'Agda@b.com' } });
        expect(mockSetEmail).toHaveBeenCalledWith('Agda@b.com');

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.pnr'), { target: { value: '123456789012' } });
        expect(mockSetPersonNumber).toHaveBeenCalledWith('123456789012');

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.username'), { target: { value: 'AgdaOlsvenne' } });
        expect(mockSetUsername).toHaveBeenCalledWith('AgdaOlsvenne');

        fireEvent.change(screen.getByPlaceholderText('register.placeholders.password'), { target: { value: 'password123' } });
        expect(mockHandlePasswordChange).toHaveBeenCalled();
    });

    /** Displays error alert when `error` prop is set */
    it('displays error message if error prop is set', () => {
        render(<RegisterView {...defaultProps} error="register.errors.username_taken" />);
        expect(screen.getByText('register.errors.username_taken')).toBeInTheDocument();
    });

    /** Displays success alert when `success` prop is true */
    it('displays success message if success prop is true', () => {
        render(<RegisterView {...defaultProps} success={true} />);
        expect(screen.getByText('register.alerts.success')).toBeInTheDocument();
    });

    /** Ensures switchToLogin callback is called when login button is clicked */
    it('calls switchToLogin when login button is clicked', () => {
        render(<RegisterView {...defaultProps} switchToLogin={mockSwitchToLogin} />);
        const loginButton = screen.getByText(/register.buttons.sign_in/);
        fireEvent.click(loginButton);
        expect(mockSwitchToLogin).toHaveBeenCalled();
    });
});