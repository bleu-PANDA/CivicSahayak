import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CEDAR_POLICIES = [
  {
    id: "policy-citizen-evaluate",
    description: "Citizens can request eligibility evaluation and read own results",
    effect: "permit",
    principalType: "User",
    actions: ["evaluate", "read"],
    resourceType: "EligibilityResult",
    condition: "principal.id == resource.ownerId"
  },
  {
    id: "policy-citizen-upload",
    description: "Citizens can upload and read their own verification documents",
    effect: "permit",
    principalType: "User",
    actions: ["upload", "read"],
    resourceType: "Document",
    condition: "principal.id == resource.ownerId"
  },
  {
    id: "policy-citizen-checklist",
    description: "Citizens can generate application checklists for schemes",
    effect: "permit",
    principalType: "User",
    actions: ["checklist", "read"],
    resourceType: "Scheme"
  },
  {
    id: "policy-scheme-agent-opensearch",
    description: "Scheme Agent can query the government_schemes knowledge base",
    effect: "permit",
    principalType: "Agent",
    principalId: "scheme-agent",
    actions: ["query"],
    resourceType: "OpenSearch",
    resourceId: "government_schemes"
  },
  {
    id: "policy-document-agent-sandbox",
    description: "Document Agent can invoke Firecracker microVM for document sandboxing",
    effect: "permit",
    principalType: "Agent",
    principalId: "document-agent",
    actions: ["process"],
    resourceType: "Sandbox",
    resourcePrefix: "firecracker-"
  },
  {
    id: "policy-eligibility-corretto",
    description: "Eligibility Agent can invoke the Corretto deterministic rules service",
    effect: "permit",
    principalType: "Agent",
    principalId: "eligibility-agent",
    actions: ["execute"],
    resourceType: "RulesEngine",
    resourceId: "corretto-evaluator"
  }
];

export function loadCedarPoliciesFromDisk() {
  const cedarDir = path.resolve(__dirname, '../../infra/cedar');
  const loadedPolicies = [];
  try {
    if (fs.existsSync(cedarDir)) {
      const files = fs.readdirSync(cedarDir).filter(f => f.endsWith('.cedar'));
      for (const file of files) {
        const filePath = path.join(cedarDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Parse permit blocks
        const blocks = content.split(/permit\s*\(/g).slice(1);
        blocks.forEach((block, idx) => {
          try {
            const body = block.split(/\)\s*(?:when|;)/)[0];
            const whenMatch = block.match(/when\s*\{([^}]+)\}/);
            const condition = whenMatch ? whenMatch[1].trim() : null;

            let principalType = 'User';
            let principalId = null;
            const princMatch = body.match(/principal\s*(?:in|==)\s*([A-Za-z0-9_:]+)(?:::\"([^\"]+)\")?/);
            if (princMatch) {
              principalType = princMatch[1].replace(/Action::|Agent::|User::/, '');
              principalId = princMatch[2] || null;
            }

            const actions = [];
            const actionMatch = body.match(/action\s*(?:in|==)\s*(\[[^\]]+\]|[A-Za-z0-9_:]+::\"[^\"]+\")/);
            if (actionMatch) {
              const actStr = actionMatch[1];
              const acts = actStr.match(/\"([^\"]+)\"/g);
              if (acts) {
                acts.forEach(a => actions.push(a.replace(/\"/g, '')));
              }
            }

            let resourceType = 'General';
            let resourceId = null;
            const resMatch = body.match(/resource\s*(?:in|==)\s*([A-Za-z0-9_:]+)(?:::\"([^\"]+)\")?/);
            if (resMatch) {
              resourceType = resMatch[1].replace(/OpenSearch::|Sandbox::/, '');
              resourceId = resMatch[2] || null;
            }

            loadedPolicies.push({
              id: `${file.replace('.cedar', '')}-policy-${idx + 1}`,
              sourceFile: file,
              effect: 'permit',
              principalType,
              principalId,
              actions: actions.length > 0 ? actions : ['*'],
              resourceType,
              resourceId,
              condition
            });
          } catch (e) {}
        });
      }
    }
  } catch (err) {
    console.warn('[Cedar Loader] Notice:', err.message);
  }
  return loadedPolicies;
}

export function getActiveCedarPolicies() {
  const diskPolicies = loadCedarPoliciesFromDisk();
  return [...CEDAR_POLICIES, ...diskPolicies];
}

/**
 * Evaluates a Cedar authorization request against active policies.
 * @param {Object} context - { principal: { type, id }, action, resource: { type, id, ownerId } }
 * @returns {Object} { decision: 'ALLOW' | 'DENY', matchingPolicyId, diagnostics }
 */
export function authorizeCedar(context) {
  const { principal, action, resource } = context;

  const activePolicies = getActiveCedarPolicies();
  for (const policy of activePolicies) {
    if (policy.effect !== 'permit') continue;

    // Check principal
    if (policy.principalType && principal.type !== policy.principalType) continue;
    if (policy.principalId && principal.id !== policy.principalId) continue;

    // Check action (supporting array of actions or single action)
    const policyActions = policy.actions || (policy.action ? [policy.action] : []);
    if (!policyActions.includes('*') && !policyActions.includes(action)) continue;

    // Check resource
    if (policy.resourceType && resource.type !== policy.resourceType && resource.type !== 'General') continue;
    if (policy.resourceId && resource.id !== policy.resourceId && resource.id !== '*') continue;
    if (policy.resourcePrefix && !resource.id?.startsWith(policy.resourcePrefix)) continue;

    // Check condition (e.g. self-ownership)
    if (policy.condition === 'principal.id == resource.ownerId') {
      if (resource.ownerId && principal.id !== resource.ownerId) {
        continue;
      }
    }

    return {
      decision: 'ALLOW',
      statusCode: 200,
      matchingPolicyId: policy.id,
      timestamp: new Date().toISOString(),
      diagnostics: {
        principal: `${principal.type}::"${principal.id}"`,
        action: `Action::"${action}"`,
        resource: `${resource.type}::"${resource.id || '*'}"`
      }
    };
  }

  return {
    decision: 'DENY',
    statusCode: 403,
    matchingPolicyId: null,
    timestamp: new Date().toISOString(),
    diagnostics: {
      reason: 'No matching permit policy found in Cedar policy store',
      principal: `${principal.type}::"${principal.id}"`,
      action: `Action::"${action}"`,
      resource: `${resource.type}::"${resource.id || '*'}"`
    }
  };
}

export function cedarMiddleware(requiredAction, getResourceInfo) {
  return (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.body.user_id || 'citizen-123';
    const principal = {
      type: req.headers['x-agent-id'] ? 'Agent' : 'User',
      id: req.headers['x-agent-id'] || userId
    };

    const resource = getResourceInfo ? getResourceInfo(req) : { type: 'General', id: '*', ownerId: userId };

    const auth = authorizeCedar({ principal, action: requiredAction, resource });
    if (auth.decision !== 'ALLOW') {
      return res.status(403).json({
        error: 'Cedar Authorization Denied',
        cedarReport: auth
      });
    }

    req.cedarAuth = auth;
    next();
  };
}
