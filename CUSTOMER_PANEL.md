# Customer panel in the DocsGPT fork

`feat/persian-rtl-support` keeps the Persian/RTL baseline. The long-lived
`feat/customer-saas-panel` branch adds the website-support customer entry on top.
`upstream` points to `https://github.com/arc53/DocsGPT.git`; `origin` is our fork.

The normal `index.html` / `main.tsx` / `App.tsx` management application is unchanged.
`customer.html` is a second build of the same frontend. It directly imports upstream
SectionNav, SectionShell, SectionPageHeader, the mobile sheet, cards, forms, buttons,
alerts, code blocks, translation resources, direction provider and theme tokens.
Only the customer navigation definition, screens and scoped API adapter are new.
The reusable touch sizes leave management defaults intact.

The customer entry uses phone-session cookies with `/api/support-saas` on the same
origin. It does not initialize native DocsGPT authentication, load stored native
credentials, mount administration, or proxy arbitrary native endpoints. Navigation
hiding is not an authorization boundary: the Moftkhar server independently enforces
ownership, trial/paid access, usage reservations, crawl limits and bank verification.
The preview uses the pinned Persian DocsGPT widget and its metered owner endpoint.

Moftkhar retains the public landing, phone/OTP flow, widget host and merchant callback.
It serves the pinned customer bundle at `/panel/*` with assets in `/support-panel/`.
Existing `/dashboard` and `/billing/result` links redirect there. The build never
moves banking or native management credentials into JavaScript.

## Build and update

```sh
cd frontend
npm ci
npm run lint
npm test
npm run build
npm run build:customer
# Commit the tested source before exporting; the exporter refuses a dirty checkout.
node scripts/package-customer.mjs /absolute/path/to/moftkhar/vendor
```

The export records the Git revision and SHA-256 in `supportPanel.json`, includes the
upstream license, and omits maps, environment files, databases and browser storage.
Moftkhar verifies that digest in `predev` and `prebuild` before installing the bundle.
The customer entry loads the host's existing licensed Vazirmatn font at `/fonts/`.

To import upstream fixes, first commit our changes, then use a temporary integration
branch. Never reset the feature branch or force-push it:

```sh
git fetch upstream
git switch -c integration/docsgpt-YYYYMMDD feat/customer-saas-panel
git merge upstream/main
# Resolve conflicts preserving the customer adapter and existing security tests.
cd frontend
npm ci
npm run lint
npm test
npm run build
npm run build:customer
```

Inspect the changes, run relevant backend tests and existing-Chrome acceptance, then
merge the tested integration branch into `feat/customer-saas-panel`. Re-export and
review the pinned bundle before deployment. Upstream updates are reviewed releases,
not automatic production upgrades. Keep deployment flags disabled until the existing
backup, pricing, isolation and live-journey gates pass. No live launch is claimed by
the customer build.
