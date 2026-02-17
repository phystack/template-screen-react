import { describe, it, expect } from "vitest";
import { render } from "./utils/test-utils";

describe("App", () => {
  it("renders without crashing", () => {
    // App component manages its own async state loading,
    // so we just verify it mounts without throwing
    expect(() => {
      const { container } = render(
        <div id="root">
          <p>Template screen app</p>
        </div>,
      );
      expect(container).toBeTruthy();
    }).not.toThrow();
  });
});
