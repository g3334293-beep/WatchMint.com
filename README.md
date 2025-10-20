WatchMint — Withdraw Request Page
================================

Files
-----
- withdraw.html : Withdrawal request page (static, client-side)
- withdraw.css  : Styling
- withdraw.js   : Client-side logic, stores requests in browser localStorage and exports CSV

How this works (important)
--------------------------
- This is a **static** implementation suitable for GitHub Pages.
- Withdrawal requests are stored **locally in each admin's browser** using `localStorage`. When a user submits a request, it's saved on the visitor's browser (or on the admin's browser if they tested).
- To collect requests from real users you must add a server-side backend (recommended) or use a serverless function that receives POST requests and stores requests in a database (Firestore, Supabase, or a simple Google Sheets integration).

Recommended next steps for real deployment
-----------------------------------------
1. Replace localStorage with a POST to your backend:
   - Example: `POST /api/withdraw` with JSON payload containing the request.
   - Store requests securely in a database and mark status (pending/paid/failed).
2. Implement authentication: require users to be logged in (Firebase Auth / Auth0) before submitting.
3. Implement KYC and verification for withdrawals (phone verification, ID at thresholds).
4. For automated payouts:
   - Use a licensed payment provider and their API (JazzCash/EasyPaisa merchant APIs) — these require business accounts, encryption, and compliance.
   - NEVER store card or sensitive payment credentials in client-side code.
5. For manual payouts:
   - Admin can use "Export Requests" button on the page to download `watchmint_withdraw_requests.csv` and process payouts from the merchant portal or agent.
6. Email notifications:
   - On server-side store, trigger emails to users when their request is processed.

Security & Compliance
--------------------
- Do not collect sensitive personal data unnecessarily.
- Ensure GDPR/PDPA/privacy compliance depending on your users' location.
- Follow JazzCash/EasyPaisa terms — they may require merchant registration for bulk/automated payouts.

If you want, I can now:
- (A) Convert this into a simple serverless function (Netlify Lambda / Vercel) example that accepts POST and stores requests in a JSON file (demo) or in Firestore.
- (B) Provide sample integration steps for JazzCash/EasyPaisa merchant APIs (note: you'll need merchant credentials).
- (C) Make the withdraw page require Firebase login and then store requests in Firestore.

Tell me which next step (A / B / C) you want, or just download the ZIP and upload to GitHub Pages.
