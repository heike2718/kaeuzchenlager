//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import jakarta.validation.metadata.ConstraintDescriptor;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.Spliterator;
import java.util.function.Consumer;

public class TestUtils {

    /**
     * Generiert einen String mit diesem Letter der gewünschten Länge
     * @param letter String
     * @param length int
     * @return String
     */
    public static String createStringWithLength(String letter, int length) {

        return String.valueOf(letter).repeat(Math.max(0, length));

    }

    public static ConstraintViolationException createConstraintViolationException() {
        Set<ConstraintViolation<?>> violations = new HashSet<>();

        // Erste ConstraintViolation
        violations.add(new ConstraintViolation<>() {
            @Override
            public String getMessage() {
                return "Name must not be blank";
            }

            @Override
            public String getMessageTemplate() {
                return "{jakarta.validation.constraints.NotBlank.message}";
            }

            @Override
            public Object getRootBean() {
                return new Object();
            }

            @Override
            public Class<Object> getRootBeanClass() {
                return Object.class;
            }

            @Override
            public Object getLeafBean() {
                return null;
            }

            @Override
            public Object[] getExecutableParameters() {
                return new Object[0];
            }

            @Override
            public Object getExecutableReturnValue() {
                return null;
            }

            @Override
            public Path getPropertyPath() {
                return new Path() {
                    @Override
                    public Iterator<Node> iterator() {
                        final Iterator<Node> o = null;
                        return o;
                    }

                    @Override
                    public void forEach(final Consumer<? super Node> action) {
                        Path.super.forEach(action);
                    }

                    @Override
                    public Spliterator<Node> spliterator() {
                        return Path.super.spliterator();
                    }

                    @Override
                    public String toString() {
                        return "user.name";
                    }
                };
            }

            @Override
            public Object getInvalidValue() {
                return "";
            }

            @Override
            public ConstraintDescriptor<?> getConstraintDescriptor() {
                return null;
            }

            @Override
            public <U> U unwrap(Class<U> type) {
                return null;
            }
        });

        // Zweite ConstraintViolation
        violations.add(new ConstraintViolation<>() {
            @Override
            public String getMessage() {
                return "Email must be valid";
            }

            @Override
            public String getMessageTemplate() {
                return "{jakarta.validation.constraints.Email.message}";
            }

            @Override
            public Object getRootBean() {
                return new Object();
            }

            @Override
            public Class<Object> getRootBeanClass() {
                return Object.class;
            }

            @Override
            public Object getLeafBean() {
                return null;
            }

            @Override
            public Object[] getExecutableParameters() {
                return new Object[0];
            }

            @Override
            public Object getExecutableReturnValue() {
                return null;
            }

            @Override
            public Path getPropertyPath() {
                return new Path() {
                    @Override
                    public Iterator<Node> iterator() {
                        return null;
                    }

                    @Override
                    public void forEach(final Consumer<? super Node> action) {
                        Path.super.forEach(action);
                    }

                    @Override
                    public Spliterator<Node> spliterator() {
                        return Path.super.spliterator();
                    }

                    @Override
                    public String toString() {
                        return "user.email";
                    }
                };
            }

            @Override
            public Object getInvalidValue() {
                return "invalid-email";
            }

            @Override
            public ConstraintDescriptor<?> getConstraintDescriptor() {
                return null;
            }

            @Override
            public <U> U unwrap(Class<U> type) {
                return null;
            }
        });

        return new ConstraintViolationException("Validation failed", violations);
    }
}
