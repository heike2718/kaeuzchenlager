//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.filters;

import de.egladil.web.kaeuzchenlager.domain.auth.config.SessionCookieConfig;
import de.egladil.web.kaeuzchenlager.domain.auth.session.AuthenticatedUser;
import de.egladil.web.kaeuzchenlager.domain.auth.session.AuthenticationContextImpl;
import de.egladil.web.kaeuzchenlager.domain.auth.session.Session;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionService;
import de.egladil.web.kaeuzchenlager.domain.auth.session.SessionUtils;
import de.egladil.web.kaeuzchenlager.domain.exception.KaeuzchenlagerRuntimeException;
import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
@Provider
@PreMatching
@Priority(Priorities.AUTHORIZATION)
public class InitSecurityContextFilter implements ContainerRequestFilter {

  private static final String OPTIONS = "OPTIONS";

  private static List<String> OPEN_DATA_PATHS = Arrays.asList(new String[] { "/kaeuzchenlager/api/version" });

  private static final Logger LOGGER = LoggerFactory.getLogger(InitSecurityContextFilter.class);

  @Inject
  SessionCookieConfig sessionCookieConfig;

  @Inject
  SessionService sessionService;

  @Inject
  AuthenticationContextImpl authCtx; // Injecting the implementation, not the interface!!!

  @Override
  public void filter(final ContainerRequestContext requestContext) {

    // https://quarkus.io/guides/context-propagation
    String method = requestContext.getMethod();

    if (OPTIONS.equals(method)) {
      LOGGER.debug("kein auth bei {}", method);
      return ;
    }

    String path = requestContext.getUriInfo().getPath();

    boolean noSessionRequired = this.noSessionRequired(path);

    LOGGER.debug("path={}, noSessionRequired={}", path, noSessionRequired);

    if (noSessionRequired) {

      this.addUserToAuthAndSecurityContext(SessionUtils.createAnonymousUser(), requestContext);
      return;
    }

    try {

      String sessionId = SessionUtils.getSessionId(requestContext, sessionCookieConfig);

      LOGGER.debug("path={}, sessionId={}", path, sessionId);

      if (sessionId != null) {

        Session session = sessionService.getAndRefreshSessionIfValid(sessionId);

        if (session != null) {

          AuthenticatedUser user = session.getUser();

          if (user != null) {

            addUserToAuthAndSecurityContext(user, requestContext);
          } else {

            LOGGER.warn("path={}, user ist null, die Anwendung wird nicht funktionieren!", path);
          }

        }
      }
    } catch (Exception e) {

      LOGGER.error("{}: {}", path, e.getMessage(), e);
      throw new KaeuzchenlagerRuntimeException("Unerwarterer Fehler bei Request " + method + " path=" + path);
    }

  }

  /**
   * @param requestContext
   */
  private void addUserToAuthAndSecurityContext(final AuthenticatedUser user, final ContainerRequestContext requestContext) {

    authCtx.setUser(user);

    requestContext.setSecurityContext(new SecurityContext() {

      @Override
      public boolean isUserInRole(final String role) {

        return true;
      }

      @Override
      public boolean isSecure() {

        return true;
      }

      @Override
      public Principal getUserPrincipal() {

        return new Principal() {

          @Override
          public String getName() {

            return user.getUuid();
          }
        };
      }

      @Override
      public String getAuthenticationScheme() {

        return null;
      }
    });

    LOGGER.debug("user {} added to AuthenticationContext and SecurityContext", user);

  }


  boolean noSessionRequired(final String path) {

    return OPEN_DATA_PATHS.stream().filter(p -> path.startsWith(p)).findFirst().isPresent();

  }


}
