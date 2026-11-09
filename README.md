# PakToolkit — paktoolkit.top

Free online tools for Pakistan: Pakistan calculators (Bijli Bill, Salary Tax
2025-26, MDCAT Aggregate, Zakat, Marla/Kanal), image tools and PDF tools.
Every tool runs 100% in the visitor's browser — no uploads, no accounts.

## Build
`python3 build.py` renders the whole site into `dist/` from `content.py`,
`tools.js` and `style.css`. Netlify runs this on every push (see netlify.toml).

Rates live in ONE place: `tools.js` CONFIG objects (BIJLI_CONFIG per
S.R.O. 279(I)/2026, TAX_CONFIG per Finance Act 2025, ZAKAT_CONFIG nisab).
