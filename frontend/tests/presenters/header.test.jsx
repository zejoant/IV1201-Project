import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Header from '../../src/presenters/headerPresenter';
import { UserContext } from '../../src/UserContext';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock HeaderView
const mockHeaderView = vi.fn();
vi.mock('../../src/views/headerView', () => ({
  default: (props) => {
    mockHeaderView(props);
    return <div data-testid="header-view" />;
  },
}));

// Mock LanguageButton
vi.mock('../../src/presenters/languageButtonPresenter', () => ({
  default: () => <div data-testid="language-button" />
}));

describe('Header presenter', () => {
  const mockLogout = vi.fn();
  const mockCurrentUser = {name: 'Agda', surname: 'Olsvenne', email: 'agda@example.com'};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null if no user is logged in', () => {
    const {container} = render(
      <UserContext.Provider value={{ currentUser: null, logout: mockLogout }}>
        <Header />
      </UserContext.Provider>
    );
    expect(container.firstChild).toBeNull();
  });

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

  it('calls logout and navigate on handleLogout', () => {
    render(
      <UserContext.Provider value={{ currentUser: mockCurrentUser, logout: mockLogout }}>
        <Header />
      </UserContext.Provider>
    );

    const props = mockHeaderView.mock.calls[0][0];
    props.onLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});