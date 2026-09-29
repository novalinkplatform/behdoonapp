<USER_REQUEST>
# PHASE 4B — CONTROLLED REAL-WORLD PILOT

## Behdoon / بهدون

### Mission

The Behdoon platform has completed:

* Phase 1
* Phase 2 Marketplace Core
* P0 Hardening
* Phase 3A Provider Operations
* Phase 3B Customer Operations
* Phase 3C Admin Operations & Governance
* Phase 4A Production Hardening & Pilot Preparation

Phase 4A completed with:

* 347/347 automated tests passed
* production build successful
* production security hardening
* RBAC / Anti-IDOR
* OTP rate limiting and lockout
* payment/service separation
* dynamic commission engine
* atomic refunds
* financial ledger
* scheduling concurrency protection
* backup/recovery validation
* structured observability
* end-to-end order lifecycle validation

Latest commit:

`5b9dfb0`

---

# CRITICAL STRATEGIC RULE

## DO NOT TURN PHASE 4B INTO A DEVELOPMENT PHASE.

The objective is to validate Behdoon through controlled real-world operations.

Do NOT:

* rewrite the architecture
* migrate to microservices
* add Chat
* add AI
* add public messaging
* redesign the marketplace
* add unnecessary dashboards
* add speculative features
* replace working implementations
* refactor code merely for style
* introduce technology for technology's sake

Only implement changes that are required to:

1. safely operate the pilot,
2. collect reliable operational data,
3. fix blockers discovered during the pilot,
4. preserve financial and security integrity.

---

# 0. FIRST: PRE-PILOT TECHNICAL VERIFICATION

Before any real customer order is processed, inspect the current implementation.

Do NOT assume the Phase 4A report is sufficient.

Verify the following directly in the code and database.

---

## 0.1 Commission Verification

The Phase 4A E2E report mentions a 15% commission.

Verify whether this 15% is:

* actually loaded from `commission_rules`, or
* hard-coded inside the test or application.

The production calculation MUST use the existing dynamic commission hierarchy:

1. provider rule
2. service rule
3. category rule
4. global rule

Respect the existing `labor_only` behavior.

There must be NO production hard-code such as:

```js
commission = total * 0.15
```

unless 15% is explicitly stored as the active database rule.

Create a test proving that changing the active commission rule changes the calculated settlement.

Do not alter the business commission policy merely for testing.

---

# 0.2 Backup Operationalization

Phase 4A validated:

* D1 export
* SQL dump
* JSON export
* dry-run restoration
* record/key comparison

Now verify the actual operational backup procedure.

Document:

* backup frequency
* backup location
* retention
* restore procedure
* responsible operator
* recovery limitations

If automatic external backup storage is not actually implemented, do not claim that it is.

If needed, implement only the minimum safe mechanism required for the pilot.

The backup destination must be independent from the primary database environment.

Do not expose backup files publicly.

---

# 0.3 Production Environment Check

Verify:

* production environment variables
* secrets
* SMS configuration
* payment configuration
* D1 binding
* allowed origins
* HTTPS
* security headers
* rate limiting
* logging
* error handling
* debug flags

Production must not expose:

* OTP values
* authentication tokens
* secrets
* stack traces
* internal database errors
* development bypass codes

---

# 1. PILOT SCOPE

The pilot must be intentionally small.

## Geography

Start with:

**2 defined areas of Tehran**

Do not activate the entire city initially.

The exact areas should be configurable through existing service/location structures.

Do not create unnecessary geographic infrastructure.

---

# 2. SERVICE SCOPE

Start with:

**2–3 high-volume building-service categories.**

Suggested examples:

* plumbing / تأسیسات
* electrical / برق
* boiler/package repair / پکیج

However:

Use the categories for which qualified providers are actually available.

Do not activate a category merely because it exists in the database.

---

# 3. PROVIDER PILOT

Target:

**30–50 verified providers**

Provider onboarding must include, according to the existing system capabilities:

* identity/basic profile verification
* service category
* skill/specialty
* operating area
* availability
* phone verification
* operational status
* required documentation where applicable

Do not invent regulatory requirements.

Where documentation is required operationally, record verification status.

---

# 4. PILOT WAVES

Do NOT immediately attempt 150–250 orders.

Use controlled waves.

## Wave 0 — Smoke Pilot

Target:

**5 real customer orders**

Purpose:

Validate the complete operational chain.

For every order verify:

```text
Customer
→ Request
→ Matching
→ Assignment
→ Provider Acceptance
→ En Route
→ Arrival
→ Inspection
→ Quote
→ Customer Approval
→ Invoice
→ Payment
→ Service
→ Completion
→ Rating
→ Settlement
```

After these 5 orders:

STOP.

Generate a short operational report.

Do not automatically continue if a critical failure occurred.

---

# Wave 1 — Early Pilot

Target:

**20–30 real orders**

Purpose:

Identify operational bottlenecks.

Measure:

* assignment
* provider acceptance
* arrival
* quote
* payment
* completion
* cancellation
* complaints
* support
* disputes

