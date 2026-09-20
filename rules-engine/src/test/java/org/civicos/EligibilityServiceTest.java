package org.civicos;

import org.civicos.model.*;
import org.civicos.service.EligibilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EligibilityServiceTest {

    private EligibilityService eligibilityService;

    @BeforeEach
    public void setUp() {
        eligibilityService = new EligibilityService();
    }

    @Test
    @DisplayName("UP_SCHOLARSHIP_2024 benchmark test: 21yo UP student with income 250000 should score 92")
    public void testUpScholarship2024StandardInput() {
        UserProfile profile = new UserProfile();
        profile.setAge(21);
        profile.setState("Uttar Pradesh");
        profile.setFamilyIncome(250000.0);
        profile.setEducationLevel("Undergraduate");

        SchemeRule scheme = new SchemeRule();
        scheme.setSchemeCode("UP_SCHOLARSHIP_2024");
        scheme.setIncomeCeiling(250000.0);
        scheme.setAgeMin(17);
        scheme.setAgeMax(25);
        scheme.setRequiredState("Uttar Pradesh");
        scheme.setRequiredEducation("Undergraduate");

        EvaluationResponse response = eligibilityService.evaluate(profile, scheme);

        assertNotNull(response);
        assertEquals(92, response.getEligibilityScore(), "Expected deterministic score of 92");
        assertEquals("ELIGIBLE", response.getStatus());
        assertTrue(response.getCriteriaResults().stream().allMatch(CriterionResult::isPassed), "All demographic criteria must pass");
        assertTrue(response.getMissingDocuments().contains("institution_certificate"), "Should list institution_certificate as missing");
    }

    @Test
    @DisplayName("Edge Case: Borderline income exceeding ceiling by 1 rupee fails income criterion")
    public void testIncomeBoundaryExceeded() {
        UserProfile profile = new UserProfile();
        profile.setAge(21);
        profile.setState("Uttar Pradesh");
        profile.setFamilyIncome(250001.0); // 1 rupee over
        profile.setEducationLevel("Undergraduate");

        SchemeRule scheme = new SchemeRule();
        scheme.setSchemeCode("UP_SCHOLARSHIP_2024");
        scheme.setIncomeCeiling(250000.0);
        scheme.setAgeMin(17);
        scheme.setAgeMax(25);
        scheme.setRequiredState("Uttar Pradesh");
        scheme.setRequiredEducation("Undergraduate");

        EvaluationResponse response = eligibilityService.evaluate(profile, scheme);

        assertNotNull(response);
        CriterionResult incomeRes = response.getCriteriaResults().stream()
                .filter(c -> c.getCriterion().equals("income"))
                .findFirst().orElseThrow();
        assertFalse(incomeRes.isPassed(), "Income criterion must fail when exceeding ceiling");
        assertTrue(response.getEligibilityScore() < 92, "Score should decrease when income criterion fails");
    }

    @Test
    @DisplayName("Edge Case: Age boundary conditions (under minimum and over maximum)")
    public void testAgeBoundaryLimits() {
        UserProfile underAge = new UserProfile();
        underAge.setAge(16); // Below 17
        underAge.setState("Uttar Pradesh");
        underAge.setFamilyIncome(200000.0);
        underAge.setEducationLevel("Undergraduate");

        SchemeRule scheme = new SchemeRule();
        scheme.setSchemeCode("UP_SCHOLARSHIP_2024");
        scheme.setIncomeCeiling(250000.0);
        scheme.setAgeMin(17);
        scheme.setAgeMax(25);
        scheme.setRequiredState("Uttar Pradesh");
        scheme.setRequiredEducation("Undergraduate");

        EvaluationResponse respUnder = eligibilityService.evaluate(underAge, scheme);
        assertFalse(respUnder.getCriteriaResults().stream().filter(c -> c.getCriterion().equals("age")).findFirst().get().isPassed());

        UserProfile overAge = new UserProfile();
        overAge.setAge(26); // Above 25
        overAge.setState("Uttar Pradesh");
        overAge.setFamilyIncome(200000.0);
        overAge.setEducationLevel("Undergraduate");

        EvaluationResponse respOver = eligibilityService.evaluate(overAge, scheme);
        assertFalse(respOver.getCriteriaResults().stream().filter(c -> c.getCriterion().equals("age")).findFirst().get().isPassed());
    }

    @Test
    @DisplayName("Edge Case: State domicile mismatch yields PARTIALLY_ELIGIBLE instead of ELIGIBLE")
    public void testStateMismatch() {
        UserProfile profile = new UserProfile();
        profile.setAge(21);
        profile.setState("Bihar"); // Not UP
        profile.setFamilyIncome(200000.0);
        profile.setEducationLevel("Undergraduate");

        SchemeRule scheme = new SchemeRule();
        scheme.setSchemeCode("UP_SCHOLARSHIP_2024");
        scheme.setIncomeCeiling(250000.0);
        scheme.setAgeMin(17);
        scheme.setAgeMax(25);
        scheme.setRequiredState("Uttar Pradesh");
        scheme.setRequiredEducation("Undergraduate");

        EvaluationResponse response = eligibilityService.evaluate(profile, scheme);
        assertFalse(response.getCriteriaResults().stream().filter(c -> c.getCriterion().equals("state")).findFirst().get().isPassed());
        assertNotEquals("ELIGIBLE", response.getStatus(), "State mismatch must not return ELIGIBLE");
        assertEquals("PARTIALLY_ELIGIBLE", response.getStatus());
    }

    @Test
    @DisplayName("Dynamic documents: Verified documents remove items from missingDocs")
    public void testDynamicDocuments() {
        UserProfile profile = new UserProfile();
        profile.setAge(21);
        profile.setState("Uttar Pradesh");
        profile.setFamilyIncome(200000.0);
        profile.setEducationLevel("Undergraduate");
        profile.setVerifiedDocuments(java.util.List.of("aadhaar_card", "income_certificate"));

        SchemeRule scheme = new SchemeRule();
        scheme.setSchemeCode("UP_SCHOLARSHIP_2024");
        scheme.setIncomeCeiling(250000.0);
        scheme.setAgeMin(17);
        scheme.setAgeMax(25);
        scheme.setRequiredState("Uttar Pradesh");
        scheme.setRequiredEducation("Undergraduate");
        scheme.setRequiredDocuments(java.util.List.of("aadhaar_card", "income_certificate", "institution_certificate"));

        EvaluationResponse response = eligibilityService.evaluate(profile, scheme);
        assertEquals(1, response.getMissingDocuments().size());
        assertTrue(response.getMissingDocuments().contains("institution_certificate"));
        assertFalse(response.getMissingDocuments().contains("aadhaar_card"));
    }
}
