# Plan: remove `CALLER_ROLE` from the doctor app

Status: Option A done (not committed).

Scope: frontend only (doctor app, plus the patient app if we pick Option B). No backend changes.

## What we found

### Doctor app: `src/services/calls/callPayload.ts`
```ts
// The doctor app is rung by patients.
const CALLER_ROLE = 'patient';                                          // line 7
if (data.caller_role && data.caller_role !== CALLER_ROLE) return null;  // line 14, in callFromPush
caller_role: CALLER_ROLE,                                               // line 44, in callToData
```

### Patient app: `predcarepatient/src/services/calls/callPayload.ts`
There's **no `CALLER_ROLE` constant**, but the role logic is still there, written inline:
```ts
// The patient app only takes calls from doctors.
if (data.caller_role && data.caller_role !== 'doctor') return null;  // line 12
caller_role: 'doctor',                                                // line 42
```
Apart from these lines, the two files are identical (other differences: the comment and the
`'Your doctor'` / `'Your patient'` default name).

### Who uses the role in the doctor app
- `callFromPush` (does the filtering) is called from `pushSetup.ts:18`, `callService.ts:83`,
  `pushNotification.handler.ts:49` and `notificationDispatcher.ts:19`.
- `callToData` (writes `caller_role`) is used only by `androidRing.ts:41`. It saves the call into
  the Android ring notification's data, and `notificationDispatcher.ts` reads it back with
  `callFromPush`.
- Native code (`ios/`, `android/`) never reads `caller_role`.
- `PushData` / `IncomingCall` in `call.types.ts` don't declare `caller_role`, so no type changes are needed.

## Options

### Option A: match the patient app exactly (recommended)
Delete the constant and write `'patient'` inline, the same way the patient app does. Behavior doesn't change.

1. `src/services/calls/callPayload.ts`
   - Delete line 6 (`// The doctor app is rung by patients.`) and line 7 (`const CALLER_ROLE = 'patient';`).
   - Line 14: `if (data.caller_role && data.caller_role !== 'patient') return null;`
     (keep the comment above it: `// The doctor app only takes calls from patients.`)
   - Line 44: `caller_role: 'patient',`
2. `docs/pushnotify.md` §6.2 (lines ~1342, 1349, 1379): make the same change so the doc matches the code.
3. Verify: `npx tsc --noEmit` and lint on the file. Then do a manual ring test (below).

### Option B: drop the role check entirely
Only do this if we don't want the apps to filter by caller role at all.

1. `callPayload.ts`: delete the constant, the filter line (and its comment) and the `caller_role` entry in `callToData`.
2. `docs/pushnotify.md`: remove the matching lines in §6.2 and the `caller_role` cell in the
   alignment table (line 110).
3. Effect: the doctor app rings for every `INCOMING_CALL` push it receives, whatever its
   `caller_role` is (including test pushes sent with `caller_role: 'doctor'`).
4. To keep the apps consistent, do the same in the patient app
   (`predcarepatient/src/services/calls/callPayload.ts:11-12,42` and its `docs/callkeepringingplan.md`).

## Test checklist (both options)
- [ ] Patient joins the meeting → the doctor's phone rings (Android foreground, background, killed; iOS CallKit).
- [ ] Android: accepting or declining from the ring notification still works. This checks the `callToData` → `callFromPush` round trip.
- [ ] Missed call / `CALL_CANCELLED` still stops the ringing.
- [ ] Option A only: a test push with `caller_role: 'doctor'` is still ignored by the doctor app.

## Out of scope
- Backend (`dev-api`): no changes.
- Commits: don't commit until we pick up this work.
