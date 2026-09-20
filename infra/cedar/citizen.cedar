// ==============================================================================
// Citizen Cedar Policy: Fine-grained access control for citizens
// Citizens can only view their own eligibility evaluations and upload own documents.
// ==============================================================================

// Citizens can read their own evaluation results
permit(
  principal in User,
  action in [Action::"read", Action::"evaluate"],
  resource in EligibilityResult
) when {
  principal.id == resource.ownerId
};

// Citizens can upload and view their own documents
permit(
  principal in User,
  action in [Action::"upload", Action::"read"],
  resource in Document
) when {
  principal.id == resource.ownerId
};

// Document Agent can process citizen documents inside Firecracker microVM
permit(
  principal == Agent::"document-agent",
  action == Action::"process",
  resource in Sandbox
) when {
  resource.id like "firecracker-*"
};
