// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.auth.login;

import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.apache.commons.lang3.StringUtils;

import de.egladil.web.kaeuzchenlager.domain.auth.clientauth.ClientAccessTokenService;
import de.egladil.web.kaeuzchenlager.domain.core.AppMessage;

@RequestScoped
public class AuthproviderUrlService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthproviderUrlService.class);

    @ConfigProperty(name = "auth-app.url")
    String authAppUrl;

    @ConfigProperty(name = "public-redirect-url")
    String publicRedirectUrl;

    @Inject
    ClientAccessTokenService clientAccessTokenService;

    public Response getLoginUrl() {

        // hierher ausgelagert, damit ClientAccessTokenService testbar wird.
        String nonce = UUID.randomUUID().toString();
        String accessToken = clientAccessTokenService.orderAccessToken(nonce);

        if (StringUtils.isBlank(accessToken)) {

            return Response.serverError().entity("Fehler beim Authentisieren des Clients").build();
        }

        String redirectUrl = authAppUrl + "login?accessToken=" + accessToken + "&state=login&redirectUrl="
                + publicRedirectUrl;

        LOGGER.info(redirectUrl);

        return Response.ok(AppMessage.builder().text(redirectUrl).type("info").build()).build();
    }

}