---

# Wave 2 — Controlled Expansion

Target:

**50–100 real orders**

Only proceed if Wave 1 shows that critical operational failures are under control.

Focus on:

* repeatability
* provider behavior
* customer behavior
* scheduling
* pricing
* cancellation
* support workload
* financial reconciliation

---

# Wave 3 — Initial Validation

Target:

**150–250 real orders**

This is NOT a declaration of product-market fit.

It is only an initial operational validation sample.

---

# 5. PILOT CONTROL

Use the existing Admin Operations infrastructure.

Do not build a second administration system.

Operations staff must be able to monitor:

* new orders
* unassigned orders
* assigned orders
* urgent orders
* delayed orders
* active orders
* disputed orders
* cancelled orders
* payment problems
* provider availability

Use existing live order monitoring and KPI endpoints wherever possible.

---

# 6. ORDER EVENT DATA

For every real order, preserve the complete event trail.

At minimum collect timestamps for:

```text
created_at
provider_assigned_at
provider_accepted_at
en_route_at
arrived_at
inspection_started_at
quote_created_at
quote_accepted_at
payment_at
service_started_at
waiting_for_parts_at
service_completed_at
settled_at
```

Do not invent timestamps if the current schema does not support them.

If a timestamp is missing, identify the gap and determine whether it is necessary for pilot analysis.

The existing `order_status_logs` must remain the authoritative operational timeline.

---

# 7. CORE PILOT KPIs

Track the following.

## Marketplace

* Fill Rate
* Provider Acceptance Rate
* Quote Acceptance Rate
* Completion Rate
* Customer Cancellation Rate
* Provider Cancellation Rate
* No-show Rate

## Operations

* Time to Assignment
* Time to Provider Acceptance
* Time to Arrival
* Time to Quote
* Time to Quote Approval
* Service Duration
* Time to Completion
* Support Resolution Time

## Financial

* GMV
* Platform Revenue
* Provider Earnings
* Refund Rate
* Payment Failure Rate
* Dispute Rate
* Contribution Margin

## Customer

* Average Rating
* Complaint Rate
* Repeat Order Rate
* Payment Failure Rate
* Resolution Time

## Provider

* Acceptance Rate
* Response Time
* Cancellation Rate
* Completion Rate
* No-show Rate
* PPS
* Repeat Assignment Rate

---

# 8. IMPORTANT: DO NOT MANIPULATE THE DATA

Pilot data must represent real operations.

Do not:

* alter timestamps to improve metrics
* delete failed orders
* hide cancellations
* exclude disputes
* manually inflate ratings
* classify failures as successes
* remove problematic providers from historical metrics

Corrections must be recorded through proper audit mechanisms.

Historical records must remain traceable.

---

# 9. FAILURE CLASSIFICATION

Every significant operational failure must receive one primary classification:

```text
PRODUCT
TECHNICAL
CUSTOMER
PROVIDER
OPERATIONS
MATCHING
SCHEDULING
PRICING
PAYMENT
QUALITY
SUPPORT
OTHER
```

Also record:

* order ID
* timestamp
* actor
* failure description
* severity
* immediate resolution
* root cause
* recurrence
* proposed corrective action

---

# 10. SEVERITY LEVELS

Use:

### P0 — Critical

Examples:

* unauthorized financial transaction
* duplicate charge
* financial loss
* security breach
* corrupted order state
* impossible settlement
* major PII exposure

P0 requires immediate investigation and pilot suspension if necessary.

### P1 — Major

Examples:

* provider assignment failure
* payment workflow failure
* widespread scheduling conflict
* repeated order completion failure
* major operational bottleneck

### P2 — Moderate

Examples:

* isolated UI issue
* notification delay
* minor reporting discrepancy

### P3 — Minor

Cosmetic or low-impact issues.

Do not stop the pilot for P3 issues unless they accumulate into an operational problem.

---

# 11. PILOT STOP CONDITIONS

The pilot must have explicit stop conditions.

Immediately pause new orders if any of the following occurs:

* financial integrity failure
* unauthorized access to customer/provider data
* duplicate payment
* incorrect refund exceeding payment
* ledger inconsistency
* repeated state corruption
* major provider/customer PII exposure
* systemic payment failure
* systemic scheduling collision
* severe unresolved operational safety issue

Do not resume until the cause is understood and the fix is tested.

---

# 12. CUSTOMER SUPPORT

During the pilot, every complaint must be traceable.

Use the existing:

* support tickets
* disputes
* order timeline
* admin audit logs

Do not create a parallel complaint system.

For disputes, preserve:

* customer statement
* provider statement
* order history
* quote
* invoice
* payment
* ledger
* relevant timeline
* internal resolution notes
* compensation/refund if applicable

---

# 13. PROVIDER OPERATIONS

Monitor providers individually.

Track:

* acceptance
* response
* arrival
* cancellation
* no-show
* completion
* customer rating
* complaints
* disputes
* earnings

Do not permanently suspend or penalize a provider based on one isolated event without reviewing context.

