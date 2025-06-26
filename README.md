# Datetoken 🕰️

[![npm version](https://badge.fury.io/js/datetoken.svg)](https://www.npmjs.com/package/datetoken)
[![GitHub Actions](https://github.com/sonirico/datetoken.js/workflows/CI/badge.svg)](https://github.com/sonirico/datetoken.js/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/datetoken.svg)](https://www.npmjs.com/package/datetoken)

> *"Because writing `new Date(Date.now() - 24 * 60 * 60 * 1000)` to get yesterday's date is for masochists."*

**Datetoken** is a lightweight, zero-dependency utility that interprets human-readable date tokens into JavaScript `Date` objects. Think of it as a tiny DSL for relative dates that doesn't make you want to cry.

## Why Datetoken? 🤔

Let's be honest: JavaScript's Date API is... *challenging*. Sure, you could memorize the arcane incantations needed to get "last Tuesday" or "end of previous quarter," but wouldn't you rather just write `now-w/tue` and call it a day?

Datetoken was born from the frustration of writing the same date arithmetic over and over again, especially for:

- **Analytics dashboards** (because "last 30 days" is apparently rocket science)
- **Background jobs** (scheduled tasks that need to know what "yesterday" means)
- **Date range pickers** (where users expect magic, not math)
- **Cache keys** (where `"data-2024-01-15"` is less useful than `"data-now-d"`)

## Installation

```bash
npm install datetoken
```

*Works with Node.js ≥18. For older versions, you probably have bigger problems to worry about.*

## Quick Start 🚀

*"Show, don't tell"* – every programming tutorial ever

```typescript
import datetoken from 'datetoken';

// The classics
console.log(datetoken('now'));           // Right now (shocking, I know)
console.log(datetoken('now-d/d'));       // Start of yesterday  
console.log(datetoken('now-d@d'));       // End of yesterday

// Business intelligence gold
console.log(datetoken('now-w/bw'));      // Start of last business week
console.log(datetoken('now-1M/M'));      // Start of last month
console.log(datetoken('now/Q'));         // Start of current quarter

// The "wait, that actually works?" category
console.log(datetoken('now-1w+3d-6h'));  // Last week + 3 days - 6 hours
console.log(datetoken('now/Y+Q2/Q2'));   // Start of Q2 this year
```

*Pro tip: If you find yourself calculating dates with raw milliseconds, datetoken is here to judge you silently while solving your problems.*

## The Tokens Explained 📚

### Basic Structure

Every token starts with `now` because, let's face it, everything is relative to the present moment (how philosophical).

```
now[±amount][unit][/snap|@snap]
```

### Arithmetic Operations

Add (`+`) or subtract (`-`) time units. Math, but make it readable:

```typescript
datetoken('now-3d');        // 3 days ago
datetoken('now+2w');        // 2 weeks from now  
datetoken('now-1M+5d');     // 1 month ago, plus 5 days
datetoken('now+6h-30m');    // 6 hours and 30 minutes from now
```

**Supported units:**
- `s` - seconds *(because microsecond precision is overrated)*
- `m` - minutes 
- `h` - hours
- `d` - days
- `w` - weeks
- `M` - months *(capital M, because lowercase is for minutes)*
- `Y` - years
- `Q` - quarters *(Q1, Q2, Q3, Q4 also work)*

### Snap Operations

The real magic happens when you need boundaries. Use `/` for "start of" and `@` for "end of":

```typescript
datetoken('now/d');         // Start of today (00:00:00)
datetoken('now@d');         // End of today (23:59:59)
datetoken('now-w/w');       // Start of last week
datetoken('now/M');         // Start of this month
datetoken('now-1Y@Y');      // End of last year
```

**Business weeks** (`bw`) are special – they run Monday to Friday, because apparently weekends don't count in corporate America:

```typescript
datetoken('now/bw');        // Start of current business week (Monday)
datetoken('now@bw');        // End of current business week (Friday)
```

## Common Patterns 💡

*"Give a developer a date, they'll code for a day. Teach them datetoken, and they'll never write date arithmetic again."*

| What You Actually Want | The Token | Old School Equivalent |
|------------------------|-----------|----------------------|
| Yesterday | `now-d/d` to `now-d@d` | *[30 lines of Date() horror]* |
| Last 7 days | `now-7d` to `now` | `new Date(Date.now() - 7*24*60*60*1000)` |
| This month | `now/M` to `now@M` | *[Stack Overflow intensifies]* |
| Last business week | `now-w/bw` to `now-w@bw` | *[Existential crisis]* |
| Q1 this year | `now/Q1` to `now@Q1` | *[Therapy recommended]* |
| Last month's data | `now-1M/M` to `now-1M@M` | *[Career change considered]* |

## Advanced Examples 🎯

Sometimes you need to get creative. Datetoken handles complex chains like a champ:

```typescript
// Last month's second business week  
datetoken('now-1M/M+w/bw');

// End of Q3 last year
datetoken('now-1Y/Y+Q3@Q3');

// 3 months ago, plus 2 weeks, minus 4 days, snapped to start of week
datetoken('now-3M+2w-4d/w');

// Because someone, somewhere, needs this specific date
datetoken('now-1Y+6M-3w+2d/d');
```

*If you're using chains this complex, you might want to document them. Your future self will thank you.*

## API Reference 📖

### `datetoken(token: string, startAt?: Date, clock?: ClockI): Date`

**Parameters:**
- `token` - The datetoken string to parse
- `startAt` *(optional)* - Custom starting date (defaults to current time)
- `clock` *(optional)* - Custom clock implementation (for testing, time travel, etc.)

**Returns:** JavaScript `Date` object

**Throws:** `InvalidTokenError` if the token is malformed

```typescript
import datetoken, { Token } from 'datetoken';

// Basic usage
const yesterday = datetoken('now-d/d');

// With custom starting point
const customDate = new Date('2024-06-15');
const result = datetoken('now-1w', customDate);

// For testing (inject your own clock)
const mockClock = { getTime: () => new Date('2024-01-01') };
const testDate = datetoken('now+1d', undefined, mockClock);
```

## Module Support 📦

This package is built for the modern world (ES modules) but won't leave you behind:

```typescript
// ES modules (recommended)
import datetoken from 'datetoken';
import { Token } from 'datetoken';

// CommonJS (if you must)
const datetoken = require('datetoken').default;
const { Token } = require('datetoken');
```

## Performance 🚀

Datetoken is fast enough that you won't notice it, and small enough that you won't care:

- **Zero dependencies** *(except for date-fns, which you probably already have)*
- **~2KB gzipped** *(smaller than your average cat GIF)*
- **Cached parsing** *(because we're not monsters)*

## Browser Support 🌐

Works in any environment that supports ES2022:

- **Node.js** ≥18
- **Modern browsers** (Chrome 94+, Firefox 93+, Safari 15+)
- **Edge** (if that's your thing)

*IE support was considered, then we remembered it's 2025.*

## Testing 🧪

```bash
npm test                    # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

We test extensively because date logic is where bugs go to multiply like rabbits.

## Contributing 🤝

Found a bug? Want a feature? Have a better joke for the README?

1. **Fork it** (the repository, not the process)
2. **Branch it** (`git checkout -b feature/amazing-feature`)
3. **Test it** (`npm test`)
4. **Commit it** (`git commit -m 'Add amazing feature'`)
5. **Push it** (`git push origin feature/amazing-feature`)
6. **PR it** (Open a Pull Request)

## Known Limitations 🚨

- **Business weeks** assume Monday-Friday. If your business runs on Mars time, you're on your own.
- **Quarters** follow the standard calendar. Fiscal year weirdness is not supported (yet).
- **Time zones** are handled by the underlying Date object. Datetoken doesn't try to be smarter than JavaScript here.

## License 📄

MIT License - because sharing is caring, and lawyers are expensive.

## Credits 👨‍💻

Built with ❤️ (and a healthy dose of frustration with JavaScript dates) by [sonirico](https://github.com/sonirico).

*Special thanks to everyone who's ever had to calculate "last Tuesday" in JavaScript. This one's for you.*

---

*"It's not about the destination, it's about the friends we make along the way."* – No one, ever, when dealing with date arithmetic.
