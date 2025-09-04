//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.validation;

public interface ValidationPatternsAndMessages {

    String TECHNISCHE_ID = "^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}$";

    String KAEUZCHEN_INPUT_SECURED = "^[a-zA-ZäöüÄÖÜß0-9\\s\"'_\\-.,:;()]*$";

    String INVALID_INPUT_MESSAGE_DETAILS = "Erlaubt sind Buchstaben, Ziffern, Leerzeichen, und die Sonderzeichen ( ) , ; _ - \" . : Wenn das nicht ausreicht, bitte an die Entwicklung wenden.";

}
