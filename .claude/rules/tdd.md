# TDD Rules for PhyStack Screen Apps

## Workflow
1. **Red**: Write a failing test that describes the desired behavior
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up while keeping tests green

## Test Runner
- Vitest with jsdom environment
- Run: `yarn test` (single run), `yarn test:watch` (watch mode)
- Coverage: `yarn test:coverage`

## Test File Conventions
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`
- Shared test utilities: `src/utils/test-utils.tsx`
- Setup file: `src/utils/test-setup.ts` (jest-dom matchers)

## What to Test

### Always Test
- Component renders with given settings (settings-driven content)
- User interactions (touch, click, swipe where applicable)
- Screen transitions and navigation logic
- Session lifecycle (start, active, cleanup)
- Error states and fallbacks
- Settings edge cases (empty strings, missing optional fields)

### Test Patterns
```typescript
// Settings-driven content test
it("displays product name from settings", () => {
  const settings = createMockSettings({ productName: "Custom Name" });
  // render component with settings
  expect(screen.getByText("Custom Name")).toBeInTheDocument();
});

// Interaction test
it("navigates to detail screen on tap", async () => {
  const user = userEvent.setup();
  // render component
  await user.click(screen.getByRole("button", { name: /view details/i }));
  expect(screen.getByText("Detail Screen")).toBeInTheDocument();
});

// Cleanup test
it("cleans up timers on unmount", () => {
  vi.useFakeTimers();
  const { unmount } = render(<IdleScreen />);
  unmount();
  // verify no pending timers
  vi.runAllTimers();
  vi.useRealTimers();
});
```

### Don't Test
- Third-party library internals
- Exact CSS values (test behavior, not presentation)
- PhyStack Hub Client connection details (mock at boundary)
- Implementation details that could change

## Mocking
- Mock settings with `createMockSettings()` from test-utils
- Mock Hub Client at the module level for integration tests
- Use `vi.mock()` for external dependencies
- Prefer dependency injection over mocking where possible

## Coverage Goals
- Aim for meaningful coverage, not 100%
- All user-facing screens should have at least a render test
- All interactive elements should have interaction tests
- Schema consumption should be tested (settings actually display)
