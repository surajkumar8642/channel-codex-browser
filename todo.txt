Channel Codex Browser - TODO

Current architecture
- [x] Remove Chrome extension dependency
- [x] Remove native messaging host dependency
- [x] Use standalone browser controller with Chrome remote debugging
- [x] Reuse one controlled browser session across manual and Codex steps

Working commands
- [x] `launchBrowser`
- [x] `status`
- [x] `openUrl`
- [x] `getPageText`
- [x] `typeText`
- [x] `clickElement`
- [x] `pressKey`
- [x] `rawType`
- [x] `waitFor`
- [x] `extractText`
- [x] `extractLinks`
- [x] `scrollPage`
- [x] `submitForm`

Shared-control workflow
- [x] Codex opens pages directly
- [x] Human can do login / CAPTCHA / OTP / approval steps
- [x] Codex can continue on the same browser after manual steps

Next improvements
- [ ] Reuse a single active tab more strictly
- [ ] Reduce navigation flicker
- [ ] Add retry after navigation changes
- [ ] Add workflow runner for saved step sequences
- [ ] Add Search Console removal workflow
- [ ] Add Search Console reindex workflow
- [ ] Add screenshots and page snapshot export
