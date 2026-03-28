Channel Codex Browser - Test Plan

Test 1 - Google
- Codex opens `https://www.google.com`
- Human handles consent if needed
- Codex searches for a query
- Codex extracts result links

Test 2 - Safe form
- Codex opens `https://httpbin.org/forms/post`
- Codex fills some fields
- Human fills one field manually
- Codex submits the form
- Codex reads the result page

Test 3 - Authenticated site
- Codex opens `https://github.com/login`
- Human logs in
- Codex continues on the authenticated session

Expected outcome
- Browser stays under shared control
- Human and Codex can alternate in the same session
- Codex continues after manual steps without restarting the browser
