# Bostadsköpshjälpen / House Buying Helper

Calculate and visualize the finances of buying a home on the Swedish market — as a website and as an installable phone app (Android and /e/OS).

## Features

- House price, loan amount, and down payment (kontantinsats) with adjustable percentage
- Annuity loan (annuitet): monthly payment, amortization per year and per month
- Compare up to 3 interest rates side by side
- Interest cost per year and month, with and without Swedish interest tax deduction (ränteavdrag, advanced rules: 30% on the first 100 000 kr capital deficit per borrower, 21% above, per-person thresholds for multiple borrowers)
- Monthly fee for housing cooperatives (månadsavgift bostadsrättsförening) and other monthly costs
- Total monthly cost, before and after ränteavdrag
- Compare with your current monthly housing cost
- Expected value growth with a SCB-backed default (Fastighetsprisindex, permanent småhus) that can be fetched live; works offline with a fallback default
- Net sale value (house value minus remaining loan) per year
- Graphs and a full year-by-year table of every number over the loan's lifetime
- Swedish and English UI

## Run locally

```bash
npm install
npm run dev
```

## Build for web (PWA)

```bash
npm run build
npm run preview
```

The build output in `dist/` is a Progressive Web App: served over HTTPS, users can "Add to home screen" and it works offline.

## Build the Android APK

Prerequisites: Android Studio (or the Android SDK) and JDK 17+.

```bash
npm run build
npx cap sync android
npx cap open android   # then Build > Build APK(s) in Android Studio
```

Or from the command line:

```bash
cd android
./gradlew assembleDebug
# APK at android/app/build/outputs/apk/debug/app-debug.apk
```

For /e/OS, distribute the APK via [F-Droid](https://f-droid.org) or install it directly.

## Project layout

- `src/calc.ts` — all financial calculations (annuity, ränteavdrag, yearly schedule, SCB fetch)
- `src/i18n.ts` — Swedish/English translations
- `src/App.tsx` — the UI (inputs, summary cards, rate comparison, charts, yearly table)
- `android/` — the Capacitor Android project (APK)

## Disclaimer

The calculations are estimates and do not constitute financial advice.
