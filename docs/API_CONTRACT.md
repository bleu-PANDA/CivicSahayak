# CivicSahayak / CivicOS API Contract Specification

> **Version**: 1.0.0  
> **Base URL**: `http://localhost:8080`  
> **Content-Type**: `application/json` (or `multipart/form-data` for uploads)

This document specifies the exact API contract implemented by the backend for compatibility with both the **ssych UI** frontend and **Lovable** client applications.

---

## 1. Natural Language Eligibility Evaluation

### `POST /api/evaluate`
Evaluates citizen demographic criteria against statutory scheme rules using the multi-agent pipeline and Corretto rules engine.

#### Request Body
```json
{
  "user_id": "citizen-123",              // string (optional, defaults to anonymous guest)
  "query": "21yo UP student, income 250000", // string (required)
  "documents": ["income_certificate"]    // array of strings (optional, verified doc IDs)
}
```

#### Successful Response (`200 OK`)
```json
{
  "user_id": "citizen-123",
  "extracted_profile": {
    "age": 21,
    "state": "Uttar Pradesh",
    "income": 250000,
    "education": "Undergraduate",
    "occupation": "Student",
    "gender": "Any",
    "category": "General"
  },
  "schemes": [
    {
      "scheme_id": "UP_SCHOLARSHIP_2024",
      "name": "UP Post-Matric Scholarship Scheme",
      "category": "education",
      "eligibility_score": 92,
      "status": "ELIGIBLE",
      "criteria_breakdown": [
        {
          "criterion": "income",
          "passed": true,
          "weight": 30,
          "detail": "Income ₹2,50,000 within ceiling ₹2,50,000"
        },
        {
          "criterion": "age",
          "passed": true,
          "weight": 25,
          "detail": "Age 21 within required range 17-25"
        },
        {
          "criterion": "state",
          "passed": true,
          "weight": 20,
          "detail": "State matches Uttar Pradesh"
        },
        {
          "criterion": "education",
          "passed": true,
          "weight": 25,
          "detail": "Undergraduate enrollment verified"
        }
      ],
      "missing_documents": [
        "institution_certificate"
      ],
      "benefit_amount": 50000,
      "financial_benefit": "100% Tuition Fee Reimbursement + ₹12,000 allowance",
      "why_eligible": "You meet all statutory requirements under UP Social Welfare Directive Gazette. Income ceiling and age limits are fully respected.",
      "application_url": "https://scholarship.up.gov.in"
    }
  ],
  "scheme_combinations": [
    {
      "title": "Higher Education Scholar Trinity",
      "schemes": ["UP_SCHOLARSHIP_2024", "AYUSHMAN_BHARAT"],
      "total_benefit": 550000,
      "synergy_note": "Combines full course tuition fee reimbursement with cashless family health cover without double-dipping conflict."
    }
  ]
}
```

#### Error Response (`400 Bad Request` / `500 Internal Server Error`)
```json
{
  "error": "Invalid request payload",
  "message": "Query parameter must be a non-empty string"
}
```

---

## 2. Document Sandboxing & OCR Extraction

### `POST /api/upload`
Processes uploaded citizen verification documents inside an isolated Firecracker microVM with zero-retention OCR.

#### Request Body (JSON or Multipart Form)
```json
{
  "user_id": "citizen-123",                    // string (required)
  "document_type": "income_certificate",        // string (required)
  "file_name": "income_certificate_2026.pdf",  // string (optional)
  "file": "base64_or_simulated_bytes"          // string (optional)
}
```

#### Successful Response (`200 OK`)
```json
{
  "document_id": "doc-8f4b13-92",
  "user_id": "citizen-123",
  "document_type": "income_certificate",
  "verification_status": "VERIFIED",
  "confidence_score": 0.984,
  "extracted_data": {
    "applicant_name": "Citizen Beneficiary",
    "verified_annual_income": 250000,
    "issuing_authority": "Tehsildar / Sub-Divisional Magistrate",
    "certificate_number": "UP/REV/2026/891240",
    "issue_date": "2025-08-14",
    "valid_until": "2028-08-13"
  },
  "microvm": {
    "vm_id": "vm-fc-x86-7a82b",
    "duration_ms": 95,
    "lifecycle": "SPAWNED -> MOUNTED -> OCR -> PARSED -> DESTROYED"
  },
  "cedar_authorization": {
    "decision": "ALLOW",
    "matching_policy": "policy-document-agent-sandbox"
  }
}
```

---

## 3. Scheme Application Checklist

### `POST /api/checklist`
Generates a step-by-step checklist and application roadmap for a designated government scheme.

#### Request Body
```json
{
  "scheme_id": "UP_SCHOLARSHIP_2024",  // string (required)
  "user_id": "citizen-123"             // string (optional)
}
```

#### Successful Response (`200 OK`)
```json
{
  "scheme_id": "UP_SCHOLARSHIP_2024",
  "scheme_name": "UP Post-Matric Scholarship Scheme",
  "official_url": "https://scholarship.up.gov.in",
  "estimated_processing_days": "30-45 days",
  "application_fee": "₹0 (Free Government Portal)",
  "required_documents": [
    {
      "id": "income_certificate",
      "name": "Income Certificate (< ₹2.5L)",
      "status": "VERIFIED",
      "essential": true
    },
    {
      "id": "institution_certificate",
      "name": "Institution Bonafide Certificate",
      "status": "PENDING",
      "essential": true
    },
    {
      "id": "aadhaar_card",
      "name": "Aadhaar Card (e-KYC verified)",
      "status": "VERIFIED",
      "essential": true
    }
  ],
  "steps": [
    {
      "step_number": 1,
      "title": "Aadhaar e-KYC Verification",
      "description": "Authenticate your biometric identity via UIDAI OTP on the portal."
    },
    {
      "step_number": 2,
      "title": "Obtain Institution Certificate",
      "description": "Download bonafide form and obtain registrar seal from college."
    },
    {
      "step_number": 3,
      "title": "Submit Online Application",
      "description": "Submit form on scholarship.up.gov.in before October 31 deadline."
    }
  ]
}
```

---

## 4. System Health Check

### `GET /api/health`
Checks status of all underlying services (OpenSearch, PostgreSQL, Corretto Rules Engine, Cedar AuthZ, LocalStack).

#### Successful Response (`200 OK`)
```json
{
  "status": "HEALTHY",
  "services": {
    "opensearch": "CONNECTED",
    "postgres": "CONNECTED",
    "rules_engine": "CONNECTED",
    "cedar": "ACTIVE",
    "localstack": "CONNECTED",
    "firecracker": "READY"
  },
  "timestamp": "2026-09-20T00:00:00.000Z",
  "version": "1.0.0"
}
```
