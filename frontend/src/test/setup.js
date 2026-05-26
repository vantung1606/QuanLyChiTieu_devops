import '@testing-library/jest-dom';

// Mocking some common browser APIs if needed
globalThis.matchMedia = globalThis.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
