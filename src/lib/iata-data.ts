export interface IATAKnowledgeEntry {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export const IATA_KNOWLEDGE_BASE: IATAKnowledgeEntry[] = [
  // === BAGGAGE RULES ===
  {
    title: "IATA Baggage Rules - Checked Baggage Allowance",
    content: `IATA Resolution 302 governs checked baggage allowances. Key points:

1. **Weight Concept**: Used primarily on routes to/from Africa, Middle East, and parts of Asia. Economy class typically allows 20-23 kg, Business class 30-32 kg, First class 40 kg.

2. **Piece Concept**: Used primarily on transatlantic routes and within the Americas. Economy typically allows 1-2 pieces up to 23 kg each, Business/First allows 2-3 pieces up to 32 kg each.

3. **Maximum Dimensions**: Standard maximum linear dimensions (L+W+H) for checked bags is 158 cm (62 inches). Oversize bags may incur additional fees.

4. **Excess Baggage**: Airlines charge excess baggage fees for bags exceeding weight or piece limits. Fees vary by airline and route, typically ranging from $50-$200 per extra piece or per kg over the limit.

5. **Special Items**: Sports equipment, musical instruments, and other special items may have specific rules and fees. IATA recommends airlines publish clear policies for these items.`,
    category: "baggage",
    tags: "baggage,checked,allowance,weight,piece,excess,dimensions",
  },
  {
    title: "IATA Baggage Rules - Carry-on/Hand Baggage",
    content: `IATA Resolution 302 and airline-specific policies govern carry-on baggage:

1. **Standard Dimensions**: IATA recommends maximum carry-on dimensions of 55 x 35 x 20 cm (21.5 x 13.5 x 7.5 inches) including handles and wheels. Total linear dimensions should not exceed 115 cm.

2. **Weight Limits**: Typically 7-10 kg depending on the airline. Some airlines allow up to 12 kg in premium cabins.

3. **Number of Items**: Most airlines allow one carry-on bag plus one personal item (purse, laptop bag, small backpack).

4. **Liquids Rule**: Liquids, aerosols, and gels must be in containers of 100 ml or less, placed in a single transparent resealable plastic bag of maximum 1 liter capacity (the 3-1-1 rule).

5. **Prohibited Items**: Sharp objects, flammable materials, and other dangerous goods are prohibited in carry-on baggage per IATA Dangerous Goods Regulations.`,
    category: "baggage",
    tags: "baggage,carry-on,hand,cabin,liquids,dimensions,weight",
  },
  {
    title: "IATA Baggage - Delayed, Damaged, and Lost Baggage",
    content: `IATA and the Montreal Convention govern liability for baggage issues:

1. **Montreal Convention Liability**: Airlines are liable for up to 1,288 Special Drawing Rights (SDR) (approximately $1,700 USD) per passenger for delayed, damaged, or lost checked baggage.

2. **Reporting Deadlines**: Damage must be reported within 7 days of receipt. Delay must be reported within 21 days of receiving the bag. Loss can be claimed after 21 days of delay.

3. **Property Irregularity Report (PIR)**: Passengers must file a PIR at the airport baggage service office immediately upon discovering the issue.

4. **WorldTracer System**: IATA's WorldTracer is the global baggage tracing system used by over 500 airlines and 2,800 airports to track and reunite mishandled baggage with passengers.

5. **Compensation**: Airlines must provide reasonable interim expenses for delayed baggage (toiletries, essential clothing). Compensation for lost baggage is based on depreciated value of contents.`,
    category: "baggage",
    tags: "baggage,lost,delayed,damaged,compensation,montreal,worldtracer",
  },

  // === TICKETING ===
  {
    title: "IATA Ticketing - Electronic Ticketing (ET)",
    content: `IATA Resolution 722f and related resolutions govern electronic ticketing:

1. **E-Ticket Standard**: Since June 2008, IATA mandated 100% electronic ticketing. Paper tickets are no longer standard practice.

2. **E-Ticket Record**: Contains passenger name, itinerary, fare details, form of payment, ticket number (13-digit), and status codes.

3. **Ticket Number Format**: 13 digits - first 3 digits identify the issuing airline (e.g., 016 = United, 074 = KLM, 220 = Lufthansa).

4. **Coupon Status Codes**: O (Open), A (Airport Control), C (Checked-in), F (Flown), E (Exchanged), R (Refunded), V (Void), S (Suspended), L (Lifted).

5. **Interline E-Ticketing**: IATA's Interline E-Ticketing (IET) allows airlines to issue and manage tickets on other airlines' flights through bilateral agreements.

6. **NDC (New Distribution Capability)**: IATA's NDC standard enables airlines to distribute rich content and offers through indirect channels using XML/JSON-based messaging.`,
    category: "ticketing",
    tags: "ticketing,electronic,e-ticket,NDC,coupon,interline",
  },
  {
    title: "IATA Fare Rules and Pricing",
    content: `IATA fare construction and pricing rules:

1. **Fare Basis Codes**: Alphanumeric codes identifying fare type and conditions. First letter typically indicates class (Y=Economy full fare, B/M/H=Economy discount, C/J=Business, F/A=First).

2. **Fare Construction**: Uses the IATA Mileage System or Routing System to calculate fares for multi-sector journeys. The Mileage Principle allows up to 20% excess mileage (EMA) before surcharges apply.

3. **Currency Rules (NUC)**: Fares are filed in Neutral Units of Construction (NUC) and converted to local currency using IATA Rate of Exchange (IROE) published monthly.

4. **Fare Types**:
   - Published Fares: Filed with ATPCO and available to all agents
   - Private Fares: Negotiated between airlines and specific agents/corporations
   - Net Fares: Confidential fares between airlines and agents

5. **Minimum/Maximum Stay**: Many discounted fares require minimum stay (e.g., Saturday night rule) and have maximum stay limits.

6. **Advance Purchase**: APEX fares require booking 7, 14, 21, or more days before departure.`,
    category: "ticketing",
    tags: "fare,pricing,NUC,fare-basis,APEX,advance-purchase,mileage",
  },
  {
    title: "IATA Ticket Refunds and Changes",
    content: `IATA Resolution 735d and airline tariff rules govern refunds and changes:

1. **Voluntary Changes**: Subject to airline fare rules. May incur change fees ($50-$500+) plus any fare difference. Some flexible fares allow free changes.

2. **Voluntary Refunds**: Governed by fare conditions. Non-refundable tickets may only receive credit or refund of taxes. Refundable tickets processed per Resolution 735d.

3. **Involuntary Changes/Refunds**: When caused by airline (cancellation, significant schedule change, denied boarding), passengers are entitled to:
   - Full refund to original form of payment
   - Re-routing on next available flight
   - Re-routing at a later date

4. **Refund Processing Time**: IATA recommends refunds within 7 days for credit card payments and 20 days for cash/check payments.

5. **No-Show Policy**: Passengers who fail to show for a flight may forfeit the ticket value. Some airlines allow rebooking with a no-show fee.

6. **EU261 Regulation**: For flights departing from EU airports or on EU carriers arriving in EU, additional compensation of 250-600 EUR may apply for cancellations and long delays.`,
    category: "ticketing",
    tags: "refund,changes,voluntary,involuntary,EU261,no-show,cancellation",
  },

  // === DANGEROUS GOODS ===
  {
    title: "IATA Dangerous Goods Regulations (DGR)",
    content: `The IATA Dangerous Goods Regulations (DGR) is the global reference for shipping dangerous goods by air:

1. **9 Classes of Dangerous Goods**:
   - Class 1: Explosives
   - Class 2: Gases (flammable, non-flammable, toxic)
   - Class 3: Flammable Liquids
   - Class 4: Flammable Solids
   - Class 5: Oxidizers and Organic Peroxides
   - Class 6: Toxic and Infectious Substances
   - Class 7: Radioactive Materials
   - Class 8: Corrosives
   - Class 9: Miscellaneous Dangerous Goods

2. **Shipper's Declaration**: Required for most dangerous goods shipments. Must include proper shipping name, UN number, class, packing group, and quantity.

3. **Packaging Requirements**: Must meet UN performance standards. Packaging instructions (PI) are specific to each substance.

4. **Quantity Limitations**: Cargo Aircraft Only (CAO) items cannot be transported on passenger aircraft. Passenger aircraft have strict quantity limits per package and per aircraft.

5. **Training Requirements**: All personnel involved in dangerous goods transport must receive initial and recurrent training (every 24 months).`,
    category: "dangerous-goods",
    tags: "dangerous-goods,DGR,hazmat,classes,packaging,shipping,training",
  },
  {
    title: "Lithium Battery Regulations for Air Transport",
    content: `IATA DGR Section II and ICAO Technical Instructions govern lithium battery transport:

1. **Types**: Lithium Ion (rechargeable, UN3480/UN3481) and Lithium Metal (non-rechargeable, UN3090/UN3091).

2. **Passenger Carry-on Rules**:
   - Spare batteries must be in carry-on baggage only (not checked)
   - Maximum 100 Wh per battery without airline approval
   - 100-160 Wh batteries require airline approval (max 2 spare batteries)
   - Batteries over 160 Wh are prohibited for passengers

3. **Cargo Shipping**: Lithium batteries shipped as cargo must comply with:
   - Packing Instructions PI965-PI970
   - State of Charge (SoC) limit of 30% for standalone lithium ion cells/batteries
   - Proper packaging, marking, and labeling

4. **Damaged/Recalled Batteries**: Damaged, defective, or recalled lithium batteries are forbidden for air transport.

5. **Power Banks**: Treated as spare lithium ion batteries. Must be carried in cabin baggage.`,
    category: "dangerous-goods",
    tags: "lithium,battery,dangerous-goods,power-bank,carry-on,cargo",
  },

  // === PASSENGER RIGHTS ===
  {
    title: "Passenger Rights - Denied Boarding and Overbooking",
    content: `IATA and various regulations address denied boarding:

1. **IATA Recommended Practice 1724**: Airlines should seek volunteers before involuntarily denying boarding. Compensation should be offered to volunteers.

2. **US DOT Rules (14 CFR 250)**: For US flights:
   - Voluntary: Airlines negotiate compensation with volunteers
   - Involuntary: 200% of one-way fare (min $775) for 1-2 hour delay, 400% (min $1,550) for longer delays
   - Maximum compensation: $1,550

3. **EU Regulation 261/2004**: For EU flights:
   - 250 EUR for flights up to 1,500 km
   - 400 EUR for intra-EU flights over 1,500 km and other flights 1,500-3,500 km
   - 600 EUR for flights over 3,500 km
   - Plus right to refund or re-routing, meals, and accommodation

4. **Priority Rules**: When involuntary denied boarding occurs, airlines should consider factors like check-in time, fare class, frequent flyer status, and connection requirements.

5. **Written Notice**: Airlines must provide written notice explaining passenger rights when denying boarding.`,
    category: "passenger-rights",
    tags: "denied-boarding,overbooking,compensation,EU261,DOT,passenger-rights",
  },
  {
    title: "Passenger Rights - Flight Delays and Cancellations",
    content: `Passenger entitlements during delays and cancellations:

1. **EU261 - Delays**:
   - 2+ hours (short-haul): Meals and refreshments
   - 3+ hours (medium-haul): Meals, refreshments, communication
   - 4+ hours (long-haul): Meals, refreshments, communication
   - 5+ hours: Right to refund
   - Overnight: Hotel accommodation and transport
   - 3+ hour arrival delay: Compensation (250-600 EUR) unless extraordinary circumstances

2. **EU261 - Cancellations**:
   - Right to refund or re-routing
   - Compensation unless: 14+ days notice, or 7-14 days with acceptable re-routing, or extraordinary circumstances
   - Care (meals, accommodation) while waiting

3. **Montreal Convention**: Airlines liable for damages caused by delay up to 5,346 SDR (approximately $7,100) unless they prove all reasonable measures were taken.

4. **US Rules**: No federal compensation requirement for delays. Airlines must provide refunds for cancelled flights. Tarmac delay rules: max 3 hours (domestic) or 4 hours (international) before passengers must be allowed to deplane.

5. **Extraordinary Circumstances**: Weather, air traffic control, security threats, political instability, and hidden manufacturing defects may exempt airlines from compensation.`,
    category: "passenger-rights",
    tags: "delay,cancellation,compensation,EU261,montreal,tarmac,passenger-rights",
  },

  // === AIRPORT & AIRLINE CODES ===
  {
    title: "IATA Airport and Airline Codes",
    content: `IATA maintains standardized codes for airports and airlines:

1. **Airport Codes (3-letter)**: IATA assigns unique 3-letter codes to airports worldwide. Examples:
   - JFK: John F. Kennedy International, New York
   - LHR: London Heathrow
   - DXB: Dubai International
   - NRT: Narita International, Tokyo
   - SIN: Singapore Changi
   - CDG: Charles de Gaulle, Paris
   - FRA: Frankfurt Airport
   - HKG: Hong Kong International
   - SYD: Sydney Kingsford Smith
   - LAX: Los Angeles International

2. **Airline Codes (2-letter)**: IATA assigns unique 2-letter designator codes. Examples:
   - AA: American Airlines
   - BA: British Airways
   - EK: Emirates
   - LH: Lufthansa
   - SQ: Singapore Airlines
   - QF: Qantas
   - UA: United Airlines
   - DL: Delta Air Lines
   - AF: Air France
   - CX: Cathay Pacific

3. **Airline Numeric Codes (3-digit)**: Used in ticket numbers. Examples: 001 (American), 125 (British Airways), 176 (Emirates).

4. **City Codes**: Some cities have codes different from their airports (e.g., NYC for New York City, LON for London, TYO for Tokyo).`,
    category: "codes",
    tags: "airport,airline,codes,IATA,designator,3-letter,2-letter",
  },

  // === SAFETY & SECURITY ===
  {
    title: "IATA Operational Safety Audit (IOSA)",
    content: `IOSA is IATA's globally recognized safety audit program:

1. **Purpose**: Evaluates airline operational management and control systems. Covers 8 operational areas.

2. **Audit Areas**:
   - Corporate Organization and Management System
   - Flight Operations
   - Operational Control / Flight Dispatch
   - Aircraft Engineering and Maintenance
   - Cabin Operations
   - Ground Handling
   - Cargo Operations
   - Security Management

3. **Requirements**: All IATA member airlines must be IOSA registered. Audit validity is 2 years.

4. **IOSA Standards Manual (ISM)**: Contains over 900 standards and recommended practices.

5. **Benefits**: IOSA-registered airlines have a significantly lower accident rate. Many aviation authorities and insurance companies recognize IOSA.

6. **Enhanced IOSA (E-IOSA)**: Introduced continuous monitoring between audits using data-driven risk assessment.`,
    category: "safety",
    tags: "IOSA,safety,audit,operational,standards,security",
  },

  // === TRAVEL DOCUMENTS ===
  {
    title: "IATA Travel Documents - Timatic and Travel Requirements",
    content: `IATA provides travel document verification services:

1. **Timatic**: IATA's travel information database used by airlines and travel agents to verify passport, visa, and health requirements for international travel.

2. **Passport Requirements**: Must typically be valid for 6 months beyond the travel date. Some countries require machine-readable passports (MRP) or biometric passports.

3. **Visa Requirements**: Vary by nationality and destination. Types include tourist, business, transit, and electronic visas (eVisa).

4. **IATA Travel Pass**: Digital health verification app for COVID-19 and other health credentials. Allows passengers to:
   - Store verified test/vaccination certificates
   - Share health credentials with airlines
   - Check travel requirements

5. **APIS (Advance Passenger Information System)**: Airlines must collect and transmit passenger data (name, date of birth, nationality, travel document details) to destination country authorities before departure.

6. **One ID**: IATA's initiative for a seamless, contactless travel experience using biometric identification throughout the airport journey.`,
    category: "travel-documents",
    tags: "timatic,passport,visa,travel-pass,APIS,one-id,biometric",
  },

  // === GROUND HANDLING ===
  {
    title: "IATA Ground Handling - SGHA and ISAGO",
    content: `IATA standards for ground handling operations:

1. **Standard Ground Handling Agreement (SGHA)**: The standard contract between airlines and ground handlers. Covers:
   - Representation and accommodation
   - Load control and communications
   - Unit Load Device (ULD) management
   - Passenger and baggage handling
   - Cargo and mail handling
   - Ramp handling
   - Aircraft servicing
   - Fuel and oil handling
   - Aircraft maintenance
   - Flight operations and crew administration
   - Surface transport
   - Catering services

2. **ISAGO (IATA Safety Audit for Ground Operations)**: Safety audit program for ground service providers. Covers:
   - Organization and Management
   - Loading/Unloading
   - Aircraft Handling and Servicing
   - Passenger and Baggage Handling
   - Cargo/Mail Handling

3. **Turnaround Time**: Standard turnaround times vary by aircraft type:
   - Narrow-body: 30-45 minutes
   - Wide-body: 60-90 minutes
   - Regional: 20-30 minutes`,
    category: "ground-handling",
    tags: "ground-handling,SGHA,ISAGO,turnaround,ramp,ULD,loading",
  },

  // === CARGO ===
  {
    title: "IATA Cargo - e-Freight and Air Waybill",
    content: `IATA cargo standards and e-Freight initiative:

1. **Air Waybill (AWB)**: The contract of carriage for air cargo. Contains:
   - Shipper and consignee details
   - Origin and destination airports
   - Description of goods
   - Weight and dimensions
   - Declared value
   - Handling instructions

2. **e-AWB**: Electronic version replacing paper AWB. IATA targets 100% e-AWB adoption. Benefits include faster processing, reduced errors, and cost savings.

3. **e-Freight**: IATA's initiative to eliminate paper from air cargo. Covers 20 key documents including AWB, commercial invoice, packing list, and customs declarations.

4. **ULD (Unit Load Device)**: Standardized containers and pallets for air cargo:
   - LD3 (AKE): Most common lower deck container
   - LD7 (AAA): Full-width lower deck pallet
   - M1 (PMC): Main deck pallet

5. **Cargo Rates**: Based on weight or volume (whichever is greater). Volume weight calculated as: L x W x H (cm) / 6000 = volume weight (kg).

6. **Special Cargo**: Perishables (PER), Live Animals (AVI), Valuable Cargo (VAL), Human Remains (HUM) each have specific handling requirements.`,
    category: "cargo",
    tags: "cargo,AWB,e-freight,ULD,rates,special-cargo,air-waybill",
  },

  // === AIRLINE OPERATIONS ===
  {
    title: "Airline Codeshare and Interline Agreements",
    content: `Types of airline cooperation agreements:

1. **Codeshare Agreement**: One airline markets and sells seats on another airline's flight under its own flight number. Types:
   - Free-sale: Marketing carrier can sell seats freely
   - Block-space: Marketing carrier purchases a block of seats
   - Soft block: Seats can be returned before a deadline

2. **Interline Agreement**: Airlines accept each other's tickets for transportation. Governed by IATA Multilateral Interline Traffic Agreements (MITA).

3. **Alliance Membership**: Three major global alliances:
   - Star Alliance: 26 members (United, Lufthansa, ANA, Singapore Airlines, etc.)
   - SkyTeam: 19 members (Delta, Air France-KLM, Korean Air, etc.)
   - oneworld: 13 members (American, British Airways, Qantas, Cathay Pacific, etc.)

4. **Joint Ventures**: Deeper cooperation where airlines share revenue and coordinate schedules on specific routes. Requires antitrust immunity.

5. **Prorate Agreements**: Define how revenue is split between airlines when a passenger uses multiple carriers on a single ticket.

6. **Special Prorate Agreements (SPA)**: Bilateral agreements for specific routes with negotiated prorate rates.`,
    category: "airline-operations",
    tags: "codeshare,interline,alliance,joint-venture,prorate,MITA",
  },

  // === ENVIRONMENT ===
  {
    title: "IATA Environmental Regulations - CORSIA and SAF",
    content: `IATA's environmental sustainability initiatives:

1. **CORSIA (Carbon Offsetting and Reduction Scheme for International Aviation)**:
   - ICAO's global market-based measure to address CO2 emissions from international aviation
   - Pilot phase (2024-2026): Voluntary participation
   - First phase (2027-2035): Mandatory for states with significant aviation activity
   - Airlines must monitor, report, and offset emissions above 2019 baseline levels

2. **Sustainable Aviation Fuel (SAF)**:
   - IATA target: 65% of emission reduction through SAF by 2050
   - Current SAF production: Less than 0.1% of total jet fuel
   - Approved pathways: HEFA, Fischer-Tropsch, ATJ, SIP, co-processing
   - Can reduce lifecycle emissions by up to 80%

3. **Net Zero by 2050**: IATA's commitment to achieve net-zero carbon emissions by 2050.

4. **IEnvA (IATA Environmental Assessment)**: Program to independently assess and improve airline environmental management.

5. **Single-Use Plastics**: IATA supports reducing single-use plastics in cabin operations. Airlines are implementing alternatives.`,
    category: "environment",
    tags: "CORSIA,SAF,environment,carbon,emissions,net-zero,sustainability",
  },

  // === PASSENGER SERVICES ===
  {
    title: "IATA Passenger Accessibility and Special Assistance",
    content: `IATA guidelines for passengers requiring special assistance:

1. **SSR Codes (Special Service Requests)**:
   - WCHR: Wheelchair required for ramp (can ascend/descend stairs)
   - WCHS: Wheelchair required for steps (cannot ascend/descend stairs)
   - WCHC: Wheelchair required to/from cabin seat (completely immobile)
   - BLND: Blind passenger
   - DEAF: Deaf passenger
   - DPNA: Disabled passenger with intellectual/developmental disability
   - MAAS: Meet and assist

2. **Advance Notice**: Airlines may require 48-72 hours advance notice for special assistance. Cannot refuse boarding solely based on disability.

3. **Mobility Aids**: Airlines must transport wheelchairs and mobility aids free of charge. Priority loading/unloading required.

4. **Service Animals**: Policies vary by airline and jurisdiction. Emotional support animals are increasingly restricted; trained service dogs are generally accepted.

5. **Unaccompanied Minors (UM)**: Children traveling alone (typically ages 5-11) require UM service. Airlines provide supervision throughout the journey. Fees typically $100-$150 per direction.

6. **Medical Clearance (MEDIF)**: Required for passengers with medical conditions that may affect their fitness to fly. Airlines use the IATA MEDIF form for assessment.`,
    category: "passenger-services",
    tags: "accessibility,wheelchair,SSR,disability,unaccompanied-minor,MEDIF,special-assistance",
  },

  // === RESOLUTION 800 ===
  {
    title: "Resolution 800 - Overview, Purpose & Applicability",
    content: `IATA Resolution 800 governs Passenger Sales Agency Rules (PAC 59, 60, 61).

**Applicable Markets:** Afghanistan, Algeria, Belarus, Bhutan, Brunei Darussalam, Burundi, Cape Verde, Cuba, Comoros, DPRK, Democratic Republic of Congo, Djibouti, Equatorial Guinea, Eritrea, Falkland Islands, Gambia, Guinea, Guinea-Bissau, Islamic Republic of Iran, Iraq, Israel, Laos, Liberia, Libya, Madagascar, Maldives, Myanmar, Palestinian Territories, Sao Tome and Principe, Seychelles, Somalia, Sudan, Syrian Arab Republic, Tajikistan, Timor Leste, Turkmenistan, Venezuela, Uzbekistan and Yemen.

**Purpose:** To encourage the orderly promotion and sale of international air transportation by Members through their Accredited Agents in an efficient manner based on established business procedures.

**Key Principles:**
1. Only Accredited Agents to be Appointed: A travel agency appointed by a Member must be an Accredited Agent operating from an Approved Location on the Agency List.
2. Duty to Promote and Sell: An Accredited Agent undertakes to represent the interests of the Member and promote and sell international air transportation.
3. Agency Investigation Panel: Activities contained in Section 3. Where no AIP exists, the Agency Administrator exercises those duties.

**Resolution Type:** Type B | Expiry: Indefinite`,
    category: "agency-rules",
    tags: "resolution-800,IATA,passenger-sales,agency,accreditation,markets,applicability,purpose",
  },
  {
    title: "Resolution 800 - Accreditation Criteria & Financial Standing (Section 2)",
    content: `Section 2 of Resolution 800 defines the criteria for accreditation and retention of IATA Agents.

**General Requirements (Section 2.1-2.4):**
- Any Person in possession of appropriate official licences may be considered for inclusion on the Agency List.
- When an Accredited Agent does not continue to meet requirements, the Agency Administrator shall initiate a review.
- If an application contained a material inaccurate or incomplete statement, the Agency Administrator may give notice of termination.

**Financial Standing (Section 2.4.1):**
- The applicant must provide accredited accounts showing satisfactory financial standing and ability to remain solvent.
- Financial statements must be independently produced in accordance with local accounting practices.
- Factors considered: (i) Availability of adequate liquid funds, (ii) Capital commensurate with fixed assets, (iii) Preferential claims on assets and contingent liabilities.
- The applicant may be required to provide bank or insurance bonds or guarantees.
- Failure to renew bonds/guarantees by expiry date constitutes grounds for termination.

**Other Key Criteria:**
- Section 2.4.2: Applicant must wholly own and fully manage the business.
- Section 2.4.3: At least two full-time travel staff qualified to sell international air transportation.
- Section 2.4.4: Place of business must be open regularly, clearly identified as a travel agency, and freely accessible to the public.
- Section 2.4.5: Applicant must not have a name misleadingly similar to an IATA Member or IATA.
- Section 2.4.6: Applicant, managerial staff, or principal stockholders shall not have been found guilty of wilful violations of fiduciary obligations or be undischarged bankrupts.
- Section 2.4.7: No person who is a director shall have been involved in an Agent removed from the Agency List or under notice of default.
- Section 2.4.8: Applicant must not be a General Sales Agent for a Member in the country where the location is situated.
- Section 2.4.9: Must take all necessary actions for safe custody of Standard Traffic Documents.
- Section 2.4.11: In BSP countries, must have facility to issue STDs through an approved Electronic Ticketing System.
- Section 2.4.13: Must possess a valid licence to trade where officially required.
- Section 2.4.14: All material statements in the application shall be accurate and complete.

**Special Cases:**
- Section 2.5: AIP may approve an application in areas where no persons could otherwise meet requirements.
- Section 2.6: Tour Operators solely concerned with organising Inclusive Tours may be accredited even without a place freely accessible to the public.`,
    category: "agency-rules",
    tags: "accreditation,financial-standing,criteria,agency-list,retention,qualifications,section-2,bonds,guarantees",
  },
  {
    title: "Resolution 800 - Financial Assessments for Agents with Amount at Risk Greater than USD 5 Million (Section 2.7)",
    content: `Section 2.7 of Resolution 800 establishes additional financial and operational review requirements for Agents with a high Amount at Risk.

**Applicability (Section 2.7.1):** An Agent with an Amount at Risk greater than USD 5,000,000 will be subject to additional financial and operational reviews per Attachment C. Any cost associated with such review will be borne by the Agent.

**Assessment Framework Structure (Section 2.7.2):**
- Key Criterion: Failing one Key criterion results in failing the entire section.
- Standard Criterion: Failing a specified number of Standard criteria results in failing the section.

**Passing the Assessment (Section 2.7.3):** The Agent must pass ALL sections of the framework per Attachment C.

**Consequences of Failure (Section 2.7.4):** The Agent will be required to provide a Financial Security to cover any Amount at Risk in excess of USD 5,000,000.

**Ongoing Annual Examination (Section 2.7.5):** The Agent will continue to undergo annual examination of its financial standing per Section 2.4.1.

**Three Assessment Sections:**
1. Section 1 - Historical Financial Data: EBITDA, cash ratio, quick ratio, free cash flow, net equity, net sales trends, net income, interest coverage ratio, and auditor qualifications.
2. Section 2 - Forecasted Financial Process: Effective business forecast and cash flow forecast processes (minimum 1-year visibility).
3. Section 3 - Operational Review: Disaster management, cybersecurity management, and data protection compliance.

**General Result:** Any failure in any of the above sections results in a failed assessment overall.`,
    category: "agency-rules",
    tags: "financial-assessment,amount-at-risk,USD-5-million,financial-security,high-risk,section-2.7,key-criterion,standard-criterion",
  },
  {
    title: "Resolution 800 - Agency Investigation Panel (Section 3)",
    content: `Section 3 of Resolution 800 governs the constitution, procedures, and authority of the Agency Investigation Panel (AIP).

**Constitution (Section 3.1.1):**
- The Agency Administrator shall set up an AIP in each country where warranted.
- Where no AIP exists, the Agency Administrator exercises the duties and authority of the AIP.
- Any Member may participate by giving written notification of a senior management representative.
- The Chair and Secretary are normally provided by the Member national carrier(s).
- On full implementation of BSP in a country, the AIP shall have six months to disband and transfer accreditation activities to the IATA office.

**Procedures (Section 3.2):**
- The AIP shall meet when convened by the Secretary, or at the request of the Agency Administrator or one-third of participating Members.
- The AIP shall meet not less than four times a year.
- A quorum is constituted by a simple majority of Members operating to the territory of the AIP.
- Decisions are taken by vote; no abstentions, secret voting, or proxy voting.

**Authority (Section 3.4):**
- Two-thirds majority vote: Applications for inclusion on the Agency List, changes of ownership/legal status, changes of name or location.
- Unanimous vote: Applications under Section 2.4.8(b), increases in frequency of sales reports and remittances.

**Electronic Ticketing (Section 3.5):**
- A Member or Airline participating in BSP may issue an Electronic Ticketing (ET) Authority to an Agent's Head or Branch Office Location.
- Any Member or Airline may cancel ET Authority by notifying the Agent in writing or updating BSPlink.`,
    category: "agency-rules",
    tags: "agency-investigation-panel,AIP,voting,procedures,electronic-ticketing-authority,BSP,section-3,quorum,constitution",
  },
  {
    title: "Resolution 800 - Accreditation Procedures & Agency List (Section 4)",
    content: `Section 4 of Resolution 800 covers the procedures for accreditation of agents and management of the Agency List.

**Processing Applications (Section 4.1):**
- Upon receipt, the Secretary verifies completeness of the application.
- If complete, the Secretary publishes to Members, designates two investigators from the AIP, and obtains a financial evaluation.
- If the AIP finds the applicant meets Section 2 requirements, it may approve by a two-thirds majority vote.
- The Agency Administrator enters the name and location on the Agency List and notifies the Agent and Members within 15 days.
- If the AIP cannot reach a two-thirds majority, the application is forwarded to the Agency Administrator for decision.
- When an application is rejected, the Agency Administrator notifies the applicant in writing with full reasons.

**Reconsideration (Section 4.2):** A rejected applicant may within 30 days request reconsideration by the AIP or invoke review by the Travel Agency Commissioner.

**The Agency List (Section 4.3):** The Agency Administrator maintains, publishes, and circulates the Agency List containing:
- Name and postal address, Address of place of business, Type (Head Office, Branch, or Administrative Office), Date of approval, IATA Numeric Code.

**Agency Fees (Section 4.4):**
- Annual fees are due no later than December 1 of the preceding year.
- Invoices are issued in Swiss Francs (CHF) and collected through the BSP.
- Non-payment by December 31 results in termination of the Sales Agency Agreement.
- Reinstatement is possible if overdue fees are received by March 1 (if late payment was beyond Agent's control).
- Lack of compliance to report major changes within 30 days: CHF 1,500 fee.`,
    category: "agency-rules",
    tags: "accreditation,agency-list,application,procedures,agency-fees,numeric-code,section-4,registration,annual-fee,CHF",
  },
  {
    title: "Resolution 800 - Agent Appointments & Traffic Documents (Section 5)",
    content: `Section 5 of Resolution 800 governs the execution of Sales Agency Agreements and the appointment of Agents by Members.

**Sales Agency Agreement (Section 5.1):** The Director General, acting on behalf of IATA Members, shall execute a Sales Agency Agreement with each accredited Agent.

**Appointment of Agents by Members or BSP Airlines (Section 5.2):**
- Through the Agency Administrator: Effective for all locations unless the Member notifies IATA of geographical exclusions.
- By Certificate of Appointment: Delivered to the Agent in the form prescribed by Resolution 820, with a copy simultaneously transmitted to the Agency Administrator.

**Traffic Documents (Section 5.3):**
- Delivery of Traffic Documents to an Agent is at the option of the Member.
- No Member shall deliver Traffic Documents to an Agent in a BSP area unless the Member has appointed the Agent.
- In the event a Member ceases all scheduled international air service due to financial failure, the Agency Administrator shall cause that Member's Traffic Documents to be removed from all Approved Locations.
- ISS Management provides Agents in BSP countries with ranges of Standard Traffic Document (STD) numbers.

**Additional Responsibilities of Agent (Section 5.4):**
- STDs shall be issued only at an Approved Location using only the ticketing authority deposited by the Member or Airline.
- An Agent shall not issue an STD for transportation solely on another air carrier unless authorised by the Member whose STD was used.
- An Agent that does not issue STDs for more than 12 months shall have its Ticketing Authority removed.

**Capacity and Indemnity (Section 5.5):** Members or BSP Airlines appointing Agents undertake to indemnify IATA against liability for any action taken or omitted in good faith in the performance of their functions under these Rules.`,
    category: "agency-rules",
    tags: "appointments,sales-agency-agreement,traffic-documents,ticketing-authority,BSP,section-5,STD,certificate-of-appointment,indemnity",
  },
  {
    title: "Resolution 800 - Security Standards for Premises & Systems (Section 6)",
    content: `Section 6 of Resolution 800 establishes minimum security standards for Agent premises and systems.

**Duty of Care (Section 6.1):** The Agent has a duty of care to take all reasonable care and precautions to protect all Standard Traffic Documents (STDs) from unauthorised or improper issuance, post-issuance tampering, or forgery. This includes:

(a) Confidentiality:
- Compliance with all GDS and/or Members' instructions regarding system security and best practices for Identity and Access Management (password policy, maintenance, and multi-factor authentication).
- Usage of functional and up-to-date operating systems, firewalls, anti-malware, virus detection, and data loss prevention software.
- Restrict data access to Agent systems only to employees with a strict business need.

(b) Integrity:
- Ensure completeness and accuracy of all data in storage, transit, and backups with modern encryption.

(c) Availability:
- Ensure data is backed up and allows guaranteed reliable access by authorised Agent employees.
- Ensure systems are protected from Denial of Service (DoS) attacks or other interruptions.

**Report of Security Breaches (Section 6.2):** In the event of any unlawful entry to Agent premises, the Agent shall immediately notify local police authorities and IATA.

**Verification Action (Section 6.3):** Upon receipt of advice that an Agent has suffered loss due to robbery, theft, burglary, fraud, or other unlawful means, IATA shall immediately notify all BSP Airlines in the country.

**Failure to Fulfil Contractual Obligations (Section 6.4):** Any BSP Airline or the Agency Administrator may request a review by the Travel Agency Commissioner if an Agent alters or falsifies entries in STDs.`,
    category: "agency-rules",
    tags: "security,premises,systems,duty-of-care,cybersecurity,data-protection,STD,section-6,MFA,encryption,DoS,breach",
  },
  {
    title: "Resolution 800 - Change of Ownership, Name & Location (Section 11)",
    content: `Section 11 of Resolution 800 governs notification and processing of changes to an Agent's ownership, legal status, name, or location.

**Notification Requirements (Section 11.1):** Notification must be given to the Agency Administrator prior to the change.

**Changes Requiring a New Sales Agency Agreement (Section 11.2.1):**
- Sole owner, partnership, or unincorporated firm: disposal of interest transferring control, admission/withdrawal of a partner, incorporation.
- Corporation: disposal of business to a non-Agent, transformation into a partnership, any change reducing liability of a previously liable person, any change in legal personality.

**Changes NOT Requiring a New Sales Agency Agreement (Section 11.2.2):**
- Reduction of capital
- Disposal or acquisition of stock representing 30% or more of total issued share capital
- Transfer of stock not vesting control in a new person (single or series of transactions over 3 years or less)
- Disposal or acquisition of stock representing 29% or less (no current financial review required)

**Procedures for Changes Requiring New Agreement (Section 11.3):**
- The transferor and transferee must jointly give the Agency Administrator notice at least 60 days before the change using the Notice of Change form (Attachment A).
- The transferor accepts liability for outstanding Billings until IATA is notified of the Change of Ownership date.
- The Agent will in all cases be required to provide a Financial Security in accordance with Resolution 800f until satisfactory financial statements are produced.

**Other Changes:**
- Change of Name (Section 11.11): Must notify Agency Administrator before effecting the change. AIP must recommend approval by two-thirds majority vote.
- Move of Approved Location (Section 11.12): Must notify Agency Administrator as far in advance as possible. Authority continues at the new location for up to five working days after the Approved Location closes.
- Late Notification (Section 11.15): Failure to notify within 30 days of a change of name or location can result in a Notice of Irregularity and review.`,
    category: "agency-rules",
    tags: "change-of-ownership,legal-status,name-change,location,notice-of-change,transferee,section-11,financial-security,expedited,AIP",
  },
  {
    title: "Resolution 800 - Agent Standing, Removal & Reinstatement (Section 14)",
    content: `Section 14 of Resolution 800 covers measures affecting an IATA Agent's standing, including removal, voluntary relinquishment, and reinstatement.

**Effect of Removal (Section 14.1):** When an Agent or Approved Location is removed from the Agency List:
- The Director General terminates the Agent's Sales Agency Agreement by written notice.
- The Agency Administrator notifies all Members.
- A new application for approval shall not be accepted within six months from the date of removal.

**Voluntary Relinquishment (Section 14.2):** An Accredited Agent may voluntarily relinquish its accreditation for all or any Approved Locations at any time by notifying the Agency Administrator or the Secretary of the AIP in writing.

**Other Measures Affecting Operation (Section 14.3):**
- When an Agent is declared bankrupt, placed in receivership, goes into liquidation, or becomes subject to similar legal procedures, the Agency Administrator shall remove the Agent from the Agency List.
- When evidence is produced that an Agent uses its IATA accreditation to engage in activities detrimental to IATA's good standing, the Agency Administrator may remove the Agent from the Agency List.

**Effect of Removal in BSP Areas (Section 14.4):** ISS Management shall withdraw all Standard Traffic Documents supplied to the Agent and require an immediate accounting and settlement of all monies due under the Billing and Settlement Plan.

**Reinstatement After Termination (Section 14.6):** IATA may reinstate the Agent to the Agency List within 60 days of termination, provided:
(a) All Accountable Transactions and any outstanding Charges are settled.
(b) Where applicable, the Financial Security held prior to termination is re-issued and valid in accordance with Resolution 850p.

**Use of IATA Logo (Section 14.7):** An IATA Accredited Agent may use the IATA logo on letterhead and publicity materials exactly as illustrated in the Travel Agents Handbooks.

**Force Majeure (Section 14.8):** The Agent shall not be liable for delay or failure to comply with the Passenger Sales Agency Agreement if caused by acts of God, war, natural disaster, strike, fire, third-party criminal act, quarantine restriction, act of government, or other causes beyond the Agent's reasonable control.`,
    category: "agency-rules",
    tags: "removal,reinstatement,termination,agency-list,default,bankruptcy,IATA-logo,section-14,force-majeure,BSP,voluntary-relinquishment",
  },
  {
    title: "Resolution 800 - Attachment C: Financial Assessment Framework Criteria",
    content: `Attachment C of Resolution 800 defines the Financial Assessment Framework for Agents with an Amount at Risk greater than USD 5,000,000.

**SECTION 1 - Historical Financial Data:**
- 1.01 EBITDA (Last 12 months): x > 0 [KEY]
- 1.02 EBITDA (quarterly): x > 0 [Standard]
- 1.03 Cash ratio (Cash / Current liabilities): x >= 30% [Standard]
- 1.04 Quick ratio ((Cash + AR) / Current liabilities): x >= 50% [Standard]
- 1.05 Free cash flow (Last 12 months): x > 0 [KEY]
- 1.05a Trends Analysis (applied only if Free cash flow is not positive): 4 Fails = 1.05 Fail [KEY]
- 1.06 Positive Net Equity: x > 0 [Standard]
- 1.07 Decrease in net sales (Last 12M N vs N-1): x >= -20% [Standard]
- 1.08 Net Income 12 months: x > 0 [Standard]
- 1.09 Interest Coverage Ratio (EBIT / Interest Expense): x > 2.5 [Standard]
- 1.10 Qualification from auditors: No [Standard]

Section 1 Pass/Fail Rule: 1 Key ratio fail = Total Fail; 4 Standard ratio fails = Total Fail.

**SECTION 2 - Forecasted Financial Process:**
- 2.01 Effective Business Forecast (at least 1-year visibility): Yes [KEY]
- 2.02 Effective Cash Flow Forecast (at least 1 year): Yes [KEY]

**SECTION 3 - Operational Review:**
- 3.01 Effective Disaster Management (ISO 22301 or equivalent): Yes [KEY]
- 3.02a Chief Information Security Officer appointed: Yes [KEY]
- 3.02b Information security strategy/roadmap aligned with IT and business strategies: Yes [Standard]
- 3.02c Formalised and enforced information security policy: Yes [KEY]
- 3.02d Information security risk assessment performed: Yes [KEY]
- 3.02e Information security controls and measures implemented: Yes [KEY]
- 3.02f Regular employee training on information security risks: Yes [KEY]
- 3.02g Information security incidents managed: Yes [KEY]
- 3.02h Regular vulnerability scans and penetration tests performed: Yes [KEY]
- 3.02i Security patches implemented at least every 3 months: Yes [KEY]
- 3.02l Specific measures to ensure continuity of information systems following a cyberattack: Yes [KEY]
- 3.03a Data Protection Officer or similar role appointed: Yes [KEY]
- 3.03b Formalised and enforced data protection policy: Yes [KEY]
- 3.03c Formalised and enforced information classification policy: Yes [KEY]
- 3.03d Documented register of personal data processing activities with lawful grounds: Yes [KEY]
- 3.03e Data protection notices adequately documented to notify individuals: Yes [KEY]
- 3.03f Data Protection Impact Assessments conducted for high-risk processing activities: Yes [KEY]
- 3.03g Regular employee training on data protection risks and good practices: Yes [Standard]
- 3.03h Procedures to handle individuals' data protection rights (access, erasure, objection): Yes [KEY]
- 3.03i Data Protection by Design and by Default implemented in project methodology: Yes [KEY]

Section 3 Pass/Fail Rule: 1 Key ratio fail = Total Fail; 3 Standard ratio fails = Total Fail.

**General Result:** Any failure in any of the three sections results in a failed assessment overall.`,
    category: "agency-rules",
    tags: "financial-assessment,attachment-C,EBITDA,cash-ratio,quick-ratio,free-cash-flow,net-equity,interest-coverage,cybersecurity,data-protection,CISO,DPO,ISO-22301,key-criterion,standard-criterion,USD-5-million",
  },
  {
    title: "Resolution 800 - Agency Fees Schedule (Attachment B)",
    content: `Attachment B of Resolution 800 defines the Application of Agency Fees in Swiss Francs (CHF).

**Fee Schedule:**
- New Applicant - Registration Fee, Head Office Location: CHF 500
- New Applicant - Application Fee, Head Office Location: CHF 1,000
- New Applicant - Registration Fee, Branch Office Location: CHF 250
- New Applicant - Application Fee, Branch Office Location: CHF 500
- Annual Fee, Head Office Location: CHF 500
- Annual Fee, Branch Office Location: CHF 250
- Change of Ownership/Legal Status - Application Fee: CHF 1,000
- Change of Name - Administrative Fee: CHF 500
- Change of Location - Administrative Fee: CHF 500
- Late Notification of Major Change (within 30 days): CHF 1,500
- Financial Review Fee (for non-compliance with Local Financial Criteria): Cost-justified fee as determined by IATA

**Key Notes:**
- Annual fees are due no later than December 1 of the preceding year.
- Invoices are issued in Swiss Francs (CHF) and collected through the BSP.
- Non-payment by December 31 results in termination of the Sales Agency Agreement.
- Reinstatement is possible if overdue fees are received by March 1 (if late payment was beyond Agent's control).
- Agency fees are determined by Conference.`,
    category: "agency-rules",
    tags: "agency-fees,attachment-B,CHF,registration-fee,annual-fee,application-fee,resolution-800,BSP",
  },

  // === RESOLUTION 812 ===
  {
    title: "Resolution 812 - Passenger Sales Agency Rules Framework",
    content: `Resolution 812 establishes the regulatory framework governing accreditation, operation, compliance, and risk management of IATA Accredited Passenger Sales Agents within the IATA Agency Programme.

The Resolution provides the global operational structure ensuring reliable distribution of air transportation products through accredited agents and standardized BSP settlement mechanisms.

**SECTION 1 - Agency Programme Joint Council (APJC):**
The Agency Programme Joint Council (APJC) operates in each market where Resolution 812 applies.
Key functions include:
- Reviewing Agency Programme operations.
- Recommending accreditation and financial criteria.
- Providing governance balance between airlines and agents.
- Submitting proposals to the Passenger Agency Conference.

Composition:
- Airline representatives.
- Accredited agent representatives (equal representation).
- IATA as ex-officio member.
- Maximum voting members: 18.

**SECTION 2 - Accreditation Requirements:**
Four Accreditation Types:
1. Standard Accreditation (No Cash Facility)
2. Standard Accreditation (Cash Facility)
3. Multi-Country Accreditation
4. Euro-Zone Accreditation

General Requirements:
- Legal registration and licensing.
- Qualified personnel trained in airline ticketing.
- Financial capability and solvency.
- Compliance with regulatory and AML requirements.
- Secure electronic ticketing systems.
- Protection of business and payment data.

Authorized BSP Payment Methods:
- Cash Payment Method
- Customer Card Payment Method
- IATA EasyPay
- Alternative Transfer Methods

**SECTION 3 - Maintenance of Accreditation:**
Agents must:
- Comply continuously with Passenger Sales Agency Agreement.
- Maintain financial security validity.
- Complete annual agency revalidation.
- Provide information requested by IATA.

Administrative Non-Compliance may result in removal of ticketing authority or termination of accreditation.

**SECTION 4 - Risk Events:**
Risk Events are circumstances affecting an Agent's financial standing or creditworthiness.
Consequences may include increased remittance frequency, financial security requirements, suspension or termination actions.

**Accreditation Principle:** Accreditation confirms that an Agent possesses operational competence, financial stability, and regulatory compliance, allowing participation in BSP airline distribution systems.`,
    category: "agency-rules",
    tags: "resolution-812,accreditation,agency-programme,BSP,APJC,risk-events,financial-security,passenger-sales-agency,compliance,agent-governance",
  },

  // === RESOLUTION 820e ===
  {
    title: "Resolution 820e - Reviews by the Travel Agency Commissioner",
    content: `Resolution 820e establishes the independent review and dispute resolution mechanism within the IATA Agency Programme through the Travel Agency Commissioner.

The Commissioner reviews decisions affecting Agents or applicants and ensures actions comply with applicable IATA Resolutions.

**SECTION 1 - Jurisdiction:**
The Commissioner has authority to review disputes including:
- Rejection of accreditation applications.
- Removal from Agency List.
- Withdrawal of ticketing authority.
- Change of ownership or location disputes.
- Actions affecting an Agent's commercial survival.

Decisions must be based strictly on applicable IATA Resolutions.

**Review Initiation:**
An Agent or applicant may request review when:
- Accreditation is denied.
- Agency Administrator decisions cause operational harm.
- Ticket stock or electronic authority is withdrawn.

Requests must normally be filed within 30 calendar days of decision notice.

**Commissioner Powers:**
The Commissioner may:
- Examine evidence from all parties.
- Grant interim relief.
- Require financial guarantees when airline funds are at risk.
- Stay enforcement actions pending review.

**Agency Administrator Reviews:**
The Administrator may initiate review where:
- Accreditation criteria are no longer met.
- Financial obligations are breached.
- Accounting irregularities exist.
- Standard Traffic Documents are misused.

**Outcome:** The Commissioner issues written decisions including findings of fact, conclusions under Resolutions, and penalties or relief granted. This Resolution ensures procedural fairness and regulatory accountability within the Agency Programme.`,
    category: "agency-rules",
    tags: "resolution-820e,travel-agency-commissioner,dispute-resolution,accreditation-review,agency-list,compliance-enforcement,appeal-process",
  },

  // === RESOLUTION 880 ===
  {
    title: "Resolution 880 - Reduced Fares for Accredited Passenger Sales Agents",
    content: `Resolution 880 defines conditions under which airlines may grant reduced fare international air transportation to Accredited Agents and related stakeholders.

Reduced fares are discretionary and subject to airline policies and eligibility requirements.

**Eligibility Purpose:**
Reduced fare travel may be granted for:
- Official industry meetings.
- Vocational or training travel.
- Agency Commissioner hearings.
- Operational business activities of accredited agents.

**Key Principles:**
- Reduced fares are optional for Member Airlines.
- Approval occurs on a bilateral airline basis.
- Airline booking and ticketing policies apply.
- Eligibility conditions must be satisfied.

**Application Procedure:**
Requirements include:
- Completion of prescribed Application Form.
- Submission before travel commencement.
- Accurate passenger and itinerary information.
- Responsibility of stakeholder for application accuracy.

Airlines must refuse reduced fare requests if:
- eligibility requirements are not met, or
- application information is incomplete.

**Financial Responsibility:**
Applicants must:
- pay applicable fares if approval is denied,
- return tickets if eligibility changes,
- certify correctness of submitted information.

This Resolution supports professional development and industry coordination while maintaining airline commercial control.`,
    category: "agency-rules",
    tags: "resolution-880,reduced-fare,agent-benefits,training-travel,industry-meetings,discounted-transportation,IATA-agents",
  },
];

// Stop words to exclude from relevance scoring (mirrors db.ts)
const STOP_WORDS = new Set([
  "a","an","the","is","it","in","on","at","to","for","of","and","or","but",
  "how","do","i","me","my","we","you","your","what","when","where","who",
  "which","this","that","these","those","can","could","would","should","will",
  "be","been","being","have","has","had","was","were","are","am","with",
  "from","by","about","into","through","during","near","above","below",
  "between","out","off","over","under","again","then","once","here","there",
  "why","so","if","as","up","down","any","all","both","each","few","more",
  "most","other","some","such","no","not","only","same","than","too","very",
  "just","because","while","although","though","since","until","unless",
  "please","tell","give","show","explain","describe","find","get","make",
  "want","need","like","know","think","see","look","use","go","come","take",
]);

/** Escape special regex characters in a search term */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Returns true if `text` contains `term` as a whole word */
function wordMatch(text: string, term: string): boolean {
  return new RegExp(`(?<![a-z])${escapeRegex(term)}(?![a-z])`, "i").test(text);
}

export function getBuiltInKnowledge(query: string): IATAKnowledgeEntry[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  if (terms.length === 0) return [];

  return IATA_KNOWLEDGE_BASE
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        if (wordMatch(entry.title, term)) score += 3;
        if (wordMatch(entry.tags, term)) score += 2;
        if (wordMatch(entry.content, term)) score += 1;
      }
      return { ...entry, score };
    })
    .filter((e) => e.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(IATA_KNOWLEDGE_BASE.map((e) => e.category)));
}
