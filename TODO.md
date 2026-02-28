# Resolution 800 Knowledge Base Update

## Tasks

- [ ] 1. Add 11 Resolution 800 knowledge entries to `src/lib/iata-data.ts`
  - [ ] 1.1 Resolution 800 - Overview, Purpose & Applicability
  - [ ] 1.2 Resolution 800 - Accreditation Criteria & Financial Standing (Section 2)
  - [ ] 1.3 Resolution 800 - Financial Assessments for High-Risk Agents >USD 5M (Section 2.7)
  - [ ] 1.4 Resolution 800 - Agency Investigation Panel (Section 3)
  - [ ] 1.5 Resolution 800 - Accreditation Procedures & Agency List (Section 4)
  - [ ] 1.6 Resolution 800 - Agent Appointments & Traffic Documents (Section 5)
  - [ ] 1.7 Resolution 800 - Security Standards for Premises & Systems (Section 6)
  - [ ] 1.8 Resolution 800 - Change of Ownership, Name & Location (Section 11)
  - [ ] 1.9 Resolution 800 - Agent Standing, Removal & Reinstatement (Section 14)
  - [ ] 1.10 Resolution 800 - Attachment C: Financial Assessment Framework Criteria
  - [ ] 1.11 Resolution 800 - Agency Fees (Attachment B)

- [ ] 2. Update `src/lib/seed.ts` to support incremental seeding
  - [ ] 2.1 Match existing entries by title to avoid duplicates
  - [ ] 2.2 Add only missing built-in entries on each seed call

- [ ] 3. Verify `src/app/api/knowledge/route.ts` — no changes needed
