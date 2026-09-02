# Business Plan — Teen Networking App (working name, not yet finalized)

**Founders:** Jack, Reid (co-founders)
**Status:** Pre-MVP, pre-legal-review. No code, no entity, no signed customers yet.
**Last updated:** 2026-08-27

> Naming note: no app/company name has been chosen yet. This document and
> the project folder use "the app" / "teen-network" as placeholders.

---

## 1. Executive Summary

A LinkedIn-style professional networking and resume-building platform for
teenagers (13+), sold as a subscription to school districts rather than to
students or families directly. Students build a profile, log experience
(jobs, volunteering, projects, extracurriculars) over time, and can get that
experience endorsed by mentors and by the businesses they worked with.
Profiles start private and go public only after a school-managed consent
process. When a student reaches LinkedIn's own minimum age (16), the app
provides an export of their built-up history so they can carry it into a
real LinkedIn profile.

Revenue model: **$8 per student per year**, billed to the school district,
not the family. This is a **B2B2C model** — the school is the customer, the
student is the user, and the model's whole appeal to a district rests on
"included in what the school already provides," not something families have
to opt into and pay for individually.

This plan is being written before any code, entity formation, or legal
sign-off — see [[Section 8: Legal & Compliance]] for why that ordering
matters here more than in a typical consumer app.

---

## 2. Problem

Teenagers who want to start building a professional track record early have
no real place to do it:

- A Google Doc resume isn't discoverable, isn't structured, and doesn't grow
  with them.
- LinkedIn's own minimum age is 16, and even then a blank professional
  profile with no history isn't compelling — most teens don't touch it until
  college or their first real job search, by which point years of early
  experience (volunteering, small jobs, clubs, projects) is undocumented or
  forgotten.
- Schools track grades and transcripts, not the "soft" experience record —
  extracurriculars, part-time work, volunteering — that actually matters for
  scholarships, college applications, and early job hunts, and there's no
  standard, structured place for a student to log it as it happens.

This is closer to "a same-thing-as-LinkedIn, but built for an audience
LinkedIn structurally excludes" than a novel mechanic — the differentiation
is who it's for and how it's distributed, not a new feature LinkedIn lacks.

---

## 3. Solution

A profile + logging platform where:

- Students create a profile and log experience over time (jobs, volunteer
  work, school activities, projects) — the core loop is periodic logging,
  not a one-time resume write-up.
- Profiles are **private by default**; they become visible to
  mentors/companies/other students only after a school-managed consent
  process authorizes it (see Section 8).
- Businesses and mentors can **endorse or verify** specific logged
  experiences, so entries carry more weight than a self-written resume.
