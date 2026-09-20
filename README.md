# CivicOS: Government Benefits Discovery Platform

> **Open-Source, Sovereign AI Platform Built on AWS Open-Source Tools**  
> **UI Design Reference**: [ssych UI](https://ui.ssych.com/preview/simple-landing?bare=1) (Dark, data-dense, `#02040A` void palette, Sora + JetBrains Mono)  
> Zero Cloud Cost Development • Production-Ready Architecture • Social Impact Focus

---

## 🏛️ Executive Summary

Millions of citizens in India are legally entitled to welfare, education, healthcare, and livelihood subsidies, yet remain excluded because government portals are fragmented, eligibility criteria are buried in gazette PDFs, and rejection notices offer zero actionable explanations.

**CivicOS** is a sovereign AI-powered discovery platform where citizens describe their life situation in natural language or upload documents. A coordinated pipeline of **6 Strands Agents**, backed by **Amazon Cedar** authorization and **Firecracker microVM sandboxing**, computes deterministic eligibility across 20+ verified Indian government schemes with **Amazon Corretto** rules, retrieves statutory evidence from **OpenSearch**, detects missing documents, and generates synergistic scheme combinations.

---

## ⚡ Quick Start (Run in 30 Seconds)

### 1. Prerequisites
- **Node.js v20+** installed on macOS/Linux/Windows.

### 2. Launch CivicOS
Open two terminal windows:

**Terminal 1 (Backend API & Strands Multi-Agent Engine):**
```bash
cd backend
npm install
npm run start
# Server listens at http://localhost:8080
```

**Terminal 2 (Frontend Web Application - ssych UI):**
```bash
cd frontend
npm install
npm run dev
# Vite dev server opens at http://localhost:3000
```

Visit **`http://localhost:3000`** in your browser to experience CivicOS!

---

## 🚀 Key System Features

### 1. Natural Language Demographic Profiler & Discovery
- Citizens describe their circumstances: *"I'm a 21-year-old student from Uttar Pradesh. My family income is ₹2.5 lakh and I want financial assistance for higher education."*
- **Profile Agent** extracts structured attributes: `{ age: 21, state: 'Uttar Pradesh', income: 250000, occupation: 'Student', education: 'Undergraduate' }`.
- **Scheme Agent** queries OpenSearch knowledge base across 20+ verified schemes.
- **Corretto Rules Engine** computes deterministic 0–100% scores with hard demographic boundaries.

### 2. "Why Am I Eligible / Ineligible?" Legal Explainability
- Standard government portals: `❌ Application Rejected.`
- **CivicOS Evidence Agent**: Retrieves authoritative statutory gazette text and explains exact reasons:
  > *"Income is within statutory ceiling (₹2,50,000 ≤ ₹3,00,000) and age 21 satisfies the 18–25 guideline. 1 missing document detected: Institution Bonafide Slip."*

### 3. Firecracker MicroVM Document Sandboxing
- Citizens upload documents (Income Certificate, Aadhaar, Bonafide) or test with realistic 1-click samples.
- Spawns an isolated Linux KVM microVM (`128MB RAM`, `1 vCPU`, `duration ~95ms`) under strict **Cedar policy authorization**.
- Runs OCR extraction, certifies parameters (e.g. Tehsildar seal, certified income, validity), and terminates the microVM immediately (**Zero Data Retention**).
- Dynamically recalculates eligibility scores in real time upon verification!

### 4. Synergistic Scheme Bundling
- Analyzes statutory compatibility to prevent double-dipping while maximizing aid:
  - **Higher Education Scholar Trinity**: NSP-MCM Tuition Waiver (₹30k) + PM-USHA Living Grant (₹40k) + Ayushman Bharat Health Cover (₹5 Lakh) = **₹5,70,000 / year total unlocked benefit**.
  - **Agrarian Shield**: PM-KISAN (₹6k) + Kisan Credit Card 4% Subsidized Loan + Ayushman Bharat.
  - **Artisan Enterprise Accelerator**: PM Vishwakarma Toolkit (₹15k) + Concessional Credit + MUDRA Loan + Atal Pension.

### 5. Application Checklist & Rejection Prevention
- Step-by-step sequential application roadmap.
- Interactive checkboxes for mandatory statutory certificates.
- Direct links to official `.gov.in` portals (`scholarships.gov.in`, `pmjay.gov.in`, `pmkisan.gov.in`).
- Real-time Aadhaar NPCI mapper verification warnings to prevent DBT bounce rejections.

### 6. Live Strands Multi-Agent Telemetry Console
- Inspect real-time execution turns of the 6 specialized agents:
  1. `[Orchestrator Agent]` Task coordination & synthesis
  2. `[Profile Agent]` Demographic entity extraction
  3. `[Cedar AuthZ]` Policy checks (`permit principal Agent::"scheme-agent"`)
  4. `[Scheme Agent]` OpenSearch BM25 & semantic queries
  5. `[Eligibility Agent]` Corretto deterministic scoring
  6. `[Evidence Agent]` Statutory gazette citation retrieval
  7. `[Recommendation Agent]` Synergistic bundle compiling

---

## 🎨 UI Design System (ssych UI Reference)

Designed with the sleek, dark, data-dense design language of **[ssych UI](https://ui.ssych.com/preview/simple-landing?bare=1)**:
- **Void Dark Mode Palette**: `#02040A` deep base with `border-white/[0.08]` hairline borders.
- **Typography**: **Sora** display font for headings and **JetBrains Mono** for numerical scores, scheme codes, and criteria tags.
- **Data Density**: High-density interactive widgets, circular score gauges, telemetry stream inspector, and microVM lifecycle indicators.

---

## 🛠️ Complete Zero-Cost Tech Stack

| Component | Technology | Local Role | Production AWS Mapping |
|---|---|---|---|
| **Frontend** | React + Vite + TailwindCSS | ssych UI data-dense citizen interface | CloudFront + S3 / EKS Distro |
| **API Gateway** | Node.js + Express | Agent orchestration & REST API | AWS EKS Distro / AWS Lambda via SAM |
| **AI Agents** | Strands Agents Framework | 6 specialized autonomous agents | Autonomous Pods in EKS Distro |
| **Rules Engine** | Amazon Corretto (Java 21) | Strict deterministic rules evaluator | Spring Boot Microservice on EKS |
| **Authorization** | Amazon Cedar PBAC | Least-privilege policy enforcement | Amazon Verified Permissions / Cedar WASM |
| **Document Sandbox** | Firecracker MicroVMs | Isolated ephemeral OCR extraction | Firecracker on bare metal / AWS Lambda |
| **Knowledge Base** | OpenSearch 2.13 | Stores 20+ scheme gazettes & rules | Amazon OpenSearch Service |
| **Database** | PostgreSQL | Citizen profiles & agent_logs audit trail | Amazon RDS PostgreSQL |

---

## 📦 Container Deployment (Finch / Docker Compose)

To spin up all services including OpenSearch, PostgreSQL, LocalStack, Corretto Engine, Backend, and Frontend in containers:

```bash
cd infra
docker compose up -d
# or using Finch:
# finch compose up -d
```

---

## 📜 20+ Indexed Indian Government Schemes

1. **NSP-MCM**: National Scholarship Portal - Merit-cum-Means
2. **PM-USHA**: Pradhan Mantri Uchchatar Shiksha Abhiyan
3. **PM-JAY**: Ayushman Bharat Pradhan Mantri Jan Arogya Yojana
4. **PM-KISAN**: PM Kisan Samman Nidhi
5. **PMAY-G**: Pradhan Mantri Awas Yojana - Gramin
6. **PMAY-U 2.0**: Pradhan Mantri Awas Yojana - Urban
7. **PMS-SCST**: Post-Matric Scholarship for SC/ST Students
8. **PMMY**: Pradhan Mantri MUDRA Yojana (Shishu & Kishore)
9. **PM-VISHWAKARMA**: PM Vishwakarma Traditional Craft Scheme
10. **SSY**: Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)
11. **APY**: Atal Pension Yojana
12. **NAPS-2**: National Apprenticeship Promotion Scheme
13. **CSIS**: Central Sector Interest Subsidy on Educational Loans
14. **KCC**: Kisan Credit Card Subsidized Interest Subvention
15. **UP-KANYA-SUMANGALA**: Mukhyamantri Kanya Sumangala Yojana (UP)
16. **MH-MJPJAY**: Mahatma Jyotirao Phule Jan Arogya Yojana (Maharashtra)
17. **TN-KMUT**: Kalaignar Magalir Urimai Thittam (Tamil Nadu)
18. **TS-RYTHU-BANDHU**: Rythu Bandhu / Rythu Bharosa (Telangana)
19. **PMS-SVANIDHI**: PM Street Vendor’s AtmaNirbhar Nidhi
20. **PMMVY 2.0**: Pradhan Mantri Matru Vandana Yojana

---

## 🔒 Security & Sovereign AI Guarantees

1. **Sovereign Data Custody**: Citizen demographics and biometrics never leave the local / national jurisdiction.
2. **Defensible Deterministic Decisions**: Probabilistic LLMs explain legal evidence, while deterministic **Amazon Corretto** code computes binding eligibility numbers.
3. **Zero-Retention Sandboxing**: Uploaded document images are destroyed the millisecond OCR data is parsed.
4. **Cedar Authorization**: Strict policy boundary preventing agents from calling unauthorized databases or tools.

---

**Built with ❤️ for Social Impact • Zero AWS Cost • Production-Ready Sovereign AI**
