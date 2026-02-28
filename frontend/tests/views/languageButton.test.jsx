/**
 *
 * These tests verify that LanguageButtonView:
 * 1. Renders a language selection button with the correct translated label.
 * 2. Calls the `onChangeLanguage` callback when the button is clicked.
 *
 * The translation function `t` is mocked to return the key itself for testing purposes.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import LanguageButtonView from '../../src/views/languageButtonView';
import '@testing-library/jest-dom';

/**
 * Mock translation function.
 * @param {string} key - Translation key
 * @returns {string} Returns the key itself
 */
const t = (key) => key;

/**
 *  Mock callback for changing language 
 */
const mockOnChangeLanguage = vi.fn()

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { changeLanguage: vi.fn() },
    }),
}));

describe('LanguageButtonView', () => {
    /**
     * Verifies that the language button renders and triggers callback when clicked.
     */
    it('renders the language button and triggers onChangeLanguage on click', () => {
        render(
            <LanguageButtonView onChangeLanguage={mockOnChangeLanguage} t={t} language="en-US" />
        );

        const button = screen.getByText('languageButton.language');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(mockOnChangeLanguage).toHaveBeenCalledTimes(1);
        expect(mockOnChangeLanguage).toHaveBeenCalledWith('en-US');
    });
});