---
name: stability-audit
description: Audit any app for 24/7 unattended deployment. Finds memory leaks, resource exhaustion, and stability issues that kill long-running processes on constrained hardware (Intel NUC, DN74, Jetson, Raspberry Pi, etc.).
user-invocable: true
allowed-tools: Read, Grep, Glob, Task
---

# /stability-audit - 24/7 Unattended Device Stability Audit

Systematic code review for apps deployed to always-on, unattended hardware. These devices run continuously with no human intervention — any leak, accumulation, or unhandled failure will eventually crash the process. Nobody is there to restart it.

## Usage

```
/stability-audit                         # Full audit of entire codebase
/stability-audit <path or component>     # Focused audit on specific area
```

## Context: Why This Matters

These apps run on constrained, unattended hardware — kiosks, digital signage, industrial panels, smart mirrors, vending machines, IoT dashboards, information displays, point-of-sale terminals, wayfinding screens, or any device deployed into the field without an operator.

Typical hardware (Intel NUC, DN74, Nvidia Jetson, Raspberry Pi, embedded x86/ARM boards) has:
- **Limited RAM** (2-8GB typical, often no swap on embedded/flash-based storage)
- **No operator** — nobody to restart, dismiss dialogs, clear caches, or cycle power
- **Continuous runtime** — the app runs for weeks or months between reboots
- **High session throughput** — hundreds of user interactions per day, each one a chance to leak
- **Thermal constraints** — runaway CPU from leaked timers/loops causes thermal throttling or shutdown
- **Unreliable network** — Wi-Fi drops, cellular modems reset, VPNs reconnect, DNS fails
- **Shared system resources** — GPU memory, USB devices, serial ports must be explicitly released

A 500KB leak per session x 200 sessions/day = 100MB/day. The device is dead within days.

---

## Audit Procedure

### Step 1: Identify the Runtime Surface

Before searching for issues, understand the app's lifecycle:

1. Read the project README, CLAUDE.md, or equivalent for architecture overview
2. Identify the **session lifecycle** — what starts a session, what ends it, what resets state
3. Identify the **screen/route structure** — what components mount/unmount during navigation
4. Identify **external integrations** — APIs, cameras, WebSockets, Bluetooth, serial ports, media streams
5. Identify **state management** — where large data lives (context, stores, globals, refs)

### Step 2: Systematic Leak Hunt

Audit every file in the codebase against each category below. Use Grep/Glob to find patterns, then Read each match to verify. **Do not skip a category** — check all of them even if early categories find issues.

Report findings using severity levels:
- **CRITICAL** — Will crash the device given enough sessions. Fix before deployment.
- **HIGH** — Significant resource waste that degrades performance over time.
- **MODERATE** — Minor leak or inefficiency that compounds slowly.
- **LOW** — Theoretical risk or code smell that should be addressed.

---

## Audit Categories

### Category 1: Canvas and Bitmap Memory

Canvas elements hold GPU-backed bitmap buffers. A 1024x1024 canvas = ~4MB. The buffer persists until the canvas is explicitly released or garbage collected — and GC is not guaranteed to reclaim it promptly.

**Search for:**
- `document.createElement("canvas")` or `document.createElement('canvas')`
- `new OffscreenCanvas`
- `.toDataURL(` or `.toBlob(`
- `.getContext("2d")` or `.getContext('2d')` or `.getContext("webgl`

**Verify each match:**
- After calling `toDataURL()` / `toBlob()`, does the code set `canvas.width = 0; canvas.height = 0;` to release the bitmap buffer?
- Is the canvas referenced anywhere that would prevent GC?
- For WebGL contexts: is `.getExtension('WEBGL_lose_context')?.loseContext()` called on cleanup?

**Also check for orphaned Image elements:**
- `new Image()` — is the element ever cleaned up after `onload`/`onerror`?
- Are `onload`/`onerror` handlers nulled after use to break reference cycles?

### Category 2: Timers and Intervals

Leaked timers cause CPU waste and prevent garbage collection of their closures.

