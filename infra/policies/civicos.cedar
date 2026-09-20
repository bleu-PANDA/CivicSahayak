// ==============================================================================
// CivicOS Sovereign AI Cedar Authorization Policies (PBAC)
// Formally verified least-privilege policies for citizens, agents, and sandboxes.
// ==============================================================================

// Policy 1: Citizens can only access their own data
permit(
  principal in User,
  action == Action::"read",
  resource in EligibilityResult
) when {
  principal.id == resource.ownerId
};

// Policy 2: Scheme Agent can query OpenSearch government_schemes index
permit(
  principal == Agent::"scheme-agent",
  action == Action::"query",
  resource == OpenSearch::"government_schemes"
);

// Policy 3: Document Agent can only access Firecracker document sandbox microVMs
permit(
  principal == Agent::"document-agent",
  action == Action::"process",
  resource in Sandbox
) when {
  resource.id like "firecracker-*"
};

// Policy 4: Eligibility Agent can invoke Corretto deterministic rules engine
permit(
  principal == Agent::"eligibility-agent",
  action == Action::"execute",
  resource == RulesEngine::"corretto-evaluator"
);

// Policy 5: Evidence Agent can retrieve statutory citations from OpenSearch
permit(
  principal == Agent::"evidence-agent",
  action == Action::"readCitation",
  resource == OpenSearch::"government_schemes"
);

// Default Deny: Any action not explicitly permitted is rejected by Cedar engine.
