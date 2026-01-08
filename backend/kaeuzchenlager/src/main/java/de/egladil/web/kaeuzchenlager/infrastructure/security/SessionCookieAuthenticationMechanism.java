// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.identity.IdentityProviderManager;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.vertx.http.runtime.security.ChallengeData;
import io.quarkus.vertx.http.runtime.security.HttpAuthenticationMechanism;

import io.smallrye.mutiny.Uni;

import de.egladil.web.kaeuzchenlager.domain.auth.config.SessionCookieConfig;
import de.egladil.web.kaeuzchenlager.domain.auth.session.Session;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;

import io.vertx.ext.web.RoutingContext;

@ApplicationScoped
public class SessionCookieAuthenticationMechanism implements HttpAuthenticationMechanism {

    @Inject
    SessionCookieConfig sessionCookieConfig;

    @Inject
    SessionService sessionService;

    @Override
    public Uni<SecurityIdentity> authenticate(RoutingContext context, IdentityProviderManager identityProviderManager) {

        final String cookieName = sessionCookieConfig.name();
        final String sessionId = (context.request().getCookie(cookieName) != null)
                ? context.request().getCookie(cookieName).getValue() : null;

        Session session = sessionService.getAndRefreshSessionIfValid(sessionId);

        if (session == null || session.getAuthenticatedUser() == null) {
            // Keine Session => unauthenticated; @Authenticated liefert dann 401/403 je nach
            // Quarkus-Config
            return Uni.createFrom().nullItem();
        }

        return identityProviderManager.authenticate(new SessionAuthenticationRequest(sessionId));
    }

    @Override
    public Uni<ChallengeData> getChallenge(RoutingContext context) {
        // Cookie-basierte Session => i.d.R. 401 ohne WWW-Authenticate
        return Uni.createFrom().item(new ChallengeData(401, null, null));
    }
}
