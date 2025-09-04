//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.cdi;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.runtime.configuration.ConfigUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class StartupListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StartupListener.class);

    @ConfigProperty(name = "quarkus.datasource.jdbc.url")
    String jdbcUrl;

    @ConfigProperty(name = "quarkus.http.root-path")
    String quarkusRootPath;

    @ConfigProperty(name = "quarkus.http.port")
    String port;

    @ConfigProperty(name = "quarkus.http.cors.origins")
    String corsAllowedOrigins;

    @ConfigProperty(name = "target.origin")
    String targetOrigin;

    @ConfigProperty(name = "quarkus.application.version")
    String version;

    @SuppressWarnings("unused")
    void onStartup(@Observes final StartupEvent ev) {

        LOGGER.info(" ===========> Version {} of the application is starting with profiles {}", version,
                StringUtils.join(ConfigUtils.getProfiles()));

        LOGGER.info(" ===========>  quarkus.http.cors.origins={}", corsAllowedOrigins);
        LOGGER.info(" ===========>  jdbcUrl={}", jdbcUrl);
        LOGGER.info(" ===========>  targetOrigin={}", targetOrigin);
        LOGGER.info(" ===========>  quarkusRootPath={}", quarkusRootPath);
        LOGGER.info(" ===========>  port={}", port);
    }

    public String getJdbcUrl() {
        return jdbcUrl;
    }
}
