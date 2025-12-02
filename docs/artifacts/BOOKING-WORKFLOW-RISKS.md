# Risk Assessment & Known Issues - Booking Workflow Plan

**Document Version:** 1.0  
**Date:** January 9, 2025  
**Status:** Pre-Implementation Review

---

## 🔴 Critical Risks

### 1. Race Conditions & Concurrency
**Risk Level:** HIGH - Could cause double bookings or data loss

**Issues:**
- User books appointment while background sync is running → duplicate or conflicting data
- Two admins approve same booking simultaneously → status conflicts  
- Nextcloud event modified during sync → data inconsistency
- No database transaction handling in appointments API

**Mitigation Required:**
- Add database transaction locks for booking creation
- Implement optimistic locking with ETags for updates
- Add conflict resolution logic with "last write wins" or manual reconciliation
- Add unique constraints to prevent duplicates

**Missing from Plan:** Transaction handling completely absent

---

### 2. Authentication & Authorization Gaps
**Risk Level:** HIGH - Security vulnerability

**Issues:**
- Assumption that `session.user.id` exists and matches `appointments.client_id` format
- Admin role checking duplicated in every page - error-prone
- No middleware protecting admin routes - easy to miss a check
- User table schema not verified in plan

**Mitigation Required:**
- Create authentication middleware for all admin routes
- Verify user schema has compatible `id` field
- Add comprehensive auth tests
- Use Next.js middleware for route protection

**Missing from Plan:** No middleware implementation, schema verification

---

### 3. Background Sync Reliability
**Risk Level:** HIGH - Core functionality breaks

**Issues:**
- Worker failures are only logged - no alerts or retries
- Nextcloud down = all syncs fail with no recovery
- Network timeouts cause partial syncs
- 5-minute sync interval = 5-minute lag for critical status changes
- No queue for failed operations

**Mitigation Required:**
- Implement retry queue with exponential backoff
- Add Cloudflare Workers monitoring/alerting
- Create health check endpoint
- Consider webhook alternative to reduce lag
- Add dead letter queue for permanent failures

**Missing from Plan:** Retry mechanism, monitoring, alerting

---

### 4. Email Notification Dependency
**Risk Level:** HIGH - User communication breaks

**Issues:**
- Entire workflow depends on email but marked as "TODO"
- Users/artists never know about status changes without email
- SMTP configuration might not be set
- No email templates defined
- No fallback if email fails

**Mitigation Required:**
- Implement email system BEFORE other phases
- Choose email provider (SendGrid, Postmark, AWS SES)
- Create email templates
- Add in-app notifications as backup
- Queue failed emails for retry

**Missing from Plan:** Email is Phase 3+ but should be Phase 1

---

## 🟡 Medium Risks

### 5. Status Detection Brittleness
**Risk Level:** MEDIUM - Incorrect status updates

**Issues:**
- Relies on "REQUEST:" prefix - artist could manually edit title
- External calendar events could be misidentified as bookings
- ical.js might not parse STATUS field correctly
- No validation that event belongs to booking system
- Magic string "REQUEST:" is hardcoded everywhere

**Mitigation Required:**
- Add unique identifier (UUID) in event description
- Validate event source before processing
- Add manual reconciliation UI for admins
- Move magic strings to constants
- Add event ownership verification

**Missing from Plan:** Event validation, reconciliation UI

---

### 6. CalDAV/Nextcloud Availability
**Risk Level:** MEDIUM - Degrades user experience

**Issues:**
- Nextcloud down = slow booking submission (waits for timeout)
- CalDAV credentials could expire without notice
- Network latency makes availability checks slow (300ms debounce helps but not enough)
- Multiple calendars per artist not supported
- Calendar URL format might vary by Nextcloud version

**Mitigation Required:**
- Add CalDAV health check endpoint
- Implement credential rotation monitoring
- Add faster timeout for availability checks (2-3 seconds max)
- Cache availability results briefly
- Test with different Nextcloud versions

**Missing from Plan:** Health checks, caching, timeout limits

---

