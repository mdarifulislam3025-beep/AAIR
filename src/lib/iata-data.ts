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

2. **Fare Construction**: Uses the IATA Mileage System or Routing System to calculate fares for multi-sector journeys. The Mileage Principle allows up to 20% excess mileage (EMA - Excess Mileage Allowance) before surcharges apply.

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

6. **EU261 Regulation**: For flights departing from EU airports or on EU carriers arriving in EU, additional compensation of €250-€600 may apply for cancellations and long delays.`,
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
   - €250 for flights up to 1,500 km
   - €400 for intra-EU flights over 1,500 km and other flights 1,500-3,500 km
   - €600 for flights over 3,500 km
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
   - 3+ hour arrival delay: Compensation (€250-€600) unless extraordinary circumstances

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

5. **Cargo Rates**: Based on weight or volume (whichever is greater). Volume weight calculated as: L × W × H (cm) / 6000 = volume weight (kg).

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


  // === PASSENGER AGENCY AGREEMENT (RESOLUTION 824) ===
  {
    title: "IATA Resolution 824 - Passenger Sales Agency Agreement (Version II) Overview",
    content: `Extracted from the Passenger Agency Conference Resolutions Manual (pages 414-417), Resolution 824 (Version II):

1. **Agreement Scope and Adoption**: The Passenger Sales Agency Agreement form is adopted by the Agency Administrator and implemented upon notification. The agreement text references applicability (including exceptions such as USA variants in the printed form).

2. **Effectiveness (Section 1)**: The agreement becomes effective between Agent and Carrier upon appointment under the Sales Agency Rules in the country/locations concerned. Amendments to the Agreement have force once in effect under those rules.

3. **Incorporated Framework (Section 2)**: The relationship incorporates Sales Agency Rules, BSP rules (where applicable), local standards issued under Sales Agency Rules, and other applicable IATA Resolutions and provisions derived from them.

4. **Selling Carrier Services (Section 3)**: Agents are authorized to sell air passenger transportation (and authorized ancillary/other services) on behalf of appointed carriers, under carrier tariffs, conditions of carriage, and written instructions.

5. **Compliance Principle**: The Agent must not vary core carriage terms set by the Carrier and must complete Traffic Documents in the required manner.

> Note: This entry is transcribed from photographed pages and should be verified against the latest official IATA publication for legal use.`,
    category: "agency-rules",
    tags: "resolution-824,passenger-sales-agency-agreement,agency-administration,carrier-agent,version-ii",
  },
  {
    title: "IATA Resolution 824 - Observance, Designation, and Traffic Document Custody",
    content: `Extracted clauses from Resolution 824 (pages 415-416):

1. **Observance of Laws and Regulations (Section 4)**: Agent shall observe applicable government laws/regulations concerning sale of air transportation in relevant territories.

2. **Agency Designation (Section 5)**: Agent shall not represent itself as a "General Agent" or use designations implying it is a carrier office or member office.

3. **Custody of Traffic Documents/Identification Plates (Section 6)**:
   - Traffic Documents and Identification Plates deposited by Carrier (or ISS Management acting on Carrier's behalf) remain Carrier property.
   - Agent acknowledges no proprietary rights in such documents/plates.
   - Carrier/ISS may require immediate return at any time.

4. **Automated Ticketing Controls (Section 6.3/6.4 context)**:
   - If Agent issues documents via automated ticketing on behalf of Carrier, Carrier may withdraw that authority.
   - Agent must cease issuance where default/suspension conditions apply under Sales Agency Rules.
   - For third-party systems, Agent must obtain required written confirmations/specifications before issuing on Carrier's behalf.

> Note: Transcribed from image pages; confirm wording against the official manual before contractual/legal reliance.`,
    category: "agency-rules",
    tags: "resolution-824,traffic-documents,identification-plates,automated-ticketing,compliance",
  },
  {
    title: "IATA Resolution 824 - Remittance, Refunds, Records, Confidentiality, and Termination",
    content: `Extracted clauses from Resolution 824 (pages 415-416):

1. **Monies Due and Remittance (Section 7)**:
   - Monies collected by the Agent for transportation/ancillary services (net of applicable remuneration where permitted) are Carrier property and held in trust until accounted/settled.
   - Agent remains responsible for remittance under required timelines/conditions and may face immediate due-and-payable consequences in insolvency-like events.

2. **Refunds (Section 8)**: Agent shall process refunds in line with Carrier tariffs, conditions of carriage, and written instructions; generally only for Traffic Documents issued by that Agent.

3. **Remuneration (Section 9)**: Carrier remuneration to Agent is as communicated by Carrier and constitutes compensation for services rendered to Carrier.

4. **Records and Inspection (Section 10)**: Agent shall maintain records/accounts with supporting documents and preserve them for inspection/copying by relevant Carrier for a defined retention period (shown as at least two years in the extracted text).

5. **Confidentiality (Section 11)**: Carrier and Agent (including officers/employees/agents in scope) treat possession data/information as confidential except where law requires disclosure.

6. **Transfer/Assignment/Change and Termination (Sections 12-13)**:
   - Assignment/transfer restrictions apply.
   - Prior notice obligations exist for legal-status/ownership/name/location changes.
   - Termination mechanics are governed with reference to Sales Agency Rules and specified notice effects.

> Note: Transcribed from photographed pages; verify exact legal language in the official IATA source.`,
    category: "agency-rules",
    tags: "resolution-824,remittance,refunds,records,confidentiality,termination",
  },
  {
    title: "IATA Resolution 824 - Indemnities, Notices, Applicable Law, Severability, Supersession",
    content: `Extracted clauses from Resolution 824 (pages 416-417):

1. **Indemnities and Waiver (Section 15 context)**:
   - Carrier indemnity language appears for losses/injuries/damage tied to transportation/ancillary services and Carrier failures in defined circumstances.
   - Agent indemnity language appears for losses/injury/damage arising from negligent acts/omissions, breach by Agent, or unauthorized/negligent system use by Agent-side personnel/contractors.

2. **Notices (Section 16)**:
   - Notices under the agreement may be sent between Carrier/Agency Administrator/Agent and are sufficient when dispatched by means providing proof, addressed to principal offices or specified Agency Administrator address.

3. **Applicable Law (Section 17)**:
   - Agreement interpreted/governed by law of principal place of business of Agent, with branch-office dispute localization rules reflected in the extracted text.

4. **Severability (Section 18)**:
   - Invalidity of one provision does not invalidate remaining provisions, which continue binding/effective.

5. **Other Agreements Superseded (Section 19)**:
   - Agreement supersedes prior Passenger Sales Agency Agreements for approved locations (subject to text-specific exceptions and without prejudice to existing rights/liabilities).

> Note: OCR-style transcription from images; consult the official Resolution 824 text for definitive wording.`,
    category: "agency-rules",
    tags: "resolution-824,indemnity,notices,applicable-law,severability,superseded-agreements",
  },

  // === ACCESSIBILITY ===
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
  // Filter out stop words for more precise matching
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
    // Minimum score of 3 required — prevents weak false positives
    .filter((e) => e.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(IATA_KNOWLEDGE_BASE.map((e) => e.category)));
}
