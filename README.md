# INI-CET Revision OS (React + TypeScript)

A high-yield, offline-first revision system for INI-CET rewritten as a modular **React + TypeScript + Vite** single-page application. Built around one question: *does this add marks?*

Everything that did not (trackers that only log hours, leaderboards, fitness modules, rank predictors) is gone.

## Architecture

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailored design tokens and dark/light responsive theme via `app.css`
- **State & Diagnosis**: Reactive state store with `localStorage` persistence (`inicet-os-v5`)
- **Port**: Serves on port `3000` (`0.0.0.0`)

## What it does

| Screen | Purpose |
|---|---|
| **Today** | Exam countdown, last block score, 7-day accuracy, unresolved errors, sprint day preview, and a ranked **Fix next** list with a prescription per weak cluster. |
| **Sprint** | 24-day sprint timetable with daily multi-block assignments (morning, afternoon, evening, notebook). |
| **Matrix** | All PYT clusters by subject with yield (●●● core PYT, ●●○ frequent, ●○○ coverage) and mastery status. |
| **Cluster page** | Diagnostic anchor → flowchart algorithm → contrast tables → high-yield points → trap sheet → images → cards → recalled PYQ stems that match → links to go deeper. |
| **Block** | 50 questions / 45 min lockout with +1 / −⅓ scoring, 38/7 ghost pacer, flag, strike-out, keyboard shortcuts. Also diagnostic sweep, 25-Q speed run, mistake purge, 10-Q cluster drill, image questions, and dated PYQs. |
| **Error OS** | Every lost mark classified G (true gap), R (retention failure), A (reasoning defect), T (stem trap / misread) or P (pacing / fatigue) with a two-line note. Wrong answers become mistake cards; a later correct answer marks the leak plugged. |
| **Review** | Spaced repetition (SM-2 variant) over cluster cards and your mistake cards; new cards come from your weakest high-yield clusters first. |
| **Spotters** | 30 high-yield medical image spotters with locked progress tracking. |
| **Notebook** | 20th Notebook for volatile numbers, cut-offs, staging, loci, and repeated traps with 3-strike recall tracking. |
| **PYQs** | On-demand previous-year questions browser with multi-filter (subject, exam, repeats, year) and recall stems. |
| **Coverage** | Marrow World of Revision chapter topics mapped to clusters, identifying coverage and gaps. |
| **Playbook** | Exam format, 38/7 rule, next-best-step hierarchy, two-option rule, image triangulation, GT audit, final-30-day protocol. |
| **Quest** | 8-bit retro organ-system crawler integration. |
| **Settings** | Exam date, new cards per day, theme, **Anki export** (Basic + Cloze, decks per subject/cluster), backup/import. |

## How weak topics are found

Each cluster's mastery is a Beta posterior over "answers this cluster correctly":

- Evidence = MCQ attempts (tagged to clusters) + flashcard recalls, each discounted with a **21-day half-life** so old wins fade.
- A wrong answer classified as **T** counts half as a knowledge failure and as **P** a third; a skip counts 0.3. Each also feeds that leak's counter.
- **Status**: Untested (< 1.5 weighted attempts) · Weak (< 60%) · Shaky · Mastered (≥ 80% over ≥ 6 weighted attempts on ≥ 2 days).
- **Priority** = yield weight × gap × (1 + 0.15 × unresolved errors). Untested clusters get a fixed 0.5 gap so the **diagnostic sweep** (one question per untested cluster, core PYTs first) is the cold start.
- The prescription follows the dominant leak: G/A → re-read + cards + 10-Q drill; T → trap sheet + name the qualifier before answering; P → speed run.

## Development

```bash
npm install
npm run dev      # starts Vite on http://0.0.0.0:3000
npm run build    # TypeScript check & production Vite build
npm run lint     # TypeScript type-checking
```
