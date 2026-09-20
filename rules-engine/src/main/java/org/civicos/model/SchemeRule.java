package org.civicos.model;

public class SchemeRule {
    private String schemeCode;
    private Double incomeCeiling;
    private Integer ageMin;
    private Integer ageMax;
    private String requiredState;
    private String requiredEducation;

    public SchemeRule() {}

    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }

    public Double getIncomeCeiling() { return incomeCeiling; }
    public void setIncomeCeiling(Double incomeCeiling) { this.incomeCeiling = incomeCeiling; }

    public Integer getAgeMin() { return ageMin; }
    public void setAgeMin(Integer ageMin) { this.ageMin = ageMin; }

    public Integer getAgeMax() { return ageMax; }
    public void setAgeMax(Integer ageMax) { this.ageMax = ageMax; }

    public String getRequiredState() { return requiredState; }
    public void setRequiredState(String requiredState) { this.requiredState = requiredState; }

    public String getRequiredEducation() { return requiredEducation; }
    public void setRequiredEducation(String requiredEducation) { this.requiredEducation = requiredEducation; }
}
