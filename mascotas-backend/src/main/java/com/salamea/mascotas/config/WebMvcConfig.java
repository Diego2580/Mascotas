package com.salamea.mascotas.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Optional;

/**
 * Configuración de Web MVC: registra interceptores y otras configuraciones
 */
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final Optional<MetricsInterceptor> metricsInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200", "http://localhost:3000", "http://localhost:8080",
                               "https://mascotas-frontend.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        metricsInterceptor.ifPresent(interceptor -> 
            registry.addInterceptor(interceptor)
                    .addPathPatterns("/**")
                    .excludePathPatterns("/actuator/**", "/monitoring/**")
        );
    }
}
