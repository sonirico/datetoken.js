# Datetoken
[![GitHub Actions](https://github.com/sonirico/datetoken.js/workflows/CI/badge.svg)](https://github.com/sonirico/datetoken.js/actions)

**Datetoken** is a lightweight utility that interprets human-readable date tokens into JavaScript `Date` objects, allowing relative date/time calculations in a compact string format.

## Installation

```shell
npm install datetoken
```

## Quick Examples

Often, you'll need “preset” tokens such as **yesterday** or **the last 24 hours**. Below are some basic examples:

```js
const datetoken = require('datetoken');

console.log(new Date());
// => 2018-10-18 14:08:47

console.log(datetoken('now-d/d'));  // Start of yesterday
// => 2018-10-17 00:00:00

console.log(datetoken('now-d@d'));  // End of yesterday
// => 2018-10-17 23:59:59
```

## Motivation

Datetoken addresses scenarios where dates need to be specified in a **relative**, tokenized way:

- **Automated background tasks**
- **Date range pickers**
- **Persistent tokens for caching**

Using a token format (e.g. `"now-d/d"`) lets you store or reuse date references without having to replace them when the current time changes. The calculation happens at **evaluation time**, making these tokens flexible and reusable.

## Usage & Examples

**Relative tokens** follow a certain pattern:

| Range                       | From           | To            |
| --------------------------- | -------------- | ------------- |
| Today                       | `now/d`        | `now`         |
| Yesterday                   | `now-d/d`      | `now-d@d`     |
| Last 24 hours               | `now-24h`      | `now`         |
| Last business week          | `now-w/bw`     | `now-w@bw`    |
| This business week          | `now/bw`       | `now@bw`      |
| Last month                  | `now-1M/M`     | `now-1M@M`    |
| Next week                   | `now+w/w`      | `now+w@w`     |
| Custom range                | `now+w-2d/h`   | `now+2M-10h`  |
| Last month’s first biz week | `now-M/M+w/bw` | `now-M/+w@bw` |
| This year                   | `now/Y`        | `now@Y`       |
| This quarter                | `now/Q`        | `now@Q`       |
| First quarter (Q1)          | `now/Q1`       | `now@Q1`      |
| Second quarter (Q2)         | `now/Q2`       | `now@Q2`      |
| Third quarter (Q3)          | `now/Q3`       | `now@Q3`      |
| Fourth quarter (Q4)         | `now/Q4`       | `now@Q4`      |

**Pattern breakdown**:

1. `now`: Represents the moment of evaluation.
2. **Arithmetic modifiers**: `+` or `-` to shift the date/time, e.g. `now-1M+3d+2h`.
   - Supported units:
     - `s` (seconds)
     - `m` (minutes)
     - `h` (hours)
     - `d` (days)
     - `w` (weeks)
     - `M` (months)
     - `Y` (years)
     - `Q` (quarters)
3. **Snap modifiers**: `/` (start) and `@` (end) to align to the boundaries of the given unit.
   - Includes a special `bw` unit for **business week** (Mon–Fri snapshot).

This lets you define canonical ranges like *Today* (`now/d` to `now`) or *Last month* (`now-1M/M` to `now-1M@M`).

## Compatibility

- **Node >= 8.10**: Install `datetoken@1.x.x`
- **Older Node versions**: Use `datetoken@0.x.x`

## Known Limitations

- **Business weeks** (`bw`) may not behave as expected in time zones where the first workday differs significantly from Monday.

**Datetoken** helps keep your date logic clean, readable, and maintainable, especially when dealing with relative time calculations or range-based queries. Give it a try in your next project!
