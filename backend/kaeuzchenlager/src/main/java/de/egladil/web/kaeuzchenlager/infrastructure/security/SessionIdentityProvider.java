package de.egladil.web.kaeuzchenlager.infrastructure.security;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.security.AuthenticationFailedException;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.IdentityProvider;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;

import io.smallrye.mutiny.Uni;

import de.egladil.web.kaeuzchenlager.domain.auth.session.AuthenticatedUser;
import de.egladil.web.kaeuzchenlager.domain.auth.session.Session;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionUtils;

@ApplicationScoped
public class SessionIdentityProvider implements IdentityProvider<SessionAuthenticationRequest> {

    @Inject
    SessionService sessionService;

    @Override
    public Class<SessionAuthenticationRequest> getRequestType() {
        return SessionAuthenticationRequest.class;
    }

    @Override
    public Uni<SecurityIdentity> authenticate(SessionAuthenticationRequest request,
            AuthenticationRequestContext context) {
        return Uni.createFrom().item(() -> {
            final Session session = sessionService.getAndRefreshSessionIfValid(request.sessionId());
            if (session == null || session.getAuthenticatedUser() == null) {
                throw new AuthenticationFailedException();
            }

            final AuthenticatedUser user = session.getAuthenticatedUser();

            final QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity
                    .builder()
                    .setPrincipal(user)
                    .addAttribute(SessionUtils.SESSION_ID_ATTRIBUTE_NAME, request.sessionId());

            final String[] roles = user.getRoles();
            if (roles != null) {
                for (String role : roles) {
                    if (role != null && !role.isBlank()) {
                        builder.addRole(role);
                    }
                }
            }

            return builder.build();
        });
    }
}