**Search for:**
- `setTimeout` — is every timeout cleared on unmount/cleanup? Check that the ID is stored and `clearTimeout` is called.
- `setInterval` — same. Intervals are especially dangerous: a single leaked interval runs forever.
- `requestAnimationFrame` — is `cancelAnimationFrame` called on cleanup?
- `requestIdleCallback` — is `cancelIdleCallback` called on cleanup?

**Common trap:** Timers inside async functions or promise chains. If a `setTimeout` is inside an `async` function that's abandoned (e.g., component unmounts), the timer still fires but nothing clears it.

**Verify:** For each timer in a React component or hook, confirm there is a corresponding cleanup in `useEffect` return, `componentWillUnmount`, or an equivalent teardown path.

### Category 3: Event Listeners

Listeners attached to `document`, `window`, or persistent DOM nodes outlive component unmounts.

**Search for:**
- `addEventListener` — for every `addEventListener`, find the matching `removeEventListener`
- `window.addEventListener` / `document.addEventListener` — these are the highest risk
- `.on(` patterns (for EventEmitter-style APIs)

**Verify:**
- The **exact same function reference** is used for add and remove (not a new arrow function each time)
- Removal happens in cleanup/unmount, not just on some conditional path
- For event handlers with dependencies that change: confirm the handler is stable (memoized) or that previous listeners are removed before new ones are added

### Category 4: Fetch / HTTP Requests

Abandoned network requests hold memory for request/response bodies and keep promise chains alive.

**Search for:**
- `fetch(` — is an `AbortController` used? Is `controller.abort()` called on cleanup?
- `XMLHttpRequest` — is `.abort()` called on cleanup?
- `axios` / `ky` / other HTTP clients — do they support cancellation? Is it used?
- Retry loops — can they be interrupted? Do they respect abort signals?
- Polling loops — what stops them? Is there an external abort mechanism?

**Verify:**
- Every `fetch` in a component/hook has an `AbortController` whose `abort()` is called on unmount
- Retry/polling loops check an abort condition before each iteration AND before each `await`
- Promise `.then()` / `.catch()` chains after fetch don't update component state without checking if still mounted/active
- Timeout timers associated with fetches are always cleared (in both success and error paths)

### Category 5: Media Streams and Hardware Access

Camera, microphone, and other hardware streams are system resources. Leaked streams keep hardware locked and consume significant memory.

**Search for:**
- `getUserMedia` — is every track stopped (`track.stop()`) on cleanup?
- `mediaStream.getTracks()` — verify all tracks are stopped, not just the stream dereferenced
- `srcObject` on `<video>` / `<audio>` — is it set to `null` on cleanup?
- `MediaRecorder` — is `.stop()` called on cleanup?
- WebRTC / `RTCPeerConnection` — is `.close()` called?
- USB / Serial / Bluetooth APIs — are connections closed?

**Verify:**
- Error paths also stop tracks (if `getUserMedia` partially succeeds then errors, are acquired tracks stopped?)
- Hardware cleanup happens BOTH on unmount AND on session reset/navigation

### Category 6: WebSocket and Persistent Connections

**Search for:**
- `new WebSocket` — is `.close()` called on cleanup?
- `EventSource` (SSE) — is `.close()` called?
- MQTT / Socket.IO / other real-time clients
- Any reconnection logic — does it have a maximum retry limit? Does it stop on unmount?

**Verify:**
- Connection is closed on component unmount AND session reset
- Reconnection loops can be externally cancelled
- Message handlers don't accumulate (new handler added per render without removing old)

### Category 7: Object URLs and Blob Storage

**Search for:**
- `URL.createObjectURL` — is there a matching `URL.revokeObjectURL` for EVERY created URL?
- `URL.revokeObjectURL` — is it being called on the correct URLs? (calling it on HTTP URLs is a no-op — this is a common bug that looks like cleanup but does nothing)
- Blob creation — are blobs stored in state/refs? Are they dereferenced on cleanup?

