//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager;

public class TestUtils {

    /**
     * Generiert einen String mit diesem Letter der gewünschten Länge
     * @param letter String
     * @param length int
     * @return String
     */
    public static String createStringWithLength(String letter, int length) {

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(letter);
        }

        return sb.toString();

    }
}
