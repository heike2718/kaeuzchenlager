//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.resources;

import de.egladil.web.kaeuzchenlager.domain.exception.ErrorResponseDto;
import de.egladil.web.kaeuzchenlager.domain.exception.UnsupportedVersionException;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDaten;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypDto;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypLoeschenResult;
import de.egladil.web.kaeuzchenlager.domain.gefaesse.GefaesstypService;
import de.egladil.web.kaeuzchenlager.domain.validation.ValidationPatternsAndMessages;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.enums.ParameterIn;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

@Path("api/gefaesstypen")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Gefaesstypen")
public class GefaesstypenResource {

    @Inject
    GefaesstypService gefaesstypService;

    @GET
    @Operation(operationId = "loadGefaesstypen", summary = "Gibt alle Gefaesstypen zurück.")
    @Parameters({@Parameter(in = ParameterIn.HEADER, name = "API-Version", description = "Version dieser API. Default = 1"),})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", description = "nur autorisierte User dürfen diese API aufrufen", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "NotAcceptable", responseCode = "406", description = "die im API-Version-Header genannte Version wird nicht unterstützt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    public Response loadGefaesstypen(@HeaderParam("API-Version") @DefaultValue("1") int apiVersion) {

        if (apiVersion != 1) {
            throw new UnsupportedVersionException("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1");
        }
        return Response.ok(gefaesstypService.loadGefaesstypen()).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(operationId = "gefaesstypAnlegen", summary = "Legt einen neuen Gefäßtyp an.")
    @Parameters({@Parameter(in = ParameterIn.HEADER, name = "API-Version", description = "Version dieser API. Default = 1"),})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", description = "Payload besteht die Input-Validierung nicht", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", description = "nur autorisierte User dürfen diese API aufrufen", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "NotAcceptable", responseCode = "406", description = "die im API-Version-Header genannte Version wird nicht unterstützt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "Conflict", responseCode = "409", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    public Response gefaesstypAnlegen(@HeaderParam("API-Version") @DefaultValue("1") int apiVersion, @Valid GefaesstypDaten daten) {

        if (apiVersion != 1) {
            throw new UnsupportedVersionException("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1");
        }

        final GefaesstypDto responsePayload = gefaesstypService.gefaesstypAnlegen(daten);
        return Response.status(201).entity(responsePayload).build();
    }

    @PUT
    @Path("{uuid}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(operationId = "gefaesstypAendern", summary = "Ändert einen Gefäßtyp.")
    @Parameters({@Parameter(in = ParameterIn.HEADER, name = "API-Version", description = "Version dieser API. Default = 1"),})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", description = "Payload oder Path-Parameter bestehen die Input-Validierung nicht", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", description = "nur autorisierte User dürfen diese API aufrufen", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "MethodNotAllowed", responseCode = "405", description = "wenn die uuid im path fehlt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "NotAcceptable", responseCode = "406", description = "die im API-Version-Header genannte Version wird nicht unterstützt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "Conflict", responseCode = "409", description = "Gefäßtyp ist bereits vorhanden (UC verletzt)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "PreconditionFailed", responseCode = "412", description = "Gefäßtyp zwischenzeitlich durch jemand anderen geändert", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    public Response gefaesstypAendern(@HeaderParam("API-Version") @DefaultValue("1") int apiVersion, @PathParam(value = "uuid") @Pattern(regexp = ValidationPatternsAndMessages.TECHNISCHE_ID, message = "uuid ist keine UUID.") String uuid, @Valid GefaesstypDaten daten) {

        if (apiVersion != 1) {
            throw new UnsupportedVersionException("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1");
        }

        final GefaesstypDto responsePayload = gefaesstypService.gefaesstypAendern(uuid, daten);

        return Response.status(200).entity(responsePayload).build();
    }

    @DELETE
    @Path("{uuid}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(operationId = "gefaesstypLoeschen", summary = "Löscht einen Gefäßtyp.")
    @Parameters({@Parameter(in = ParameterIn.HEADER, name = "API-Version", description = "Version dieser API. Default = 1"),})
    @APIResponse(name = "OKResponse", responseCode = "200", content = @Content(mediaType = "application/json", schema = @Schema(type = SchemaType.ARRAY, implementation = GefaesstypDto.class)))
    @APIResponse(name = "BadRequest", responseCode = "400", description = "Path-Parameter besteht die Input-Validierung nicht", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "NotAuthorized", responseCode = "401", description = "nur autorisierte User dürfen diese API aufrufen", content = @Content(mediaType = "application/json"))
    @APIResponse(name = "MethodNotAllowed", responseCode = "405", description = "wenn die uuid im path fehlt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "NotAcceptable", responseCode = "406", description = "die im API-Version-Header genannte Version wird nicht unterstützt", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    @APIResponse(name = "ServerError", description = "server error", responseCode = "500", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponseDto.class)))
    public Response gefaesstypLoeschen(@HeaderParam("API-Version") @DefaultValue("1") int apiVersion, @PathParam(value = "uuid") @Pattern(regexp = ValidationPatternsAndMessages.TECHNISCHE_ID, message = "uuid ist keine UUID.") String uuid) {

        if (apiVersion != 1) {
            throw new UnsupportedVersionException("API-Version wird nicht unterstützt. Bitte Header API-Version prüfen. Unterstützte Versionen: 1");
        }

        GefaesstypLoeschenResult responsePayload = gefaesstypService.gefaesstypLoeschen(uuid);

        return Response.status(200).entity(responsePayload).build();
    }
}