- At age 16 (LinkedIn's minimum age), the app provides a **data export**
  (formatted resume/PDF, not an automated account-creation tool — LinkedIn's
  terms don't support the latter) so the student can carry their history
  into a real LinkedIn profile.

---

## 4. Target Market

**Primary customer (who pays): school districts.**
Districts already budget per-student for platforms and tools (much like
Naviance, Clever, ClassDojo, and other ed-tech that bills the district, not
the family). The pitch to a district is closer to "add this to what you
already provide" than "ask parents to sign up for one more app."

**Primary user (who uses it): students, ages 13-18**, with the most natural
fit for 13-16 (before they age into LinkedIn eligibility). Usage likely
peaks in the 2-3 years before a student would otherwise consider LinkedIn.

**Secondary users: mentors and company/employer accounts** who endorse
experience and (eventually) post age-appropriate opportunities. These
accounts don't pay — their participation is what makes the network valuable
to students, which is why recruiting them is a distinct go-to-market problem
from selling to districts (see Section 6).

---

## 5. Business Model & Pricing

- **Pricing: $8 per student per year**, billed to the school district as a
  seat-based subscription (subject to change as real conversations with
  districts happen — this is a starting hypothesis, not a validated price).
- **Students and families pay nothing directly.** This matters for both the
  pitch (easier "yes" from a district than asking every family to pay) and
  for the consent story (see Section 8) — no one has to make a purchase
  decision at signup, which removes one common friction/dark-pattern
  concern regulators watch for.
- **Illustrative revenue math** (not a projection — just scale intuition):
  - 1 district, 5,000 students → $40,000/year
  - 10 districts averaging 5,000 students → $400,000/year
  - 50 districts averaging 5,000 students → $2,000,000/year
  - These numbers assume 100% of a district's enrolled students are
    licensed, which real contracts may not reach (grade-band-only rollout,
    partial-year adoption, etc.) — treat as an upper bound per district, not
    an expected value.
- **Possible future revenue lines** (not part of the initial pitch, listed
  for completeness): premium features for students/families (e.g., extra
  export formats), paid company/employer tiers once the network has real
  volume, sponsorship (see Koch, Section 6).

---

## 6. Go-to-Market Strategy

The business has **two separate cold-start problems** that need different
tactics: getting schools/students on the platform, and getting
mentors/companies on the platform. A school with zero mentors, or a company
side with zero students, is equally useless — both sides need to ramp
together.

### 6a. Schools (the paying side)
- Sell to the **school as a unit**, not students individually — one
  district decision-maker (counselor, career-center director, or district
  admin) signing on brings hundreds or thousands of students at once, which
  solves the "empty network" problem directly instead of a slow
  student-by-student trickle.
- Target districts/schools that already have career-readiness or
  work-based-learning programs — they already have a budget line and a
  reason to say yes, and staff whose job is exactly this.
- Expect a slower sales cycle than a consumer app (budget approval, pilot
  semester, admin buy-in) — plan for a pilot-school approach before
  district-wide rollout.

### 6b. Mentors & companies (the network-value side)
- **Don't cold-recruit companies one at a time first.** Piggyback on
  existing structures that already connect adults with students:
  - School alumni associations / alumni mentor programs
  - Local Chamber of Commerce or Rotary "mentor a student" programs
  - Junior Achievement, SCORE, and similar existing youth-mentorship
    organizations
  - A company's own existing employee-volunteer / community-relations
    program (large companies often already run one — plugging into it is
    much faster than building mentor recruitment from scratch)
- **Anchor sponsor:** Koch has been identified as a likely early
  sponsor/partner. If secured, use that relationship for:
  1. Mentor volunteers sourced from Koch's own workforce/volunteer program
  2. An introduction to Koch's community-relations or HR contacts
  3. Credibility when approaching a second and third company
     ("Koch is already on board" is a much easier pitch than starting cold)
  - Risk to manage: don't let mentor/company participation stay
    single-industry for too long — diversify company partners deliberately
    once Koch is onboard.
- **Local-first for businesses:** recruit local employers who already hire
  teens (retail, food service, camps, seasonal work) before targeting
  name-brand companies — they have a direct labor-supply incentive to
  participate and are an easier "yes" than large companies with no existing
  connection to the platform.
- **Give businesses a concrete reason to show up**, not just access to a
  future audience:
  - **Verification/endorsement**: confirming a student's logged experience
    is free, low-effort marketing for the business ("we're an employer
    students list on their resume").
  - **Pipeline access**: once volume exists, businesses get a cheaper way to
    post part-time/seasonal openings and screen based on verified logged
    experience instead of a blind resume.

---

## 7. Product & Systems Roadmap

### MVP (thin slice, not full LinkedIn parity)
- Student profile creation + experience logging
- School-managed consent/verification flow (built around Section 8's
  requirements from day one, not bolted on later)
- Private-by-default visibility; public only after consent is recorded
- Basic mentor/company account type, manual endorsement of a logged entry

### Later (not MVP)
- Matching/recommendation: suggest mentors or opportunities based on a
  student's logged interests/skills
- Company opportunity postings (part-time/seasonal jobs, volunteering)
- LinkedIn export/handoff flow (formatted resume/PDF at age 16)
- Verified-account badges for companies/mentors (impersonation risk is
  higher when minors are involved)
- In-app messaging between students and mentors/companies (this raises the
  compliance/safety bar significantly — see Section 8 and the trust & safety
  agent below; do not ship before a moderation system exists)

### Supporting agents/systems (per the working list, evaluated 2026-08-27)
**Priority additions beyond the original list, in rough priority order:**
1. **Trust & safety / moderation** — monitors for inappropriate contact,
   bullying, or content issues. Given minors have public-ish profiles and
   connections to adults, this is more load-bearing than marketing or
   testing and should not be the last thing built.
2. **Consent/compliance tracking** — tracks which students have valid
   consent on file, flags any profile that went public without it, handles
   withdrawal requests. Turns the legal requirement into an operational
   system rather than a one-time checkbox.
3. **Analytics/reporting** — tracks growth, engagement, and which
   mentors/companies are actually active vs. dormant, to guide where to
   focus effort.

**Original list, evaluated:**
- **Email agent** (upkeep) — triage/summarize company email for Jack/Reid.
  Useful as-is.
- **Marketing agent** — reframe as a **lead-gen/drafting assistant**, not a
  fully autonomous outreach sender. Automated cold outreach to school
  administrators risks looking like spam and damaging trust before any
  relationship exists; district sales needs a human closing the loop.
- **Mass testing agent** — really infrastructure (load/stress testing tools
  like k6/Locust/JMeter), not an autonomous-judgment agent. Keep on the
  roadmap, scope it as tooling rather than an "agent."
- **Customer service agent** (in-app) — reasonable, but anything it collects
  from a minor is still subject to the same COPPA data rules as the rest of
  the app, and it needs a clear escalation path to a human for safety
  reports or consent issues rather than resolving everything in-bot.

**Other additions to consider:**
- Matching/recommendation system (see roadmap above)
- Endorsement verification workflow (employer confirms/denies a logged
  entry)
- Guided consent/onboarding walkthrough for parents (not necessarily an
  "agent" — a UX flow, but the single riskiest moment in the product)
- LinkedIn export/handoff flow
- Verified-account badges for companies/mentors
- Staff moderation queue (human review inbox for anything the trust &
  safety system flags)

---

## 8. Legal & Compliance

**This is the section that gates everything else.** Full research:
`Projects/teen-network` links back to
`The-Brain/Jack/ETC/teen-networking-app-legal-research.md` (cross-vault
plain-path link, not a wikilink, per the repo's linking convention). None of
the below is legal advice — it's a summary of research done to prepare for
an actual attorney conversation, which has not yet happened.

Key points carried into this plan:

- **COPPA** (federal): even with a 13+ floor, the FTC's amended rule (fully
  in effect as of 2026-04-22) requires that no personal data — not even a
  name or email — be collected before a valid consent step completes. A
  checkbox is explicitly not valid consent.
- **School-consent pathway is real but narrow**: schools can consent on
  behalf of parents (as ClassDojo and similar do), but only for a use that
  qualifies as **"educational purpose," not commercial**. Whether a
  public-facing resume/networking profile qualifies as "educational" rather
  than "commercial/social" is genuinely unsettled and is the single biggest
  open legal question for this business model — it determines whether the
  school-subscription approach actually simplifies consent or just moves
  the same requirement to a district administrator's desk.
- **Consent cannot be buried in registration paperwork** — regulators
  specifically watch for schools/vendors claiming broad consent from
  bundled enrollment forms; parents need genuine, separate, understandable
  notice, and schools can't bind parents to a vendor's commercial terms of
  service this way.
- **Liability stays with the company**, not the school, regardless of
  district sign-off.
- **State-level minor social media laws** are an active, litigated patchwork
  (Utah, Texas, California, others) — several are currently enjoined on
  First Amendment grounds, meaning the applicable rules could shift by the
  time of launch and vary by state.
- **The LinkedIn export feature** must be a user-driven data export (PDF/
  formatted resume), not an automated scrape-and-fill tool — LinkedIn's ToS
  bans third-party scraping and there's no supported API for populating
  another platform's profile on a user's behalf.

**Before an MVP is built:** consult a privacy/ed-tech attorney, specifically
on whether the school-consent exception covers this product's actual use
case (Question 7 in the legal research note), and on which states to treat
as safe to launch in first given the current state of litigation.

---

## 9. Team

- **Jack** — co-founder
- **Reid** — co-founder
- Roles/equity split: not yet decided
- Entity structure (LLC, etc.): not yet formed — Section 8 recommends
  resolving this before collecting any real user data, given the elevated
  liability profile of handling minors' data

---

## 10. Risks

1. **Legal/compliance risk (highest)** — see Section 8. The consent
   mechanism has to be right from the first signup screen; if the
   school-consent exception doesn't cover this use case, the whole
   B2B2C-via-schools pricing model needs rethinking.
2. **Two-sided cold start** — schools without mentors/companies, or
   mentors/companies without students, are both dead ends. Section 6's
   sequencing (anchor sponsor + school pilot in parallel) exists to manage
   this, not eliminate it.
3. **Sales cycle length** — school district procurement is slow; cash flow
   planning should assume a multi-month sales cycle per district, not a
   self-serve signup.
4. **Single-sponsor concentration** — leaning on one company (Koch) too long
   for mentors/credibility risks an unbalanced, single-industry network.
5. **Overpromising the LinkedIn "transfer"** — must stay framed as a data
   export the user carries over themselves, not a seamless account
   migration, both for legal reasons (LinkedIn's ToS) and honesty in the
   pitch.

---

## 11. Milestones / Next Steps

1. Consult a privacy/ed-tech attorney with the legal research note in hand
   (highest priority — gates MVP scoping).
2. Resolve entity structure (LLC formation, ToS, privacy policy).
3. Confirm the Koch relationship's actual shape (funding? mentor volunteers?
   an intro to other companies? some combination?).
4. Identify and approach 1-2 pilot districts/schools for an initial rollout,
   in parallel with confirming the legal consent mechanism.
5. Scope and build the MVP per Section 7, with the consent/verification flow
   as the first thing built, not the last.
6. Begin mentor/company recruitment via existing structures (chambers,
   alumni networks, Koch's volunteer program) timed to land around pilot
   launch, not before there are students to connect them to.

---

## Links
- `The-Brain/Jack/ETC/teen-networking-app-legal-research.md` — full legal
  research this plan's Section 8 summarizes
- `The-Brain/Jack/ETC/business-pain-research.md` — the discipline this idea
  skipped (see that note's own links section)
