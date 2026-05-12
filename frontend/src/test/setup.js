import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking some common browser APIs if needed
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
