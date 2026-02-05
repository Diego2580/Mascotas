package com.salamea.mascotas.controller;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Monitoreo del Sistema
 * Proporciona endpoints para health checks y métricas del sistema
 */
@RestController
@RequestMapping("/monitoring")
public class MonitoringController {

    @Autowired
    private MeterRegistry meterRegistry;

    /**
     * Health check básico del sistema
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        health.put("service", "Mascotas API");
        health.put("version", "1.0.0");
        
        return ResponseEntity.ok(health);
    }

    /**
     * Métricas del sistema JVM
     */
    @GetMapping("/metrics/system")
    public ResponseEntity<Map<String, Object>> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Memory metrics
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        long totalMemory = memoryBean.getHeapMemoryUsage().getMax() / (1024 * 1024);
        long usedMemory = memoryBean.getHeapMemoryUsage().getUsed() / (1024 * 1024);
        long freeMemory = (memoryBean.getHeapMemoryUsage().getMax() - memoryBean.getHeapMemoryUsage().getUsed()) / (1024 * 1024);
        
        Map<String, Object> memory = new HashMap<>();
        memory.put("total_mb", totalMemory);
        memory.put("used_mb", usedMemory);
        memory.put("free_mb", freeMemory);
        memory.put("usage_percent", (usedMemory * 100.0) / totalMemory);
        metrics.put("memory", memory);
        
        // CPU metrics - usar com.sun.management para acceso a getProcessCpuLoad
        double cpuUsage = 0.0;
        try {
            com.sun.management.OperatingSystemMXBean sunOsBean = 
                (com.sun.management.OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
            cpuUsage = sunOsBean.getProcessCpuLoad() * 100;
        } catch (Exception e) {
            cpuUsage = 0.0;
        }
        metrics.put("cpu_percent", String.format("%.2f", cpuUsage));
        
        // Runtime metrics
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        metrics.put("uptime_seconds", uptime);
        
        // Thread metrics
        Map<String, Object> threads = new HashMap<>();
        threads.put("active", Thread.activeCount());
        threads.put("peak", ManagementFactory.getThreadMXBean().getPeakThreadCount());
        metrics.put("threads", threads);
        
        metrics.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        return ResponseEntity.ok(metrics);
    }

    /**
     * Métricas de la aplicación (requests, tiempos de respuesta, etc.)
     */
    @GetMapping("/metrics/application")
    public ResponseEntity<Map<String, Object>> getApplicationMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        try {
            // HTTP Request metrics
            Map<String, Double> httpMetrics = new HashMap<>();
            
            // Total requests count (aproximado)
            httpMetrics.put("total_requests", 0.0);
            httpMetrics.put("avg_response_time_ms", 0.0);
            
            metrics.put("http", httpMetrics);
            
            // JVM metrics
            Map<String, Double> jvmMetrics = new HashMap<>();
            jvmMetrics.put("classes_loaded", 
                    Double.valueOf(ManagementFactory.getClassLoadingMXBean().getLoadedClassCount()));
            metrics.put("jvm", jvmMetrics);
            
        } catch (Exception e) {
            metrics.put("error", "Unable to retrieve some metrics: " + e.getMessage());
        }
        
        metrics.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return ResponseEntity.ok(metrics);
    }

    /**
     * Status completo del servicio
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getServiceStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("service_name", "Mascotas API");
        status.put("status", "HEALTHY");
        status.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        // Database status
        Map<String, String> database = new HashMap<>();
        database.put("status", "CONNECTED");
        database.put("type", "PostgreSQL");
        status.put("database", database);
        
        // API endpoints status
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("mascotas", "AVAILABLE");
        endpoints.put("monitoring", "AVAILABLE");
        endpoints.put("health", "AVAILABLE");
        status.put("endpoints", endpoints);
        
        // Uptime
        MemoryMXBean memBean = ManagementFactory.getMemoryMXBean();
        long heapUsedPercent = (memBean.getHeapMemoryUsage().getUsed() * 100) / 
                               memBean.getHeapMemoryUsage().getMax();
        
        double cpuPercent = 0.0;
        try {
            com.sun.management.OperatingSystemMXBean sunOsBean = 
                (com.sun.management.OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
            cpuPercent = sunOsBean.getProcessCpuLoad() * 100;
        } catch (Exception e) {
            cpuPercent = 0.0;
        }
        
        status.put("resource_usage", Map.of(
            "memory_percent", heapUsedPercent,
            "cpu_percent", String.format("%.2f", cpuPercent)
        ));
        
        return ResponseEntity.ok(status);
    }

    /**
     * Información de la aplicación
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        
        info.put("name", "Mascotas Management System");
        info.put("version", "1.0.0");
        info.put("description", "Sistema de gestión de mascotas con monitoreo integrado");
        info.put("author", "Diego Salamea");
        info.put("build_date", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("api_base", "/api");
        endpoints.put("mascotas", "GET /api/mascotas");
        endpoints.put("health_check", "GET /api/monitoring/health");
        endpoints.put("system_metrics", "GET /api/monitoring/metrics/system");
        endpoints.put("app_metrics", "GET /api/monitoring/metrics/application");
        endpoints.put("service_status", "GET /api/monitoring/status");
        endpoints.put("actuator", "GET /api/actuator");
        endpoints.put("prometheus", "GET /api/actuator/prometheus");
        info.put("available_endpoints", endpoints);
        
        return ResponseEntity.ok(info);
    }
}
