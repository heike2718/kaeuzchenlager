// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.clientauth;

import java.util.Map;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.egladil.web.kaeuzchenlager.domain.auth.dto.MessagePayload;
import de.egladil.web.kaeuzchenlager.domain.auth.dto.ResponsePayload;
import de.egladil.web.kaeuzchenlager.domain.exception.ClientAuthException;

@RequestScoped
public class ClientAccessTokenService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ClientAccessTokenService.class);

    @Inject
    OAuthClientCredentialsProvider clientCredentialsProvider;

    @Inject
    InitAccessTokenDelegate initAccessTokenDelegate;

    public String orderAccessToken(final String nonce) {

        OAuthClientCredentials credentials = clientCredentialsProvider.getClientCredentials(nonce);

        ResponsePayload responsePayload = initAccessTokenDelegate.authenticateClient(credentials);
        MessagePayload messagePayload = responsePayload.getMessage();

        LOGGER.debug(messagePayload.toString() + " isOK? " + messagePayload.isOk());

        if (!messagePayload.isOk()) {

            LOGGER
                    .error("Authentisierung des Clients hat nicht geklappt: {} - {}", messagePayload.getLevel(),
                            messagePayload.getMessage());
            throw new ClientAuthException();
        }

        @SuppressWarnings("unchecked")
        Map<String, String> dataMap = (Map<String, String>) responsePayload.getData();

        String nonceFromResponse = dataMap.get("nonce");

        if (!nonce.equals(nonceFromResponse)) {

            String msg = "Security Thread: zurückgesendetes nonce stimmt nicht: erwarten '" + nonce + "' aktuell: '"
                    + nonceFromResponse + "'";

            LOGGER.warn(msg);
            throw new ClientAuthException();
        }

        String accessToken = dataMap.get("accessToken");

        return accessToken;
    }

}
