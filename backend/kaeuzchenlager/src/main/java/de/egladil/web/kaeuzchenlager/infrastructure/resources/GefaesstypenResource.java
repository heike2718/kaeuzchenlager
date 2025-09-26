// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.UnsupportedVersionException;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypService;
import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import java.text.MessageFormat;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.ParameterIn;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

/** The type Gefaesstypen resource. */
@Path("api/gefaesstypen")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Gefaesstypen")
public class GefaesstypenResource {

  public static final String UNUSED = "unused";
  private static final String LOAD_GEFAESSTYPEN = "loadGefaesstypen";
  private static final String GEFAESSTYP_ANLEGEN = "gefaesstypAnlegen";
  private static final String GEFAESSTYP_LOESCHEN = "gefaesstypLoeschen";
  private static final String GEFAESSTYP_AENDERN = "gefaesstypAendern";
  private static final String PRECONDITION_FAILED_DESC =
      "Gefäßtyp zwischenzeitlich durch jemand anderen geändert";
  public static final int INT_1 = 1;
  public static final String STRING_1 = "1";

  /** The Gefaesstyp service. */
  @Inject GefaesstypService gefaesstypService;

  /**
   * Load gefaesstypen response.
   *
   * @param apiVersion the api version
   * @return the response
   */
  @SuppressWarnings(UNUSED)
  @GET
  @Operation(operationId = LOAD_GEFAESSTYPEN, summary = "Gibt alle Gefaesstypen zurück.")
  @Parameters({
    @Parameter(
        in = ParameterIn.HEADER,
        name = OpenApiConstants.HEADER_API_VERSION,
        description = OpenApiConstants.HEADER_API_VERSION_DESCRIPTION),
  })
  @APIResponse(
      name = OpenApiConstants.OK_OUTCOME,
      responseCode = OpenApiConstants.OK_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_AUTHORIZED_ERROR,
      responseCode = OpenApiConstants.NOT_AUTHORIZED_STATUS,
      description = OpenApiConstants.NOT_AUTHORIZED_DESC,
      content = @Content(mediaType = OpenApiConstants.JSON_MEDIA_TYPE))
  @APIResponse(
      name = OpenApiConstants.NOT_ACCEPTABLE_ERROR,
      responseCode = OpenApiConstants.NOT_ACCEPTABLE_STATUS,
      description = OpenApiConstants.NOT_ACCEPTABLE_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.SERVER_ERROR,
      description = OpenApiConstants.SERVER_ERROR_DESC,
      responseCode = OpenApiConstants.SERVER_ERROR_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  public Response loadGefaesstypen(
      @HeaderParam(OpenApiConstants.HEADER_API_VERSION) final int apiVersion) {

    if (apiVersion != INT_1) {
      throw new UnsupportedVersionException(
          MessageFormat.format(OpenApiConstants.API_VERSION_MF, STRING_1));
    }
    return Response.ok(gefaesstypService.loadGefaesstypen()).build();
  }

  /**
   * Gefaesstyp anlegen response.
   *
   * @param apiVersion the api version
   * @param daten the daten
   * @return the response
   */
  @SuppressWarnings(UNUSED)
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Operation(operationId = GEFAESSTYP_ANLEGEN, summary = "Legt einen neuen Gefäßtyp an.")
  @Parameters({
    @Parameter(
        in = ParameterIn.HEADER,
        name = OpenApiConstants.HEADER_API_VERSION,
        description = OpenApiConstants.HEADER_API_VERSION_DESCRIPTION),
  })
  @APIResponse(
      name = OpenApiConstants.CREATED_OUTCOME,
      responseCode = OpenApiConstants.CREATED_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
  @APIResponse(
      name = OpenApiConstants.BAD_REQUEST_ERROR,
      responseCode = OpenApiConstants.BAD_REQUEST_STATUS,
      description = OpenApiConstants.BAD_REQUEST_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_AUTHORIZED_ERROR,
      responseCode = OpenApiConstants.NOT_AUTHORIZED_STATUS,
      description = OpenApiConstants.NOT_AUTHORIZED_DESC,
      content = @Content(mediaType = OpenApiConstants.JSON_MEDIA_TYPE))
  @APIResponse(
      name = OpenApiConstants.NOT_ACCEPTABLE_ERROR,
      responseCode = OpenApiConstants.NOT_ACCEPTABLE_STATUS,
      description = OpenApiConstants.NOT_ACCEPTABLE_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.CONFLICT_ERROR,
      responseCode = OpenApiConstants.CONFLICT_STATUS,
      description = OpenApiConstants.CONFLICT_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.SERVER_ERROR,
      description = OpenApiConstants.SERVER_ERROR_DESC,
      responseCode = OpenApiConstants.SERVER_ERROR_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  public Response gefaesstypAnlegen(
      @HeaderParam(OpenApiConstants.HEADER_API_VERSION) final int apiVersion,
      @Valid final GefaesstypDaten daten) {

    if (apiVersion != INT_1) {
      throw new UnsupportedVersionException(
          MessageFormat.format(OpenApiConstants.API_VERSION_MF, STRING_1));
    }

    final GefaesstypDto responsePayload = gefaesstypService.gefaesstypAnlegen(daten);
    return Response.status(Status.CREATED).entity(responsePayload).build();
  }

  /**
   * Gefaesstyp aendern response.
   *
   * @param apiVersion the api version
   * @param uuid the uuid
   * @param daten the daten
   * @return the response
   */
  @SuppressWarnings(UNUSED)
  @PUT
  @Path("{uuid}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Operation(operationId = GEFAESSTYP_AENDERN, summary = "Ändert einen Gefäßtyp.")
  @Parameters({
    @Parameter(
        in = ParameterIn.HEADER,
        name = OpenApiConstants.HEADER_API_VERSION,
        description = OpenApiConstants.HEADER_API_VERSION_DESCRIPTION),
  })
  @APIResponse(
      name = OpenApiConstants.OK_OUTCOME,
      responseCode = OpenApiConstants.OK_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
  @APIResponse(
      name = OpenApiConstants.BAD_REQUEST_ERROR,
      responseCode = OpenApiConstants.BAD_REQUEST_STATUS,
      description = OpenApiConstants.BAD_REQUEST_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_AUTHORIZED_ERROR,
      responseCode = OpenApiConstants.NOT_AUTHORIZED_STATUS,
      description = OpenApiConstants.NOT_AUTHORIZED_DESC,
      content = @Content(mediaType = OpenApiConstants.JSON_MEDIA_TYPE))
  @APIResponse(
      name = OpenApiConstants.METHOD_NOT_ALLOWED_ERROR,
      responseCode = OpenApiConstants.METHOD_NOT_ALLOWED_STATUS,
      description = OpenApiConstants.METHOD_NOT_ALLOWED_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_ACCEPTABLE_ERROR,
      responseCode = OpenApiConstants.NOT_ACCEPTABLE_STATUS,
      description = OpenApiConstants.NOT_ACCEPTABLE_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.CONFLICT_ERROR,
      responseCode = OpenApiConstants.CONFLICT_STATUS,
      description = OpenApiConstants.CONFLICT_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.PRECONDITION_FAILED_ERROR,
      responseCode = OpenApiConstants.PRECONDITION_FAILED_STATUS,
      description = PRECONDITION_FAILED_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.SERVER_ERROR,
      description = OpenApiConstants.SERVER_ERROR_DESC,
      responseCode = OpenApiConstants.SERVER_ERROR_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  public Response gefaesstypAendern(
      @HeaderParam(OpenApiConstants.HEADER_API_VERSION) final int apiVersion,
      @PathParam("uuid")
          @Pattern(
              regexp = ValidationPatternsAndMessages.TECHNISCHE_ID,
              message = "uuid ist keine UUID.")
          final String uuid,
      @Valid final GefaesstypDaten daten) {

    if (apiVersion != INT_1) {
      throw new UnsupportedVersionException(
          MessageFormat.format(OpenApiConstants.API_VERSION_MF, STRING_1));
    }

    final GefaesstypDto responsePayload = gefaesstypService.gefaesstypAendern(uuid, daten);

    return Response.status(Status.OK).entity(responsePayload).build();
  }

  /**
   * Gefaesstyp loeschen response.
   *
   * @param apiVersion the api version
   * @param uuid the uuid
   * @return the response
   */
  @SuppressWarnings(UNUSED)
  @DELETE
  @Path("{uuid}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Operation(operationId = GEFAESSTYP_LOESCHEN, summary = "Löscht einen Gefäßtyp.")
  @Parameters({
    @Parameter(
        in = ParameterIn.HEADER,
        name = OpenApiConstants.HEADER_API_VERSION,
        description = OpenApiConstants.HEADER_API_VERSION_DESCRIPTION),
  })
  @APIResponse(
      name = OpenApiConstants.OK_OUTCOME,
      responseCode = OpenApiConstants.OK_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
  @APIResponse(
      name = OpenApiConstants.BAD_REQUEST_ERROR,
      responseCode = OpenApiConstants.BAD_REQUEST_STATUS,
      description = OpenApiConstants.BAD_REQUEST_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_AUTHORIZED_ERROR,
      responseCode = OpenApiConstants.NOT_AUTHORIZED_STATUS,
      description = OpenApiConstants.NOT_AUTHORIZED_DESC,
      content = @Content(mediaType = OpenApiConstants.JSON_MEDIA_TYPE))
  @APIResponse(
      name = OpenApiConstants.METHOD_NOT_ALLOWED_ERROR,
      responseCode = OpenApiConstants.METHOD_NOT_ALLOWED_STATUS,
      description = OpenApiConstants.METHOD_NOT_ALLOWED_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.NOT_ACCEPTABLE_ERROR,
      responseCode = OpenApiConstants.NOT_ACCEPTABLE_STATUS,
      description = OpenApiConstants.NOT_ACCEPTABLE_DESC,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  @APIResponse(
      name = OpenApiConstants.SERVER_ERROR,
      description = OpenApiConstants.SERVER_ERROR_DESC,
      responseCode = OpenApiConstants.SERVER_ERROR_STATUS,
      content =
          @Content(
              mediaType = OpenApiConstants.JSON_MEDIA_TYPE,
              schema = @Schema(implementation = ErrorResponseDto.class)))
  public Response gefaesstypLoeschen(
      @HeaderParam(OpenApiConstants.HEADER_API_VERSION) final int apiVersion,
      @PathParam("uuid")
          @Pattern(
              regexp = ValidationPatternsAndMessages.TECHNISCHE_ID,
              message = "uuid ist keine UUID.")
          final String uuid) {

    if (apiVersion != INT_1) {
      throw new UnsupportedVersionException(
          MessageFormat.format(OpenApiConstants.API_VERSION_MF, STRING_1));
    }

    return Response.status(Status.OK).entity(gefaesstypService.gefaesstypLoeschen(uuid)).build();
  }
}
