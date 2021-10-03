# Datetoken [![CircleCI](https://circleci.com/gh/sonirico/datetoken.js.svg?style=svg)](https://circleci.com/gh/sonirico/datetoken.js) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=sonirico/datetoken.js)](https://dependabot.com)

## Motivation

This package aims to solve a set of needs present in applications where
dates need to be represented in a relative fashion, like background periodic
tasks, datetime range pickers... in a compact and stringified format. This
enables the programmer to persist these tokens during the lifetime of a
process or even longer, since calculations are performed in the moment of
evaluation. Theses tokens are also useful when caching URLs as replacement
of timestamps, which would break caching given their mutability nature.

Some common examples of relative tokens:

|                                | From           | To            |
| ------------------------------ | -------------- | ------------- |
| Today                          | `now/d`        | `now`         |
| Yesterday                      | `now-d/d`      | `now-d@d`     |
| Last 24 hours                  | `now-24h`      | `now`         |
| Last business week             | `now-w/bw`     | `now-w@bw`    |
| This business week             | `now/bw`       | `now@bw`      |
| Last month                     | `now-1M/M`     | `now-1M@M`    |
| Next week                      | `now+w/w`      | `now+w@w`     |
| Custom range                   | `now+w-2d/h`   | `now+2M-10h`  |
| Last month first business week | `now-M/M+w/bw` | `now-M/+w@bw` |
| This year                      | `now/Y`        | `now@Y`       |
| This quarter                   | `now/Q`        | `now@Q`       |
| First quarter   (Q1)           | `now/Q1`       | `now@Q1`      |
| Second quarter  (Q2)           | `now/Q2`       | `now@Q2`      |
| Third quarter   (Q3)           | `now/Q3`       | `now@Q3`      |
| Fourth quarter  (Q4)           | `now/Q4`       | `now@Q4`      |

As you may have noticed, token follow a pattern:

- The word `now`. It means the point in the future timeline when tokens are
  parsed to their datetime form.
- Optionally, modifiers to add and/or subtract the future value of `now` can
  be used. Unsurprisingly, additions are set via `+`, while `-` mean
  subtractions. These modifiers can be chained as many times as needed.
  E.g: `now-1M+3d+2h`. Along with the arithmetical sign and the amount, the
  unit of time the amount refers to must be specified. Currently, the supported
  units are:
  - `s` seconds
  - `m` minutes
  - `h` hours
  - `d` days
  - `w` weeks
  - `M` months
  - `Y` years
  - `Q` quarters
- Optionally, there exist two extra modifiers to snap dates to the start or the
  end of any given snapshot unit. Those are:
  - `/` Snap the date to the start of the snapshot unit.
  - `@` Snap the date to the end of the snapshot unit.

  Snapshot units are the same as arithmetical modifiers, plus `bw`, meaning
  _business week_. With this, we achieve a simple way to define canonical
  relative date ranges, such as _Today_ or _Last month_. As an example of
  the later:

  - String representation: `now-1M/M`, `now-1M@M`
  - Being today _15 Jan 2018_, the result range should be:
    _2018-01-01 00:00:00 / 2018-01-31 23:59:59_

## Compatibilty

- For node>=8.10 use datetoken==1.x.x
- Otherwise use datetoken==0.x.x

## Installing

```shell
npm i datetoken
```

## Examples

Most probably you will be dealing with simple presets such as _yesterday_ or
the _last 24 hours_.

```node
>>> const tokenToDate = require('datetoken/utils').tokenToDate;
>>> console.log(new Date())
2018-10-18 14:08:47
>>> tokenToDate('now-d/d')  # Start of yesterday
2018-10-17 00:00:00
>>> tokenToDate('now-d@d')  # End of yesterday
2018-10-17 23:59:59
```

## Issues

- Business week snapshots might not be reliable in timezones where weeks
  start in days other than Monday

