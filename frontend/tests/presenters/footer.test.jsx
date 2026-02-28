import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Footer from '../../src/presenters/footerPresenter';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));

// Mock FooterView
const mockFooterView = vi.fn();

vi.mock('../../src/views/footerView', () => ({
  default: (props) => {
    mockFooterView(props);
    return <div data-testid="footer-view" />;
  },
}));

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes currentYear and t to FooterView', () => {
    const currentYear = new Date().getFullYear();

    render(<Footer />);

    expect(mockFooterView).toHaveBeenCalledTimes(1);

    const props = mockFooterView.mock.calls[0][0];

    expect(props.currentYear).toBe(currentYear);
    expect(typeof props.t).toBe('function');
  });
});