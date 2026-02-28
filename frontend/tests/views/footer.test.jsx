/**
 * These tests verify that the FooterView:
 * 1. Renders the footer with the correct current year.
 * 2. Displays the translated copyright text.
 * 3. Uses semantic HTML (<footer>) with role "contentinfo".
 *
 * The translation function `t` is mocked to return the key directly.
 */

import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import FooterView from '../../src/views/footerView';
import '@testing-library/jest-dom';

/** 
 * Mock translation function.
 * @param {string} key - Translation key
 * @returns {string} Returns the key itself
 */
const t = (key) => key;

describe('FooterView', () => {
    /**
     * Verifies that FooterView renders the correct text and uses semantic footer.
     */
    it('renders the footer with the current year and translated text', () => {
        const currentYear = 2026;

        render(<FooterView currentYear={currentYear} t={t} />);

        const footerText = screen.getByText(`© ${currentYear} footer.copyright`);
        expect(footerText).toBeInTheDocument();

        const footerElement = screen.getByRole('contentinfo'); // semantic <footer> role
        expect(footerElement).toBeInTheDocument();
    });
});