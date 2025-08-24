//=====================================================
// Projekt: kaeuzchenlager
// (c) Heike Winkelvoß
//=====================================================

package de.egladil.web.kaeuzchenlager.infrastructure.error;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GlobalUncaughtExceptionHandler implements Thread.UncaughtExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalUncaughtExceptionHandler.class);

    @Override
    public void uncaughtException(Thread t, Throwable e) {
        LOGGER.error("Uncaught exception in thread {}: {}", t.getName(), e.getMessage(), e);
        // Optional: Metrik/Alarm anstoßen
        // Metrics.counter("uncaught_exceptions_total").increment();
    }
}