**Verify:**
- Revocation happens on cleanup, not only on "success" path
- URLs stored in arrays are all revoked (loop over array, revoke each), not just the last one
- After revocation, the reference is also cleared (set to null/empty) to allow GC

### Category 8: DOM Node Accumulation

Detached DOM nodes (created programmatically but never appended or cleaned up) hold memory.

**Search for:**
- `document.createElement` — is the element appended to the DOM and later removed? Or is it used transiently (e.g., for measurement)?
- `new Audio(` — audio elements created in JS are DOM nodes. Must be cleaned up.
- `new Image(` — same.
- `.cloneNode(` — cloned nodes not inserted into DOM become detached.
- Dynamic `<style>` or `<script>` injection — are they removed on cleanup?

**Verify:**
- Transient elements (canvas for image processing, audio for sound effects) are released after use
- Elements created in `useEffect` / `componentDidMount` are cleaned up in the return/unmount

### Category 9: State Accumulation

State that grows unboundedly across sessions will exhaust memory.

**Search for:**
- Arrays in state that receive `.push()`, spread (`[...prev, item]`), or `.concat()` — is there a maximum size? Are they cleared on session reset?
- Maps/Sets in state or refs — do they grow without bound?
- Cache objects (memoization, LRU, etc.) — do they have size limits?
- `console.log` in production — some environments buffer console output
- History/undo stacks — are they bounded?

**Verify:**
- Session reset clears ALL accumulated state, not just some of it
- Large data (base64 strings, image data, video blobs) is explicitly cleared when no longer needed, not just when the session ends
- Any in-memory cache has a size limit AND a TTL

### Category 10: Framework-Specific Patterns

Adapt this category to whichever framework the app uses. Common patterns below cover React, but the principles apply to Vue, Angular, Svelte, etc.

**React — search for:**
- `useEffect` without return cleanup function — every effect that creates a resource needs cleanup
- `useRef` holding large data — refs are not cleared on unmount by default
- `useCallback` / `useMemo` with stale closures capturing large objects
- Ref guards (`hasRun.current`, `initialized.current`) — these break React 18 StrictMode. Use cleanup functions instead.
- `forwardRef` with imperative handles holding resources
- Context providers holding large state that never resets

**Vue — search for:**
- `onMounted` without corresponding `onUnmounted` cleanup
- Watchers (`watch`, `watchEffect`) that aren't stopped
- Reactive refs holding large data without cleanup

**Vanilla / Other — search for:**
- Global variables that accumulate data
- Module-level caches without eviction

