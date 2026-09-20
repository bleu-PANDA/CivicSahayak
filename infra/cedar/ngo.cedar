// ==============================================================================
// NGO Cedar Policy: Community Assisted Benefits Access
// Registered NGOs can help citizens discover benefits with delegated consent.
// ==============================================================================

// NGOs with active consent can run batch evaluations for community members
permit(
  principal in NGOAssistant,
  action in [Action::"evaluate", Action::"querySchemes"],
  resource in EligibilityResult
) when {
  principal.hasCitizenConsent == true
};

// NGOs can query public scheme catalogues
permit(
  principal in NGOAssistant,
  action == Action::"query",
  resource == OpenSearch::"government_schemes"
);
