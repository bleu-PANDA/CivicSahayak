// ==============================================================================
// Government Officer Cedar Policy: Verification & Audit Controls
// Block-level or district welfare officers verifying statutory criteria.
// ==============================================================================

// Welfare officers can inspect audited agent logs and anonymized aggregate stats
permit(
  principal in WelfareOfficer,
  action in [Action::"audit", Action::"inspectTrace"],
  resource in AuditLog
);

// Scheme administrators can update scheme statutory rules in OpenSearch
permit(
  principal in WelfareOfficer,
  action in [Action::"create", Action::"update", Action::"deprecate"],
  resource == OpenSearch::"government_schemes"
) when {
  principal.role == "SchemeAdministrator"
};
