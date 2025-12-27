//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.clientauth;

import de.egladil.web.kaeuzchenlager.domain.auth.dto.ResponsePayload;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import de.egladil.web.kaeuzchenlager.infrastructure.restclient.AuthproviderRestClient;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.ProcessingException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.RestClientDefinitionException;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class InitAccessTokenDelegate {

  private static final Logger LOGGER = LoggerFactory.getLogger(InitAccessTokenDelegate.class);

  @Inject
  @RestClient
  AuthproviderRestClient authproviderRestClient;

  public ResponsePayload authenticateClient(final OAuthClientCredentials credentials) {

    try (Response authResponse = authproviderRestClient.authenticateClient(credentials);) {

      ResponsePayload responsePayload = authResponse.readEntity(ResponsePayload.class);

      return responsePayload;
    } catch (IllegalStateException | RestClientDefinitionException | WebApplicationException |
             ProcessingException e) {

      String msg = "Unerwarteter Fehler beim Anfordern eines client-accessTokens: " + e.getMessage();
      LOGGER.error(msg, e);

      throw new KaeuzchenlagerRuntimeException(msg, e);
    }
  }

}
