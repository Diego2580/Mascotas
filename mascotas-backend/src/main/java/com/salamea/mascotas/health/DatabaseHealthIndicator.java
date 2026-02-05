package com.salamea.mascotas.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Custom Health Indicator para verificar la disponibilidad de la Base de Datos
 */
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    @Autowired(required = false)
    private DataSource dataSource;

    @Override
    public Health health() {
        if (dataSource == null) {
            return Health.down()
                    .withDetail("reason", "DataSource not configured")
                    .build();
        }

        try {
            try (Connection connection = dataSource.getConnection()) {
                if (connection.isValid(2)) {
                    return Health.up()
                            .withDetail("database", "PostgreSQL")
                            .withDetail("status", "Connected")
                            .withDetail("response_time", "< 2s")
                            .build();
                }
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("status", "Connection failed")
                    .withDetail("error", e.getMessage())
                    .build();
        }

        return Health.down()
                .withDetail("database", "PostgreSQL")
                .withDetail("status", "Unknown")
                .build();
    }
}
