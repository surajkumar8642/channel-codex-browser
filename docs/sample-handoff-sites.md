Channel Codex Browser - Sample Handoff Sites

Purpose
Use these sites to test the shared control model where:
- you do a manual step
- Codex does an automated step
- you take over again if needed

Current model
- Codex uses the standalone controller directly
- No Chrome extension is required

Sample 1 - Google Search
URL
- https://www.google.com

Manual step
- Accept consent page if Google shows it

Codex step
- Type search text into `textarea[name='q']`
- Press `Enter`
- Extract page text or links

Why this is useful
- Very simple way to confirm the turn-based browser flow works

Sample 2 - GitHub
URL
- https://github.com/login

Manual step
- Log in manually
- Complete 2FA if needed

Codex step
- Open a repo or issues page
- Extract links
- Click elements by selector

Why this is useful
- Good test for login + human verification + automation after login

Sample 3 - Google Search Console
URL
- https://search.google.com/search-console

Manual step
- Log in
- Complete account checks or verification prompts

Codex step
- Open property pages
- Wait for selectors
- Type into fields
- Click action buttons
- Extract confirmation text

Why this is useful
- This matches your intended real workflow

Sample 4 - Google Account Pages
URL
- https://myaccount.google.com

Manual step
- Log in manually

Codex step
- Navigate to sections
- Extract visible text
- Click known buttons or links

Why this is useful
- Another good Google login handoff test

Sample 5 - Example Form Page
URL
- https://httpbin.org/forms/post

Manual step
- Optionally edit one field yourself first

Codex step
- Type values into fields
- Click submit
- Read the response page

Why this is useful
- Safe form automation practice without account risk

Recommended test order
1. Google Search
2. httpbin form
3. GitHub login flow
4. Google Search Console

Suggested selectors for the first tests

Google Search
- Search input: `textarea[name='q']`

httpbin form
- Customer name: `input[name='custname']`
- Telephone: `input[name='custtel']`
- Email: `input[name='custemail']`
- Submit: `button[type='submit']`

Basic handoff pattern
1. Open the target URL
2. You complete any login, CAPTCHA, or consent step
3. Tell Codex to continue
4. Codex runs one or more browser commands
5. You interrupt again whenever manual input is needed
