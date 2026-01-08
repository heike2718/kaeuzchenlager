// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.clientauth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class OAuthClientCredentials {

    @NotBlank
    @Pattern(regexp = "[a-zA-Z0-9+=]*")
    @Size(max = 50)
    private String clientId;

    @NotBlank
    @Pattern(regexp = "[a-zA-Z0-9+=]*")
    @Size(max = 50)
    private String clientSecret;

    @Pattern(regexp = "^[a-zA-Z0-9\\-]*$")
    @Size(max = 36)
    private String nonce;

    public static OAuthClientCredentials create(final String clientId, final String clientSecret, final String nonce) {

        OAuthClientCredentials result = new OAuthClientCredentials();
        result.clientId = clientId.trim();
        result.clientSecret = clientSecret.trim();
        result.nonce = nonce != null ? nonce.trim() : null;
        return result;

    }

    public String getClientId() {

        return clientId;
    }

    public String getClientSecret() {

        return clientSecret;
    }

    public String getNonce() {

        return nonce;
    }

    public void clean() {

        clientId = SecUtils.wipe(clientId);
        clientSecret = SecUtils.wipe(clientSecret);
    }

}
