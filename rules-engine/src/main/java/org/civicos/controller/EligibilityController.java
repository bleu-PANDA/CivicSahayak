package org.civicos.controller;

import org.civicos.model.EvaluationRequest;
import org.civicos.model.EvaluationResponse;
import org.civicos.service.EligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    @Autowired
    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/evaluate-eligibility")
    public ResponseEntity<EvaluationResponse> evaluateEligibility(@RequestBody EvaluationRequest request) {
        if (request.getUserProfile() == null || request.getScheme() == null) {
            return ResponseEntity.badRequest().build();
        }
        EvaluationResponse response = eligibilityService.evaluate(request.getUserProfile(), request.getScheme());
        return ResponseEntity.ok(response);
    }
}
