# datetoken

[![npm version](https://badge.fury.io/js/datetoken.svg)](https://www.npmjs.com/package/datetoken)
[![CI](https://github.com/sonirico/datetoken.js/workflows/CI/badge.svg)](https://github.com/sonirico/datetoken.js/actions)

A small DSL to express relative dates as tokens. Parse `now-1d/d` into a `Date` instead of
hand-rolling arithmetic with `Date.now() - 86400000`.

Also available in:

- [Python](https://github.com/sonirico/datetoken).
- [Go](https://github.com/sonirico/datetoken.go).
- [Nim?](https://github.com/fernando24164/datetoken.nim).

## Install

```bash
npm install datetoken
```

Requires Node.js >= 20.

## Usage

```typescript
import datetoken from 'datetoken';

datetoken('now');              // current time
datetoken('now-1d/d');         // start of yesterday
datetoken('now-1d@d');         // end of yesterday
datetoken('now-7d');           // 7 days ago
datetoken('now/M');            // start of current month
datetoken('now-1M@M');         // end of last month
datetoken('now-1w/bw');        // start of last business week (Monday)
datetoken('now/Q');            // start of current quarter
datetoken('now-3M+2w-4d/w');   // chains work: 3 months ago + 2 weeks - 4 days, snapped to start of week
```

## Token grammar

```
now [±<amount><unit>]... [/<snap> | @<snap>]
```

Everything starts with `now`. Then zero or more arithmetic operations, optionally ending with
a snap to a boundary.

### Arithmetic (`+` / `-`)

| Unit | Meaning  |
|------|----------|
| `s`  | seconds  |
| `m`  | minutes  |
| `h`  | hours    |
| `d`  | days     |
| `w`  | weeks    |
| `M`  | months   |
| `Y`  | years    |

Amount defaults to 1 when omitted: `now-d` is the same as `now-1d`.

### Snap to boundary (`/` start, `@` end)

| Snap       | Meaning                 |
|------------|-------------------------|
| `s m h d`  | second / minute / hour / day |
| `w`        | week (Sunday)           |
| `bw`       | business week (Mon-Fri) |
| `M`        | month                   |
| `Y`        | year                    |
| `Q`        | current quarter         |
| `Q1`..`Q4` | specific quarter        |
| `mon`..`sun` | weekday               |

`/` snaps to the **start** of the period, `@` snaps to the **end**.

## Common patterns

| Range              | Start token      | End token        |
|--------------------|------------------|------------------|
| Yesterday          | `now-1d/d`       | `now-1d@d`       |
| Last 7 days        | `now-7d`         | `now`            |
| This month         | `now/M`          | `now@M`          |
| Last month         | `now-1M/M`       | `now-1M@M`       |
| Last business week | `now-1w/bw`      | `now-1w@bw`      |
| Q1 this year       | `now/Q1`         | `now@Q1`         |

## API

```typescript
datetoken(token: string, startAt?: Date, clock?: ClockI): Date
```

- **token** -- datetoken expression to evaluate.
- **startAt** -- optional starting date (defaults to `new Date()`).
- **clock** -- optional clock interface `{ getTime(): Date }` for testing.

Throws `InvalidTokenError` on malformed input.

### Named exports

```typescript
import datetoken, { Token } from 'datetoken';
```

`Token` is the parsed model. Both ESM and CommonJS are supported.

## Development

```bash
npm test              # run tests
npm run test:watch    # watch mode
npm run lint          # biome check
npm run build         # tsup build (ESM + CJS + d.ts)
```

## License

MIT