Use documented operational rules.

---

# 14. MATCHING VALIDATION

Do not modify the matching algorithm merely because individual assignments appear imperfect.

Collect real data first.

For each assignment record:

* selected provider
* candidate providers
* matching scores
* location score
* skill score
* availability score
* performance score
* reliability score
* workload score
* final result

After sufficient sample size, analyze whether the scoring weights correlate with successful service outcomes.

Do not change weights based on anecdotal impressions.

---

# 15. PRICING VALIDATION

During the pilot, collect:

* quoted labor
* quoted materials
* total quote
* customer acceptance/rejection
* actual material cost where available
* actual labor
* final settlement
* disputes related to price

Do not introduce AI pricing.

Do not automatically optimize prices.

First establish the baseline.

---

# 16. FINANCIAL RECONCILIATION

At the end of every pilot wave reconcile:

```text
Customer Payments
        ↓
Payment Records
        ↓
Financial Ledger
        ↓
Platform Revenue
        ↓
Provider Payable
        ↓
Refunds
        ↓
Settlements
```

The totals must reconcile.

Report discrepancies explicitly.

---

# 17. DAILY OPERATIONS REPORT

Create a lightweight daily report.

Example:

```text
BEHDOON PILOT — DAILY REPORT

Date:

Orders:
New:
Assigned:
Completed:
Cancelled:
Disputed:

Fill Rate:
Provider Acceptance:
Quote Acceptance:
Completion Rate:
No-show:

Average Assignment Time:
Average Arrival Time:
Average Quote Time:

GMV:
Platform Revenue:
Provider Payable:
Refunds:

Complaints:
Support Tickets:
Disputes:

Critical Incidents:

Top Operational Problem:

Root Cause:

Action Taken:
```

Do not create an unnecessarily complex reporting system if the existing Admin APIs already provide the data.

---

# 18. END-OF-WAVE REPORT

After each wave produce:

## A. Quantitative Results

Compare actual results against the predefined KPIs.

## B. Operational Failures

List all P0/P1/P2/P3 issues.

## C. Provider Analysis

Identify recurring provider-side patterns.

## D. Customer Analysis

Identify recurring customer-side patterns.

## E. Marketplace Liquidity

Evaluate:

* demand
* provider supply
* matching
* acceptance
* cancellations
* completion

## F. Financial Analysis

Evaluate:

* GMV
* platform revenue
* provider earnings
* refunds
* disputes
* contribution margin

## G. Technical Reliability

Evaluate:

* API errors
* payment failures
* SMS failures
* database failures
* scheduling conflicts
* authentication failures

## H. Recommendations

Separate recommendations into:

```text
MUST FIX
SHOULD FIX
MONITOR
DO NOT CHANGE YET
```

Do not recommend new features merely because they would be interesting.

---

# 19. CHANGE CONTROL DURING PILOT

If a problem requires code modification:

1. record the incident
2. identify root cause
3. implement the smallest safe fix
4. add a regression test
5. run the full relevant test suite
6. deploy
7. verify with a controlled test
8. record the deployment/version
9. resume pilot

Never silently modify production behavior.

---

# 20. NO PREMATURE SCALING

Do not expand:

* geographic coverage
* service categories
* provider count
* marketing spend

until the current wave has been analyzed.

Scaling is a consequence of evidence, not optimism.

---

# 21. FINAL PHASE 4B SUCCESS CRITERIA

Phase 4B is NOT successful merely because the application remains online.

Success requires evidence that:

1. real customers can successfully create orders
2. real providers can receive and execute orders
3. matching works under real conditions
4. scheduling works under real conditions
5. quotes are understandable and accepted/rejected normally
6. payments reconcile correctly
7. services can be completed correctly
8. providers can be settled correctly
9. complaints and disputes can be handled
10. the operational team can monitor and intervene
11. the system preserves an auditable event trail
12. recurring bottlenecks can be identified from data

Do not claim Product-Market Fit.

Do not claim business-model validation.

Do not claim scalability.

Only report what the collected pilot data supports.

---

# 22. REQUIRED FINAL REPORT

At the end of each pilot wave return a structured report containing:

1. Wave number
2. Number of real orders
3. Number of active providers
4. Geographic scope
5. Service categories
6. KPI results
7. Marketplace metrics
8. Operations metrics
9. Financial reconciliation
10. Customer metrics
11. Provider metrics
12. Incidents
13. P0/P1/P2/P3 breakdown
14. Root causes
15. Fixes implemented
16. Regression test results
17. Current blockers
18. Decision:

* CONTINUE
* PAUSE
* FIX AND REPEAT

Do not make a subjective overall rating.

---

# FINAL RULE

The purpose of Phase 4B is not to make Behdoon look finished.

The purpose is to discover how Behdoon behaves when real humans, real providers, real schedules, real money, real complaints, and real-world chaos finally touch the system.

Collect evidence first.

Change the system second.

Do not build speculative features.

</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-20T11:15:07Z.
</ADDITIONAL_METADATA>