### 7. Performance & Scalability
**Risk Level:** MEDIUM - Won't scale beyond ~50 artists

**Issues:**
- Background worker syncs ALL artists every 5 minutes (expensive)
- Fetches 90-day event range every sync (slow with many bookings)
- No pagination on bookings DataTable (breaks with 1000+ bookings)
- Availability check fires on every form field change
- No incremental sync using sync-token

**Mitigation Required:**
- Implement incremental sync with sync-token (CalDAV supports this)
- Add pagination to bookings table
- Limit event range to 30 days with on-demand expansion
- Implement smarter caching for availability
- Consider sync only changed calendars

**Missing from Plan:** Incremental sync, pagination, performance testing

---

### 8. Timezone Edge Cases
**Risk Level:** MEDIUM - Wrong-time bookings

**Issues:**
- Hardcoded America/Denver prevents expansion
- Daylight Saving Time transitions not tested
- Date comparison between systems has timezone bugs potential
- User browser timezone vs server vs Nextcloud timezone
- No verification that times are displayed correctly

**Mitigation Required:**
- Store all times in UTC internally
- Use date-fns-tz for ALL timezone operations
- Test DST transitions (spring forward, fall back)
- Add timezone to user preferences if expanding
- Display timezone clearly in UI

**Missing from Plan:** DST testing, UTC storage verification

---

### 9. Data Consistency & Integrity
**Risk Level:** MEDIUM - Data quality degrades

**Issues:**
- ETag conflicts if event updated simultaneously
- No global unique constraint on `caldav_uid` (only per artist)
- `calendar_sync_logs` will grow unbounded
- No validation on calendar URL format
- No cascade delete handling documented

**Mitigation Required:**
- Add global unique constraint on `caldav_uid`
- Implement log rotation (keep last 90 days)
- Validate calendar URLs with regex
- Add ETag conflict resolution
- Document cascade delete behavior

**Missing from Plan:** Constraints, log rotation, URL validation

---

## 🟢 Low Risks (Nice to Have)

### 10. User Experience Gaps
**Issues:**
- No way to edit booking after submission
- No user-facing cancellation flow
- Confirmation page doesn't show sync status
- No booking history for users
- No real-time updates (5-min lag)

**Mitigation:** Add these as Phase 2 features post-launch

---

### 11. Admin Experience Gaps
**Issues:**
- No bulk operations in dashboard
- No manual reconciliation UI for conflicts
- No artist notification preferences
- No test connection button (only validates on save)

**Mitigation:** Add as Phase 3 enhancements

---

### 12. Testing Coverage
**Issues:**
- No automated tests (marked TODO)
- Manual checklist not integrated into CI/CD
- No load testing
- No concurrent booking tests

**Mitigation:** Add comprehensive test suite before production

---

### 13. Monitoring & Observability
**Issues:**
- No monitoring for worker failures
- Toast errors disappear on navigation
- No dashboard for sync health
- No Sentry or error tracking

**Mitigation:** Add monitoring in Phase 4

---

### 14. Deployment & Operations
**Issues:**
- Workers cron needs separate deployment
- No staging strategy
- No migration rollback plan
- Environment variables not documented

**Mitigation:** Create deployment runbook

---

## 🔧 Technical Debt & Limitations

### 15. Architecture Limitations
- Single Nextcloud credentials (no per-artist OAuth)
- One calendar per artist only
- No recurring appointments
- No multi-day appointments
- No support for artist breaks/vacations

### 16. Code Quality Issues
- Admin role checks duplicated (should be middleware)
- Magic strings not in constants
- No API versioning
- No TypeScript strict mode mentioned

### 17. Missing Features (Known)
- Email notifications (CRITICAL)
- Automated tests (CRITICAL)
- Background worker deployment (CRITICAL)
- Booking edit flow
- User cancellation
- Webhook support
- In-app notifications
- SMS option

---

## 🚨 Showstopper Scenarios

