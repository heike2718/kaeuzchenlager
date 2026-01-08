// =====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
// =====================================================

package de.egladil.web.kaeuzchenlager.domain.validation;

/** ValidationPatternsAndMessages stellt diverse Konstanten zur Verfügung. */
public final class ValidationPatternsAndMessages {

    /** The constant TECHNISCHE_ID. */
    public static final String TECHNISCHE_ID = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$";

    /** The constant KAEUZCHEN_INPUT_SECURED. */
    public static final String KAEUZCHEN_INPUT_SECURED = "^[a-zA-ZäöüÄÖÜß0-9\\s\"'_\\-.,:;()]*$";

    /** The constant INVALID_INPUT_MESSAGE_DETAILS. */
    public static final String INVALID_INPUT_MESSAGE_DETAILS = "Erlaubt sind Buchstaben, Ziffern, Leerzeichen, und die Sonderzeichen ( ) , ; _ - \" . :"
            + " Wenn das nicht ausreicht, bitte an die Entwicklung wenden.";
}
