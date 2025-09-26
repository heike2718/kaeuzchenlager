// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

/** OpenApiConstants für die OpenAPI-Annotationen. */
public final class OpenApiConstants {

  public static final String API_VERSION_MF =
      "API-Version wird nicht unterstützt. Bitte Header API-Version prüfen."
          + " Unterstützte Versionen: {0}";

  public static final String HEADER_API_VERSION = "API-Version";

  public static final String HEADER_API_VERSION_DESCRIPTION = "Version dieser API";

  public static final String OK_OUTCOME = "OK";
  public static final String OK_STATUS = "200";

  public static final String CREATED_OUTCOME = "Created";
  public static final String CREATED_STATUS = "201";

  public static final String BAD_REQUEST_ERROR = "BadRequest";
  public static final String BAD_REQUEST_DESC = "Payload besteht die Input-Validierung nicht";
  public static final String BAD_REQUEST_STATUS = "400";

  public static final String NOT_AUTHORIZED_ERROR = "NotAuthorized";
  public static final String NOT_AUTHORIZED_DESC =
      "nur authentifizierte und autorisierte User dürfen diese API aufrufen";
  public static final String NOT_AUTHORIZED_STATUS = "401";

  public static final String METHOD_NOT_ALLOWED_ERROR = "MethodNotAllowed";
  public static final String METHOD_NOT_ALLOWED_DESC = "wenn die uuid im path fehlt";
  public static final String METHOD_NOT_ALLOWED_STATUS = "405";

  public static final String NOT_ACCEPTABLE_ERROR = "NotAcceptable";
  public static final String NOT_ACCEPTABLE_DESC =
      "die im API-Version-Header genannte Version wird nicht unterstützt";
  public static final String NOT_ACCEPTABLE_STATUS = "406";

  public static final String CONFLICT_ERROR = "Conflict";
  public static final String CONFLICT_DESC =
      "das Ergebnis des Request würde zu einem Konflikt führen";
  public static final String CONFLICT_STATUS = "409";

  public static final String PRECONDITION_FAILED_ERROR = "PreconditionFailed";
  public static final String PRECONDITION_FAILED_STATUS = "412";

  public static final String SERVER_ERROR = "ServerError";
  public static final String SERVER_ERROR_DESC = "server error";
  public static final String SERVER_ERROR_STATUS = "500";

  public static final String JSON_MEDIA_TYPE = "application/json";
}
