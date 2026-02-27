import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import AppContent from '../src/App'; 
import { UserContext } from '../src/UserContext';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));
vi.mock('../src/presenters/recruiterDashboardPresenter', () => ({
  default: () => <div>recruiter.dashboard</div>,
}));
vi.mock('../src/presenters/personPagePresenter', () => ({
  default: () => <div>person.page</div>,
}));

const ROLE_RECRUITER = 1;

describe('App Component', () => {
  it('renders login screen when no user is logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null, login: vi.fn() }}>
        <AppContent />
      </UserContext.Provider>
    );

    expect(screen.getByText('login.title')).toBeInTheDocument();
    expect(screen.getByText('login.sign_up')).toBeInTheDocument();
  });

  /*it('renders recruiter dashboard for recruiter role', async () => {
  const mockUser = { role_id: ROLE_RECRUITER };

  render(
    <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
        <AppContent />
    </UserContext.Provider>
  );

  await screen.findByText('recruiter.dashboard');
});

it('renders applicant profile page for non-recruiter role', async () => {
  const mockUser = { role_id: 2 }; // applicant

  render(
    <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
        <AppContent />
    </UserContext.Provider>
  );

  await screen.findByText('person.page');
});*/

  it('switches to register form when clicking register', () => {
    render(
      <UserContext.Provider value={{ currentUser: null, login: vi.fn() }}>
        <AppContent />
      </UserContext.Provider>
    );

    const registerButton = screen.getByText('login.sign_up');
    fireEvent.click(registerButton);

    expect(screen.getByText('register.title')).toBeInTheDocument();
  });
});