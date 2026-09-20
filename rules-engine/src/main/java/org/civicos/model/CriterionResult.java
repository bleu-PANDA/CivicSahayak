package org.civicos.model;

public class CriterionResult {
    private String criterion;
    private boolean passed;
    private int weight;
    private String detail;

    public CriterionResult() {}

    public CriterionResult(String criterion, boolean passed, int weight, String detail) {
        this.criterion = criterion;
        this.passed = passed;
        this.weight = weight;
        this.detail = detail;
    }

    public String getCriterion() { return criterion; }
    public void setCriterion(String criterion) { this.criterion = criterion; }

    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }

    public int getWeight() { return weight; }
    public void setWeight(int weight) { this.weight = weight; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