### Scenario 1: Nextcloud Down During Peak Hours
**Impact:** Users book but syncs fail → artists don't see bookings  
**Current Plan:** Fallback to DB-only  
**Gap:** No retry queue when Nextcloud returns  
**Required:** Implement sync queue

### Scenario 2: Background Worker Stops
**Impact:** No Nextcloud→Web sync, status changes invisible  
**Current Plan:** Worker runs but no monitoring  
**Gap:** No alerts if worker dies  
**Required:** Health monitoring + alerting

### Scenario 3: Double Booking
**Impact:** Two users book same slot simultaneously  
**Current Plan:** Availability check before booking  
**Gap:** Race condition between check and create  
**Required:** Transaction locks

### Scenario 4: Email System Down  
**Impact:** Zero user/artist communication  
**Current Plan:** Email marked as TODO  
**Gap:** No fallback communication method  
**Required:** Email + in-app notifications

### Scenario 5: DST Transition Bug
**Impact:** Appointments booked 1 hour off  
**Current Plan:** Use date-fns-tz  
**Gap:** No DST testing mentioned  
**Required:** DST test suite

---

## 📋 Pre-Launch Checklist

### ✅ Must-Have (Blocking)
1. [ ] Implement email notification system with templates
2. [ ] Add authentication middleware for admin routes  
3. [ ] Implement retry queue for failed syncs
4. [ ] Add transaction handling to appointments API
5. [ ] Deploy and test background worker
6. [ ] Verify timezone handling with DST tests
7. [ ] Add monitoring and alerting (Cloudflare Workers analytics + Sentry)
8. [ ] Write critical path tests (booking flow, sync flow)
9. [ ] Create deployment runbook
10. [ ] Set up staging environment with test Nextcloud

### ⚠️ Should-Have (Important)
- [ ] Rate limiting on booking endpoint
- [ ] CSRF protection verification  
- [ ] Calendar URL validation with regex
- [ ] Sync log rotation (90-day retention)
- [ ] Admin reconciliation UI for conflicts
- [ ] User booking history page
- [ ] Load test background worker (100+ artists)
- [ ] Global unique constraint on caldav_uid

### 💚 Nice-to-Have (Post-Launch)
- [ ] Webhook support for instant sync (eliminate 5-min lag)
- [ ] In-app real-time notifications (WebSockets)
- [ ] User edit/cancel flows
- [ ] Bulk admin operations
- [ ] Multiple calendars per artist
- [ ] SMS notification option
- [ ] Recurring appointment support

---

## 🎯 Revised Implementation Order

### Phase 0: Critical Foundation (NEW - REQUIRED FIRST)
**Duration:** 2-3 days  
**Blockers:** Authentication, email, transactions

1. Add authentication middleware to protect admin routes
2. Verify user schema matches `appointments.client_id`
3. Add transaction handling to appointments API
4. Choose and set up email provider (SendGrid recommended)
5. Create basic email templates
6. Add error tracking (Sentry)

**Acceptance Criteria:**
- Admin routes redirect unauthorized users
- Email sends successfully in dev
- Transaction prevents double bookings
- Errors logged to Sentry

---

### Phase 1: Core Booking Flow ✅ (As Planned)
**Duration:** 3-4 days  
**Dependencies:** Phase 0 complete

1. Booking form submission with React Query
2. Confirmation page with timezone display
3. CalDAV sync on booking creation
4. Email notification on booking submission

**Acceptance Criteria:**
- User can submit booking
- Booking appears in Nextcloud with REQUEST: prefix
- User receives confirmation email
- Toast shows success/error

---

### Phase 2: Admin Infrastructure ✅ (As Planned)
**Duration:** 3-4 days  
**Dependencies:** Phase 1 complete

1. Calendar configuration UI
2. Bookings DataTable with filters
3. Approve/reject actions
4. Status sync to Nextcloud

**Acceptance Criteria:**
- Admin can link calendars
- Admin sees pending bookings
- Approve updates status + Nextcloud
- Email sent on status change

---

### Phase 3: Background Sync ⚠️ (Enhanced)
**Duration:** 4-5 days  
**Dependencies:** Phase 2 complete

