import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Footer from '../../src/presenters/footerPresenter';

/**
 * Mocks the react-i18next hook.
 * Provides a translation function that simply returns
 * the translation key to keep tests deterministic.
 */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));

/**
 * Mock function used to capture props passed to FooterView.
 */const mockFooterView = vi.fn();

 /**
 * Mocks FooterView to:
 *  - intercept incoming props
 *  - render a minimal placeholder element
 */
vi.mock('../../src/views/footerView', () => ({
  default: (props) => {
    mockFooterView(props);
    return <div data-testid="footer-view" />;
  },
}));

/**
 * Test suite for the Footer presenter.
 */
describe('Footer', () => {

   /**
   * Clears mock history before each test to ensure isolation.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

   /**
   * Verifies that Footer:
   *  - calculates the current year correctly
   *  - passes the translation function (t)
   *  - forwards both values to FooterView as props
   */
  it('passes currentYear and t to FooterView', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(mockFooterView).toHaveBeenCalledTimes(1);

    const props = mockFooterView.mock.calls[0][0];

    expect(props.currentYear).toBe(currentYear);
    expect(typeof props.t).toBe('function');
  });
});