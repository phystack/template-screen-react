import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import type { Settings } from "../schema";

export function createMockSettings(
  overrides: Partial<Settings> = {},
): Settings {
  return {
    productName: "Test Product",
    productPrice: "99 USD",
    ...overrides,
  };
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { ...options });
}

export { customRender as render };
export { screen, waitFor, within, act } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
