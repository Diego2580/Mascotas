package com.salamea.mascotas.controller;

import com.salamea.mascotas.dto.MascotaDTO;
import com.salamea.mascotas.dto.PromedioAgeDTO;
import com.salamea.mascotas.service.MascotaService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mascotas")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    /**
     * GET /mascotas - Listar todas las mascotas
     * GET /mascotas?especie=Perro - Filtrar por especie
     * GET /mascotas?nombre=Max - Buscar por nombre
     */
    @GetMapping
    public ResponseEntity<List<MascotaDTO>> listar(
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) String nombre) {
        
        List<MascotaDTO> mascotas;
        
        if (especie != null && !especie.isEmpty()) {
            log.info("Filtrando por especie: {}", especie);
            mascotas = mascotaService.filtrarPorEspecie(especie);
        } else if (nombre != null && !nombre.isEmpty()) {
            log.info("Buscando por nombre: {}", nombre);
            mascotas = mascotaService.buscarPorNombre(nombre);
        } else {
            log.info("Listando todas las mascotas");
            mascotas = mascotaService.listarTodas();
        }
        
        return ResponseEntity.ok(mascotas);
    }

    /**
     * GET /mascotas/{id} - Obtener mascota por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MascotaDTO> obtenerPorId(@PathVariable Long id) {
        log.info("Obteniendo mascota con id: {}", id);
        MascotaDTO mascota = mascotaService.obtenerPorId(id);
        return ResponseEntity.ok(mascota);
    }

    /**
     * POST /mascotas - Crear nueva mascota
     */
    @PostMapping
    public ResponseEntity<MascotaDTO> crear(@Valid @RequestBody MascotaDTO mascotaDTO) {
        log.info("Creando nueva mascota");
        MascotaDTO creada = mascotaService.crear(mascotaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * PUT /mascotas/{id} - Actualizar mascota
     */
    @PutMapping("/{id}")
    public ResponseEntity<MascotaDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MascotaDTO mascotaDTO) {
        
        log.info("Actualizando mascota con id: {}", id);
        MascotaDTO actualizada = mascotaService.actualizar(id, mascotaDTO);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * DELETE /mascotas/{id} - Eliminar mascota
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        log.info("Eliminando mascota con id: {}", id);
        mascotaService.eliminar(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Mascota eliminada correctamente");
        response.put("id", id.toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /mascotas/promedio-edad - Calcular promedio de edad de todas las mascotas
     */
    @GetMapping("/estadisticas/promedio-edad")
    public ResponseEntity<PromedioAgeDTO> obtenerPromedioEdad() {
        log.info("Calculando promedio de edad general");
        PromedioAgeDTO promedio = mascotaService.obtenerPromedioEdad();
        return ResponseEntity.ok(promedio);
    }

    /**
     * GET /mascotas/promedio-edad?especie=Perro - Promedio de edad por especie
     */
    @GetMapping("/estadisticas/promedio-edad-especie")
    public ResponseEntity<PromedioAgeDTO> obtenerPromedioEdadPorEspecie(
            @RequestParam String especie) {
        
        log.info("Calculando promedio de edad por especie: {}", especie);
        PromedioAgeDTO promedio = mascotaService.obtenerPromedioEdadPorEspecie(especie);
        return ResponseEntity.ok(promedio);
    }

    /**
     * GET /mascotas/estadisticas/contar?especie=Gato - Conteo de mascotas por especie
     */
    @GetMapping("/estadisticas/contar")
    public ResponseEntity<Map<String, Object>> contarPorEspecie(
            @RequestParam String especie) {
        
        log.info("Contando mascotas de especie: {}", especie);
        Long cantidad = mascotaService.contarPorEspecie(especie);
        
        Map<String, Object> response = new HashMap<>();
        response.put("especie", especie);
        response.put("cantidad", cantidad);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /health - Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Mascotas API");
        return ResponseEntity.ok(response);
    }
}
