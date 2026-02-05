package com.salamea.mascotas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.salamea.mascotas.dto.MascotaDTO;
import com.salamea.mascotas.dto.PromedioAgeDTO;
import com.salamea.mascotas.exception.MascotaNotFoundException;
import com.salamea.mascotas.service.MascotaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MascotaController.class)
@DisplayName("MascotaController Tests")
class MascotaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MascotaService mascotaService;

    @Autowired
    private ObjectMapper objectMapper;

    private MascotaDTO mascotaDTOTest;

    @BeforeEach
    void setUp() {
        mascotaDTOTest = new MascotaDTO();
        mascotaDTOTest.setId(1L);
        mascotaDTOTest.setNombre("Max");
        mascotaDTOTest.setEspecie("Perro");
        mascotaDTOTest.setEdad(5);
        mascotaDTOTest.setDueno("Juan");
    }

    @Test
    @DisplayName("GET /mascotas - Debe listar todas las mascotas")
    void testListarTodas() throws Exception {
        // Arrange
        List<MascotaDTO> mascotas = Arrays.asList(mascotaDTOTest);
        when(mascotaService.listarTodas()).thenReturn(mascotas);

        // Act & Assert
        mockMvc.perform(get("/mascotas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].nombre", is("Max")))
            .andExpect(jsonPath("$[0].especie", is("Perro")));

        verify(mascotaService, times(1)).listarTodas();
    }

    @Test
    @DisplayName("GET /mascotas?especie=Perro - Debe filtrar por especie")
    void testFiltrarPorEspecie() throws Exception {
        // Arrange
        List<MascotaDTO> mascotas = Arrays.asList(mascotaDTOTest);
        when(mascotaService.filtrarPorEspecie("Perro")).thenReturn(mascotas);

        // Act & Assert
        mockMvc.perform(get("/mascotas?especie=Perro"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].especie", is("Perro")));

        verify(mascotaService, times(1)).filtrarPorEspecie("Perro");
    }

    @Test
    @DisplayName("GET /mascotas/{id} - Debe obtener mascota por ID")
    void testObtenerPorId() throws Exception {
        // Arrange
        when(mascotaService.obtenerPorId(1L)).thenReturn(mascotaDTOTest);

        // Act & Assert
        mockMvc.perform(get("/mascotas/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre", is("Max")))
            .andExpect(jsonPath("$.especie", is("Perro")));

        verify(mascotaService, times(1)).obtenerPorId(1L);
    }

    @Test
    @DisplayName("GET /mascotas/{id} - Debe retornar 404 cuando mascota no existe")
    void testObtenerPorIdNoEncontrado() throws Exception {
        // Arrange
        when(mascotaService.obtenerPorId(999L))
            .thenThrow(new MascotaNotFoundException("Mascota no encontrada"));

        // Act & Assert
        mockMvc.perform(get("/mascotas/999"))
            .andExpect(status().isNotFound());

        verify(mascotaService, times(1)).obtenerPorId(999L);
    }

    @Test
    @DisplayName("POST /mascotas - Debe crear nueva mascota")
    void testCrear() throws Exception {
        // Arrange
        when(mascotaService.crear(any(MascotaDTO.class))).thenReturn(mascotaDTOTest);

        // Act & Assert
        mockMvc.perform(post("/mascotas")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mascotaDTOTest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nombre", is("Max")));

        verify(mascotaService, times(1)).crear(any(MascotaDTO.class));
    }

    @Test
    @DisplayName("POST /mascotas - Debe retornar 400 con validaciones incorrectas")
    void testCrearValidacionFallida() throws Exception {
        // Arrange
        MascotaDTO invalida = new MascotaDTO();
        invalida.setNombre(""); // Campo requerido vacío

        // Act & Assert
        mockMvc.perform(post("/mascotas")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalida)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /mascotas/{id} - Debe actualizar mascota")
    void testActualizar() throws Exception {
        // Arrange
        when(mascotaService.actualizar(eq(1L), any(MascotaDTO.class)))
            .thenReturn(mascotaDTOTest);

        // Act & Assert
        mockMvc.perform(put("/mascotas/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(mascotaDTOTest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre", is("Max")));

        verify(mascotaService, times(1)).actualizar(eq(1L), any(MascotaDTO.class));
    }

    @Test
    @DisplayName("DELETE /mascotas/{id} - Debe eliminar mascota")
    void testEliminar() throws Exception {
        // Arrange
        doNothing().when(mascotaService).eliminar(1L);

        // Act & Assert
        mockMvc.perform(delete("/mascotas/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message", is("Mascota eliminada correctamente")));

        verify(mascotaService, times(1)).eliminar(1L);
    }

    @Test
    @DisplayName("GET /mascotas/estadisticas/promedio-edad - Debe calcular promedio")
    void testObtenerPromedioEdad() throws Exception {
        // Arrange
        PromedioAgeDTO promedio = new PromedioAgeDTO(5.5, "Promedio de edad calculado correctamente");
        when(mascotaService.obtenerPromedioEdad()).thenReturn(promedio);

        // Act & Assert
        mockMvc.perform(get("/mascotas/estadisticas/promedio-edad"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.promedio", is(5.5)));

        verify(mascotaService, times(1)).obtenerPromedioEdad();
    }

    @Test
    @DisplayName("GET /mascotas/health - Debe retornar status UP")
    void testHealth() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/mascotas/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status", is("UP")))
            .andExpect(jsonPath("$.service", is("Mascotas API")));
    }
}
