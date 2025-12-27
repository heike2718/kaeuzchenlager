//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.restclient;

import de.egladil.web.kaeuzchenlager.domain.auth.clientauth.OAuthClientCredentials;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.temporal.ChronoUnit;
import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(configKey = "authprovider")
@Path("api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface AuthproviderRestClient {

  @POST
  @Path("clients/client/accesstoken")
  @Retry(maxRetries = 3, delay = 1000)
  @Timeout(value = 10, unit = ChronoUnit.SECONDS)
  Response authenticateClient(OAuthClientCredentials clientSecrets);

  @PUT
  @Path("token/exchange/{oneTimeToken}")
  @Retry(maxRetries = 3, delay = 1000)
  @Timeout(value = 10, unit = ChronoUnit.SECONDS)
  public Response exchangeOneTimeTokenWithJwt(@PathParam(value = "oneTimeToken")
  final String oneTimeToken, final OAuthClientCredentials clientCredentials);
}
