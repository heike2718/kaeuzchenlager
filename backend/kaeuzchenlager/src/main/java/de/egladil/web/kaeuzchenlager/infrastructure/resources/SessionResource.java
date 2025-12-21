//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.auth.dto.AuthResult;
import de.egladil.web.kaeuzchenlager.domain.auth.dto.MessagePayload;
import de.egladil.web.kaeuzchenlager.domain.auth.login.AuthproviderUrlService;
import de.egladil.web.kaeuzchenlager.domain.auth.login.LoginLogoutService;
import de.egladil.web.kaeuzchenlager.domain.auth.session.Session;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;
import de.egladil.web.kaeuzchenlager.domain.core.AppMessage;
import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@RequestScoped
@Path("api/session")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON + ";charset=UTF-8")
@Tag(name = "SessionResource")
public class SessionResource {

  @Inject
  AuthproviderUrlService authproviderUrlService;

  @Inject
  LoginLogoutService loginLogoutService;

  @Inject
  SessionService sessionServive;

  @GET
  @Path("authurls/login")
  @PermitAll
  @Operation(operationId = "getLoginUrl", summary = "Gibt die Login-URL zurück, mit der eine Anwendung zum authprovider redirecten kann")
  @APIResponse(name = "GetLoginUrlOKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AppMessage.class)))
  public Response getLoginUrl() {

    return this.authproviderUrlService.getLoginUrl();

  }

  @GET
  @Authenticated
  @Operation(operationId = "reloadSession", summary = "Läd die Session neu - für F5 im FE")
  @APIResponse(name = "GetLoginUrlOKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AppMessage.class)))
  public Response reloadSession() {

    return Response.ok(this.sessionServive.reloadSession()).build();

  }

  @POST
  @Path("login")
  @PermitAll // an der Stelle will man sich ja erstmal eine Session holen
  @Operation(operationId = "login", summary = "Erzeugt eine Session anhand des per S2S-Kommunikation für das 'one time token' beim authprovider gekauften JWT und packt die SessionId in ein Cookie")
  @APIResponse(name = "GetLoginUrlOKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Session.class)))
  public Response login(final AuthResult authResult) {

    return loginLogoutService.login(authResult);
  }

  @DELETE
  @Path("logout")
  @PermitAll
  @Operation(operationId = "logout", summary = "entfernt die Session")
  @APIResponse(name = "GetLoginUrlOKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessagePayload.class)))
  public Response logout(@CookieParam(value = "JSESSIONID")
  final String sessionId) {

    return loginLogoutService.logout(sessionId);
  }

}
