// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.clientauth;

import jakarta.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class OAuthClientCredentialsProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(OAuthClientCredentialsProvider.class);

    @ConfigProperty(name = "public-client-id")
    String publicClientId;

    @ConfigProperty(name = "public-client-secret")
    String publicClientSecret;

    /**
     * @param nonce String, darf manchmal null sein.
     * @return
     */
    public OAuthClientCredentials getClientCredentials(final String nonce) {
        return OAuthClientCredentials.create(publicClientId, publicClientSecret, nonce);
    }

}
