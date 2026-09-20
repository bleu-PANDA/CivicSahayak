/**
 * Cedar Policy Middleware (Amazon Cedar PBAC Engine)
 * Enforces least privilege across citizen data, agent tools, and Firecracker sandboxes.
 */

import { authorizeCedar } from '../../services/cedarAuth.js';

export function cedarAuthMiddleware(action, resourceType) {
  return (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.body.user_id || 'citizen-123';
    const agentId = req.headers['x-agent-id'];

    const principal = agentId
      ? { type: 'Agent', id: agentId }
      : { type: 'User', id: userId };

    const resource = {
      type: resourceType || 'General',
      id: req.params.id || req.body.scheme_id || req.body.document_type || '*',
      ownerId: req.body.user_id || userId
    };

    // Evaluate against Cedar policies
    const authVerdict = authorizeCedar({ principal, action, resource });

    if (authVerdict.decision !== 'ALLOW') {
      return res.status(403).json({
        error: 'Cedar Authorization Denied',
        message: 'Principal does not have authorization to perform this action under active Cedar policies',
        diagnostics: authVerdict.diagnostics
      });
    }

    req.cedarAuth = authVerdict;
    next();
  };
}

export default cedarAuthMiddleware;
