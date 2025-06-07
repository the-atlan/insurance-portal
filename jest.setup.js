import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: (prop) => {
            return '';
        }
    })
});

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserver;