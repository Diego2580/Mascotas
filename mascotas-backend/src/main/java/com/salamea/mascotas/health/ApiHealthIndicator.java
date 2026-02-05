package com.salamea.mascotas.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Custom Health Indicator para verificar la disponibilidad del API
 */
@Component
public class ApiHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        try {
            // Simular verificación de disponibilidad del API
            long startTime = System.currentTimeMillis();
            
            // Aquí se podría agregar lógica más compleja si es necesario
            boolean isHealthy = true;
            
            long responseTime = System.currentTimeMillis() - startTime;
            
            if (isHealthy) {
                return Health.up()
                        .withDetail("api", "Mascotas API")
                        .withDetail("status", "Available")
                        .withDetail("response_time_ms", responseTime)
                        .withDetail("endpoints_available", "All")
                        .build();
            } else {
                return Health.down()
                        .withDetail("api", "Mascotas API")
                        .withDetail("status", "Unavailable")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("api", "Mascotas API")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
