# Testing React Apps

## To install:

##### npm i -D vitest

package.json => scripts [ "test": "vitest", "test:ui": "vitest --ui" ]

##### npm i -D @testing-library/react @testing-library/dom

##### npm i -D @testing-library/jest-dom


//Solving resizeObserver error
#### npm i -D resize-observer-polyfill

//setup.ts
import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();


IMPORT STATEMENTS:

import { it, expect, describe } from "vitest";

import { render, screen } from "@testing-library/react";

import Greet from "../../src/components/Greet";

import "@testing-library/jest-dom/vitest";

# FILES:

### vitest.config.ts 

import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "tests/setup.ts",
    },
})


### setup.ts       // IN tests folder

//AFTER ADDING SETUP FILES TO vitest.config.ts

import "@testing-library/jest-dom/vitest"

//For simulating browser environment

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});


!! ADD TO tsconfig.json  ===> "types": ["vitest/globals"]


# EXTENSIONS: 

### Testing Library Snippets 


#### SNIPPETS: 
Vitest Snippets

   itr = import { render, screen } from "@testing-library/react"

   iv  = import { it, expect, describe } from 'vitest'

   d   = describe('group', () => { })

   qr  = screen.getByRole() and similar

   qt  = screen.getByText() and similar