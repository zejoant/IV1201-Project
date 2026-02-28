/**
 *
 * These tests verify that AppContent:
 * 1. Renders the login screen when no user is logged in.
 * 2. Renders the recruiter dashboard for users with recruiter role.
 * 3. Renders application details page for recruiters navigating to a specific application.
 * 4. Renders the applicant's personal profile page for non-recruiter users.
 * 5. Renders the applicant application form when "Apply Now" is clicked.
 * 6. Switches to the registration form when the "Sign Up" button is clicked.
 *
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { AppContent } from '../src/App';
import { UserContext } from '../src/UserContext';
import '@testing-library/jest-dom';
import {BrowserRouter as Router, MemoryRouter} from "react-router-dom";

/** Mock translation function for i18n */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
}));

/** Mock presenters to simplify rendering in tests */
vi.mock('../src/presenters/recruiterDashboardPresenter', () => ({
  default: () => <div>recruiter.dashboard</div>,
}));
vi.mock('../src/presenters/applicationDetailPresenter', () => ({
  default: () => <div>applicationDetail.title</div>,
}));

/**  Constants for user roles */
const ROLE_RECRUITER = 1;

describe('App Component', () => {

  /**
   * Test that AppContent renders the login screen when no user is logged in.
   */
  it('renders login screen when no user is logged in', () => {
    render(
      <UserContext.Provider value={{ currentUser: null, login: vi.fn() }}>
        <AppContent />
      </UserContext.Provider>
    );

    expect(screen.getByText('login.title')).toBeInTheDocument();
    expect(screen.getByText('login.sign_up')).toBeInTheDocument();
  });

   /**
   * Test that AppContent renders the recruiter dashboard for users with the recruiter role.
   */
  it('renders recruiter dashboard for recruiter role', async () => {
    const mockUser = { role_id: ROLE_RECRUITER };

    render(
      <Router>
        <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
          <AppContent />
        </UserContext.Provider>
      </Router>
    );

    expect(await screen.findByText('recruiter.dashboard')).toBeInTheDocument();
  });
  
  /**
   * Test that AppContent renders the application details page for a recruiter navigating to a specific application.
   */
  it('renders application details for recruiter role', async () => {
    const mockUser = { role_id: 1 }; // applicant

    render(
        <MemoryRouter initialEntries={['/recruiter/application/1']}> 
        <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
          <AppContent />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(await screen.findByText('applicationDetail.title')).toBeInTheDocument();
  });

  /**
   * Test that AppContent renders the applicant's personal profile page for non-recruiter users.
   */
  it('renders applicant profile page for non-recruiter role', async () => {
    const mockUser = { role_id: 2 }; // applicant

    render(
      <Router>
        <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
          <AppContent />
        </UserContext.Provider>
      </Router>
    );

    expect(await screen.findByText('personPage.active')).toBeInTheDocument();
  });

  /**
   * Test that AppContent renders the applicant application form when "Apply Now" is clicked.
   */
  it('renders applicant application form for non-recruiter role', async () => {
    const mockUser = { role_id: 2 }; // applicant

    render(
      <Router>
        <UserContext.Provider value={{ currentUser: mockUser, login: vi.fn() }}>
          <AppContent />
        </UserContext.Provider>
      </Router>
    );

    const registerButton = await screen.getByText('personPage.actions.apply_now');
    fireEvent.click(registerButton);

    expect(await screen.findByText('applicationForm.title')).toBeInTheDocument();
  });
  
  /**
   * Test that AppContent switches to the registration form when the "Sign Up" button is clicked.
   */
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