**Verify:**
- Every effect/lifecycle hook that starts an async operation has a way to cancel it in cleanup
- State updates inside async callbacks check if the component is still relevant (abort signal, mounted ref, or better — use an AbortController that's aborted in cleanup)
- Session/navigation reset disposes all resources, not just resets state values

### Category 11: Third-Party Library Resources

**Search for:**
- Animation libraries (Framer Motion, GSAP, Lottie) — do they clean up on unmount?
- Chart/visualization libraries — do they dispose properly?
- Map libraries (Leaflet, Mapbox) — `.remove()` must be called
- Video players (HLS.js, Video.js) — `.destroy()` or `.dispose()` must be called
- QR code generators — do they create and leak canvas elements?
- PDF renderers — do they release page objects and canvases?

**Verify:**
- Library instances created in effects/lifecycle hooks are destroyed in cleanup
- Libraries that use Web Workers clean up those workers
- Libraries with internal caches respect memory constraints

### Category 12: Error Recovery and Resilience

On an unattended device, unhandled errors can leave the app in a broken state permanently — and there's nobody to fix it.

**Search for:**
- Global error boundaries — does the app have a top-level error boundary or crash handler?
- Unhandled promise rejections — is there a global `unhandledrejection` handler?
- API error handling — do ALL API calls have error handling? Does error state get cleared on retry/reset?
- Network offline handling — what happens when the network drops for 30 minutes? Does the app recover when connectivity returns?
- Stuck state detection — if the user walks away mid-flow, does the app return to a home/idle state?

**Verify:**
- Error boundary recovery resets all state (not just re-renders the broken component tree)
- The app can fully recover from any error state by returning to its home/idle screen
- Inactivity timeout exists and fires on ALL screens, not just some
- Network errors don't leave the app in a permanent loading/error state
- No screen can become a dead end (every screen has a path back to home/idle)
- The app degrades gracefully when external services are unavailable (shows fallback UI, not a blank screen or spinner forever)

### Category 13: Process-Level Stability

These are deployment/infrastructure concerns — flag them if the codebase or config doesn't address them.

**Check for:**
- Memory monitoring — does the deployment include process memory monitoring with auto-restart thresholds?
- Watchdog timers — is there a system-level watchdog that restarts the app if it becomes unresponsive?
- Log rotation — do application logs rotate or are they unbounded? (unbounded logs fill the disk)
- Temp file cleanup — does the app write to `/tmp` or similar? Are files cleaned up?
- Browser/runtime flags (for Electron/Chromium-based apps) — `--max-old-space-size`, `--disable-gpu-memory-buffer-compositor-resources`, `--disable-background-timer-throttling`
- Automatic recovery — does the process auto-restart on crash? (systemd, Docker restart policy, PM2, supervisor, etc.)
- Disk space — does the app generate files (logs, downloads, cached media) that could fill the disk?
- Time drift — does the app depend on accurate system time? Are NTP or time sync failures handled?

---

## Step 3: Generate Report

After completing all categories, produce a structured report:

```markdown
# Stability Audit Report

## Device Context
- Target hardware: [from project docs or user input]
- Expected session frequency: [sessions per day]
- Expected runtime between reboots: [days/weeks/months]
- Available RAM: [if known]

## Summary
- Critical issues: [count]
- High issues: [count]
- Moderate issues: [count]
- Low issues: [count]
- Estimated leak rate: [MB per session if calculable]
- Estimated time to failure: [based on leak rate and available RAM]

## Findings

### [SEVERITY]: [Short title]
- **File:** `path/to/file.ts:line`
- **Category:** [Which audit category caught this]
- **Impact:** [What happens over time — quantify if possible]
- **Evidence:** [The specific code pattern]
- **Fix:** [Concrete remediation with code example]

[Repeat for each finding, ordered by severity then by file]

## Recommendations
[Prioritized list of fixes, grouped into: immediate / next release / backlog]
```

### Step 4: Present to User

Present the report to the user. Ask if they want to proceed with fixes, and if so, in what order.

---

## Quick Reference: Cleanup Patterns

### Canvas release
```typescript
const canvas = document.createElement("canvas");
// ... use canvas ...
const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
canvas.width = 0;   // Release bitmap buffer
canvas.height = 0;  // Release bitmap buffer
```

### Fetch with AbortController
```typescript
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(/* ... */)
    .catch((err) => {
      if (err.name === "AbortError") return; // Expected on cleanup
    });
  return () => controller.abort();
}, [url]);
```

### Camera stream cleanup
```typescript
useEffect(() => {
  let stream: MediaStream | null = null;
  navigator.mediaDevices.getUserMedia(constraints).then((s) => {
    stream = s;
    videoRef.current!.srcObject = s;
  });
  return () => {
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };
}, []);
```

### Timer cleanup in async context
```typescript
useEffect(() => {
  const controller = new AbortController();
  async function run() {
    while (!controller.signal.aborted) {
      await doWork();
      await new Promise((resolve, reject) => {
        const t = setTimeout(resolve, interval);
        controller.signal.addEventListener("abort", () => {
          clearTimeout(t);
          reject(new DOMException("Aborted", "AbortError"));
        }, { once: true });
      });
    }
  }
  run().catch(() => {});
  return () => controller.abort();
}, []);
```

### Bounded state accumulation
```typescript
const MAX_ENTRIES = 100;
setState((prev) => {
  const next = [...prev, newEntry];
  return next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
});
```
