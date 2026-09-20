package org.civicos.model;

public class EvaluationRequest {
    private UserProfile userProfile;
    private SchemeRule scheme;

    public EvaluationRequest() {}

    public UserProfile getUserProfile() { return userProfile; }
    public void setUserProfile(UserProfile userProfile) { this.userProfile = userProfile; }

    public SchemeRule getScheme() { return scheme; }
    public void setScheme(SchemeRule scheme) { this.scheme = scheme; }
}
