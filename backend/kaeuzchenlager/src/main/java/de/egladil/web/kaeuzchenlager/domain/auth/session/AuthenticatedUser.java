// =====================================================
// Project: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================
package de.egladil.web.kaeuzchenlager.domain.auth.session;

import java.util.Objects;

import io.quarkus.security.runtime.QuarkusPrincipal;

import org.apache.commons.lang3.StringUtils;

/**
 * AuthenticatedUser
 */
public class AuthenticatedUser extends QuarkusPrincipal {

    private String uuid; // subject

    private String fullName; // claim full_name

    private String idReference; // wie bisher generiert

    private String[] roles;

    public AuthenticatedUser(String uuid) {
        super(uuid);
        this.uuid = uuid;
    }

    @Override
    public String toString() {
        return "AuthenticatedUser [uuid=" + StringUtils.abbreviate(getName(), 11) + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        AuthenticatedUser that = (AuthenticatedUser) o;
        return Objects.equals(uuid, that.uuid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), uuid);
    }

    @Override
    public String getName() {
        return this.uuid;
    }

    public String getUuid() {
        return uuid;
    }

    public AuthenticatedUser withUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public String getFullName() {
        return fullName;
    }

    public AuthenticatedUser withFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public String getIdReference() {
        return idReference;
    }

    public AuthenticatedUser withIdReference(String idReference) {
        this.idReference = idReference;
        return this;
    }

    public String[] getRoles() {
        return roles;
    }

    public AuthenticatedUser withRoles(String[] roles) {
        this.roles = roles;
        return this;
    }
}
