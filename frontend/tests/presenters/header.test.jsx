import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Header from '../../src/presenters/headerPresenter';
import { UserContext } from '../../src/UserContext';

/**
 * Mock react-i18next translation hook.
 */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));


/**
 * Mock react-router-dom navigation hook.
 */
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

/**
 * Mock HeaderView component to intercept props and render
 * a placeholder element.
 */
const mockHeaderView = vi.fn();
vi.mock('../../src/views/headerView', () => ({
  default: (props) => {
    mockHeaderView(props);
    return <div data-testid="header-view" />;
  },
}));

/**
 * Mock LanguageButton presenter for inclusion in Header.
 */
vi.mock('../../src/presenters/languageButtonPresenter', () => ({
  default: () => <div data-testid="language-button" />
}));

describe('Header presenter', () => {
  const mockLogout = vi.fn();
  const mockCurrentUser = {name: 'Agda', surname: 'Olsvenne', email: 'agda@example.com'};

  /**
   * Clear mocks before each test for isolation.
   */
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Renders null if no user is logged in.
   */
  it('renders null if no user is logged in', () => {
    const {container} = render(
      <UserContext.Provider value={{ currentUser: null, logout: mockLogout }}>
        <Header />
      </UserContext.Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  /**
   * Ensures Header forwards correct props to HeaderView
   * when a user is present.
   */
  it('passes props correctly to HeaderView', () => {
    render(
      <UserContext.Provider value={{ currentUser: mockCurrentUser, logout: mockLogout }}>
        <Header />
      </UserContext.Provider>
    );

    expect(mockHeaderView).toHaveBeenCalledTimes(1);
    const props = mockHeaderView.mock.calls[0][0];

    expect(props.currentUser).toEqual(mockCurrentUser);
    expect(typeof props.t).toBe('function');
    expect(typeof props.onLogout).toBe('function');
    expect(props.navigate).toBe(mockNavigate);
    expect(props.LanguageButton).toBeDefined();
  });

  /**
   * Tests that calling HeaderView's onLogout prop
   * invokes logout and redirects to the login page.
   */
  it('calls logout and navigate on handleLogout', async () => {
    render(
      <UserContext.Provider value={{ currentUser: mockCurrentUser, logout: mockLogout }}>
        <Header />
      </UserContext.Provider>
    );

    const props = mockHeaderView.mock.calls[0][0];
    await props.onLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});