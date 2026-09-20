package org.civicos.model;

import java.util.List;

public class EvaluationResponse {
    private int eligibilityScore;
    private List<CriterionResult> criteriaResults;
    private List<String> missingDocuments;
    private String status;

    public EvaluationResponse() {}

    public EvaluationResponse(int eligibilityScore, List<CriterionResult> criteriaResults, List<String> missingDocuments, String status) {
        this.eligibilityScore = eligibilityScore;
        this.criteriaResults = criteriaResults;
        this.missingDocuments = missingDocuments;
        this.status = status;
    }

    public int getEligibilityScore() { return eligibilityScore; }
    public void setEligibilityScore(int eligibilityScore) { this.eligibilityScore = eligibilityScore; }

    public List<CriterionResult> getCriteriaResults() { return criteriaResults; }
    public void setCriteriaResults(List<CriterionResult> criteriaResults) { this.criteriaResults = criteriaResults; }

    public List<String> getMissingDocuments() { return missingDocuments; }
    public void setMissingDocuments(List<String> missingDocuments) { this.missingDocuments = missingDocuments; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
