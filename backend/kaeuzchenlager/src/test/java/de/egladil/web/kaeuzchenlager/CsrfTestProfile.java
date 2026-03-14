package de.egladil.web.kaeuzchenlager;

import java.util.Map;

import io.quarkus.test.junit.QuarkusTestProfile;

public class CsrfTestProfile implements QuarkusTestProfile {

    @Override
    public Map<String, String> getConfigOverrides() {
        return Map.of("csrf.validation.enabled", "true");
    }

}
