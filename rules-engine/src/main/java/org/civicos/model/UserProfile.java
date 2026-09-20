package org.civicos.model;

public class UserProfile {
    private int age;
    private String state;
    private double familyIncome;
    private String educationLevel;
    private String occupation;
    private java.util.List<String> verifiedDocuments = new java.util.ArrayList<>();

    public UserProfile() {}

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public double getFamilyIncome() { return familyIncome; }
    public void setFamilyIncome(double familyIncome) { this.familyIncome = familyIncome; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public java.util.List<String> getVerifiedDocuments() { return verifiedDocuments; }
    public void setVerifiedDocuments(java.util.List<String> verifiedDocuments) { this.verifiedDocuments = verifiedDocuments != null ? verifiedDocuments : new java.util.ArrayList<>(); }
}
