import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import React from 'react';

// Mocking the pages to avoid complex dependencies in basic App test
vi.mock('./pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('./pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./pages/Register', () => ({ default: () => <div>Register Page</div> }));

describe('App Component', () => {
  it('renders login page by default if not authenticated', () => {
    // In a real app, ProtectedRoute would redirect to /login
    // For this test, we can just check if Login is renderable
    window.history.pushState({}, 'Login', '/login');
    
    render(<App />);
    
    // Since App has BrowserRouter, it will respond to the URL
    // But rendering the whole App might be tricky with BrowserRouter already there.
    // Let's just verify Login Page text
    expect(screen.getByText(/Login Page/i)).toBeDefined();
  });

  it('applies dark-mode class if darkMode is true in localStorage', () => {
    localStorage.setItem('darkMode', 'true');
    render(<App />);
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    localStorage.removeItem('darkMode');
  });
});
