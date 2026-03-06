import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LanguageButton from '../../src/presenters/languageButtonPresenter';

/**
 * Mock function for i18n.changeLanguage.
 * Used to verify language synchronization behavior.
 *
 * @type {ReturnType<typeof vi.fn>}
 */
const changeLanguageMock = vi.fn();

/**
 * Mocks the react-i18next useTranslation hook.
 *
 * Provides:
 * - Identity translation function (t)
 * - Mocked i18n instance
 *
 * Allows testing language switching logic without
 * loading real i18n configuration.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: changeLanguageMock,
        },
    }),
}));

/**
 * Mocked LanguageButtonView component.
 *
 * Exposes:
 * - Current language display
 * - Change button triggering presenter logic
 *
 * Enables isolated testing of presenter behavior
 * without UI implementation concerns.
 */
vi.mock('../../src/views/languageButtonView', () => ({
    default: vi.fn((props) => (
        <div>
            <span data-testid="current-language">
                {props.language}
            </span>
            <button data-testid="change-btn" onClick={() => props.onChangeLanguage(props.language)}>
                Change
            </button>
        </div>
    )),
}));

/**
 * Integration tests for LanguageButton presenter.
 *
 * Verifies:
 * - Initialization from localStorage
 * - Default fallback behavior
 * - Language toggle logic
 * - Persistence to localStorage
 * - Synchronization with i18n
 */
describe('LanguageButton', () => {

    /**
   * Reset mocks and clear storage before each test.
   */
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    /**
   * Ensures language is loaded from localStorage
   * on component mount and applied to i18n.
   */
    it('loads language from localStorage on mount', async () => {
        localStorage.setItem('language', 'sv-SE');

        render(<LanguageButton />);

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenCalledWith('sv-SE');});
        expect(screen.getByTestId('current-language')).toHaveTextContent('sv-SE');
    });

    /**
   * Ensures default language ("en-US") is used
   * when no language is stored.
   */
    it('defaults to en-US when no language is stored', async () => {
        render(<LanguageButton />);

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenCalledWith('en-US');});
        expect(screen.getByTestId('current-language')).toHaveTextContent('en-US');
    });

    /**
   * Verifies language toggles from "en-US" to "sv-SE"
   * and updates UI + persistence correctly.
   */
    it('switches from en-US to sv-SE', async () => {
        localStorage.setItem('language', 'en-US');

        render(<LanguageButton />);

        await waitFor(() =>expect(screen.getByTestId('current-language')).toHaveTextContent('en-US'));

        fireEvent.click(screen.getByTestId('change-btn'));

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenLastCalledWith('sv-SE')});

        expect(localStorage.getItem('language')).toBe('sv-SE');
        expect(screen.getByTestId('current-language')).toHaveTextContent('sv-SE');
    });

    /**
   * Verifies language toggles from "sv-SE" to "en-US"
   * and updates UI + persistence correctly.
   */
    it('switches from sv-SE to en-US', async () => {
        localStorage.setItem('language', 'sv-SE');

        render(<LanguageButton />);

        await waitFor(() =>expect(screen.getByTestId('current-language')).toHaveTextContent('sv-SE'));

        fireEvent.click(screen.getByTestId('change-btn'));

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenLastCalledWith('en-US')});
        expect(localStorage.getItem('language')).toBe('en-US');
        expect(screen.getByTestId('current-language')).toHaveTextContent('en-US');
    });

    /**
   * Ensures every language change is persisted
   * to localStorage.
   */
    it('persists language change to localStorage', async () => {
        render(<LanguageButton />);

        await waitFor(() =>expect(screen.getByTestId('current-language')).toHaveTextContent('en-US'));

        fireEvent.click(screen.getByTestId('change-btn'));

        await waitFor(() => {expect(localStorage.getItem('language')).toBe('sv-SE');});
    });

    /**
   * Ensures i18n.changeLanguage is called:
   * - On initialization
   * - On every language toggle
   */
    it('calls i18n.changeLanguage on every change', async () => {
        render(<LanguageButton />);

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenCalledWith('en-US');});

        fireEvent.click(screen.getByTestId('change-btn'));

        await waitFor(() => {expect(changeLanguageMock).toHaveBeenCalledWith('sv-SE');});
    });
});