1. Smart status detection logic
2. Background worker implementation
3. **NEW:** Retry queue for failed syncs
4. **NEW:** Health check endpoint
5. **NEW:** Cloudflare Workers monitoring

**Acceptance Criteria:**
- Worker runs every 5 minutes
- Status changes detected from Nextcloud
- Failed syncs retry 3 times
- Alerts sent on persistent failures
- Health check returns sync status

---

### Phase 4: Production Hardening (NEW - CRITICAL)
**Duration:** 3-4 days  
**Dependencies:** Phase 3 complete

1. Comprehensive error handling
2. Rate limiting (10 bookings/user/hour)
3. DST timezone testing
4. Load testing (100 artists, 1000 bookings)
5. Monitoring dashboard
6. Sync log rotation
7. Admin reconciliation UI

**Acceptance Criteria:**
- All errors handled gracefully
- Rate limits prevent abuse
- DST transitions work correctly
- Worker handles load without issues
- Admins can see sync health
- Logs don't grow unbounded

---

### Phase 5: Staging & Launch 🚀
**Duration:** 2-3 days  
**Dependencies:** Phase 4 complete

1. Deploy to staging with test Nextcloud
2. Run full test suite
3. Load test in staging
4. Security review
5. Deploy to production
6. Monitor for 48 hours

**Acceptance Criteria:**
- All tests pass in staging
- No critical errors in 24h staging run
- Security review approved
- Production deploy successful
- Zero critical issues in first 48h

---

## 💡 Recommendations

### Before Starting Implementation

**Critical Decisions Needed:**
1. ✅ Which email provider? (Recommend: SendGrid or Postmark)
2. ✅ Confirm user schema structure
3. ✅ Set up staging Nextcloud instance
4. ✅ Choose error tracking (Sentry vs Cloudflare Logs)
5. ✅ Define rate limits for bookings

**Infrastructure Setup:**
1. Create staging environment
2. Set up Nextcloud test instance
3. Configure email provider
4. Set up error tracking
5. Document all environment variables

---

### During Implementation

**Code Quality:**
1. Add TypeScript strict mode
2. Create constants file for magic strings
3. Write tests alongside features
4. Add comprehensive JSDoc comments
5. Use auth middleware everywhere

**Testing Strategy:**
1. Unit tests for sync logic
2. Integration tests for booking flow
3. E2E tests for critical paths
4. Load tests for background worker
5. DST timezone tests

---

### After Implementation

**Operations:**
1. Create runbook for common issues
2. Train staff on admin dashboards
3. Set up monitoring alerts (PagerDuty/Slack)
4. Document troubleshooting steps
5. Plan for scaling (if needed)

**Monitoring:**
1. Track booking success rate (target: >99%)
2. Track sync success rate (target: >95%)
3. Track email delivery rate (target: >98%)
4. Monitor worker execution time (target: <30s)
5. Alert on 3 consecutive sync failures

---

## 📊 Risk Summary

| Category | Critical | Medium | Low | Total |
|----------|----------|--------|-----|-------|
| Bugs/Issues | 4 | 5 | 5 | 14 |
| Missing Features | 3 | 2 | 8 | 13 |
| Technical Debt | 2 | 3 | 5 | 10 |
| **TOTAL** | **9** | **10** | **18** | **37** |

**Showstoppers:** 5 scenarios requiring mitigation  
**Blocking Issues:** 9 must-fix before production  
**Estimated Additional Work:** 8-10 days (new Phase 0 + Phase 4)

---

## ✅ Next Steps

1. **Review this document with team** - Discuss acceptable risks
2. **Prioritize Phase 0 items** - Authentication + email are blocking
3. **Set up infrastructure** - Staging env, email provider, monitoring
4. **Revise timeline** - Add 8-10 days for hardening phases
5. **Get approval** - Confirm scope changes are acceptable
6. **Begin Phase 0** - Don't skip the foundation!

---

**Document Status:** Ready for Review  
**Requires Action:** Team discussion and approval before proceeding

