//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.domain.gefaesse;

import de.egladil.web.kaeuzchenlager.TestUtils;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class GefaesstypDatenValidationTest {

    @Inject
    Validator validator;

    @Nested
    class ValidDtoTests {

        @Test
        void shouldPass_when_valid() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(200)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertTrue(constraintViolations.isEmpty());
        }
    }

    @Nested
    class NameTests {

        @Test
        void shouldNotPass_when_name_invalid() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp <4>")
                    .volumen(200)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("name enthält ungültige Zeichen. Erlaubt sind Buchstaben, Ziffern, Leerzeichen, und die Sonderzeichen ( ) , ; _ - \" . : Wenn das nicht ausreicht, bitte an die Entwicklung wenden.", cv.getMessage()),
                    () -> assertEquals("name", cv.getPropertyPath().toString()));

        }

        @Test
        void shouldNotPass_when_name_blank() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name(" ")
                    .volumen(200)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("name ist erforderlich.", cv.getMessage()),
                    () -> assertEquals("name", cv.getPropertyPath().toString()));

        }

        @Test
        void shouldNotPass_when_name_null() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .volumen(200)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("name ist erforderlich.", cv.getMessage()),
                    () -> assertEquals("name", cv.getPropertyPath().toString()));

        }

        @Test
        void shouldNotPass_when_name_tooLong() {

            // arrange
            String name = TestUtils.createStringWithLength("g", 101);

            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name(name)
                    .volumen(200)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("name ist zu lang (max. 100 Zeichen).", cv.getMessage()),
                    () -> assertEquals("name", cv.getPropertyPath().toString()));

        }
    }

    @Nested
    class VolumenTests {

        @Test
        void shouldNotPass_when_volumenNull() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("volumen ist erforderlich.", cv.getMessage()),
                    () -> assertEquals("volumen", cv.getPropertyPath().toString()));
        }

        @Test
        void shouldNotPass_when_volumen_lessThan0() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(-1)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("volumen muss mindestens 1 sein.", cv.getMessage()),
                    () -> assertEquals("volumen", cv.getPropertyPath().toString()));
        }

        @Test
        void shouldNotPass_when_volumen_0() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(0)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("volumen muss mindestens 1 sein.", cv.getMessage()),
                    () -> assertEquals("volumen", cv.getPropertyPath().toString()));
        }

        @Test
        void shouldNotPass_when_volumen_10000() {

            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(10000)
                    .anzahl(13)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("volumen darf höchstens 9999 sein.", cv.getMessage()),
                    () -> assertEquals("volumen", cv.getPropertyPath().toString()));
        }
    }

    @Nested
    class AnzahlTests {

        @Test
        void shouldNotPass_when_negativ() {
            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(100)
                    .anzahl(-1)
                    .backgroundColor("#ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("anzahl darf nicht kleiner als 0 sein.", cv.getMessage()),
                    () -> assertEquals("anzahl", cv.getPropertyPath().toString()));

        }
    }

    @Nested
    class BackgroundColorTests {

        @Test
        void shouldNotPass_when_backgroundColorInvalid() {
            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(100)
                    .anzahl(22)
                    .backgroundColor("ffffff")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("backgroundColor muss ein hex-Farbcode sein.", cv.getMessage()),
                    () -> assertEquals("backgroundColor", cv.getPropertyPath().toString()));


        }

        @Test
        void shouldNotPass_when_backgroundColorBlank() {
            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(100)
                    .anzahl(22)
                    .backgroundColor(" ")
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("backgroundColor muss ein hex-Farbcode sein.", cv.getMessage()),
                    () -> assertEquals("backgroundColor", cv.getPropertyPath().toString()));


        }

        @Test
        void shouldNotPass_when_backgroundColorNull() {
            // arrange
            GefaesstypDaten dto = GefaesstypDaten.builder()
                    .name("Gefäßtyp 4")
                    .volumen(100)
                    .anzahl(22)
                    .build();

            // act
            final Set<ConstraintViolation<GefaesstypDaten>> constraintViolations = validator.validate(dto);

            // assert
            assertEquals(1, constraintViolations.size());

            ConstraintViolation<GefaesstypDaten> cv = constraintViolations.iterator().next();
            assertAll(() -> assertEquals("backgroundColor ist erforderlich.", cv.getMessage()),
                    () -> assertEquals("backgroundColor", cv.getPropertyPath().toString()));

        }
    }
}
