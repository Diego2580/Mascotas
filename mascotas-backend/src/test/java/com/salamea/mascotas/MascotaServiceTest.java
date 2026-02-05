package com.salamea.mascotas.service;

import com.salamea.mascotas.dto.MascotaDTO;
import com.salamea.mascotas.dto.PromedioAgeDTO;
import com.salamea.mascotas.entity.Mascota;
import com.salamea.mascotas.exception.MascotaNotFoundException;
import com.salamea.mascotas.repository.MascotaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("MascotaService Tests")
class MascotaServiceTest {

    @Mock
    private MascotaRepository mascotaRepository;

    @InjectMocks
    private MascotaService mascotaService;

    private Mascota mascotaTest;
    private MascotaDTO mascotaDTOTest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        mascotaTest = new Mascota();
        mascotaTest.setId(1L);
        mascotaTest.setNombre("Max");
        mascotaTest.setEspecie("Perro");
        mascotaTest.setEdad(5);
        mascotaTest.setDueno("Juan");
        mascotaTest.setFechaCreacion(LocalDateTime.now());
        mascotaTest.setFechaActualizacion(LocalDateTime.now());

        mascotaDTOTest = new MascotaDTO();
        mascotaDTOTest.setId(1L);
        mascotaDTOTest.setNombre("Max");
        mascotaDTOTest.setEspecie("Perro");
        mascotaDTOTest.setEdad(5);
        mascotaDTOTest.setDueno("Juan");
    }

    @Test
    @DisplayName("Debe listar todas las mascotas correctamente")
    void testListarTodas() {
        // Arrange
        List<Mascota> mascotas = Arrays.asList(mascotaTest);
        when(mascotaRepository.findAll()).thenReturn(mascotas);

        // Act
        List<MascotaDTO> resultado = mascotaService.listarTodas();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Max", resultado.get(0).getNombre());
        verify(mascotaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe obtener mascota por ID correctamente")
    void testObtenerPorId() {
        // Arrange
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaTest));

        // Act
        MascotaDTO resultado = mascotaService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals("Max", resultado.getNombre());
        assertEquals("Perro", resultado.getEspecie());
        verify(mascotaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar excepción cuando mascota no existe")
    void testObtenerPorIdNoEncontrado() {
        // Arrange
        when(mascotaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(MascotaNotFoundException.class, () -> {
            mascotaService.obtenerPorId(999L);
        });
    }

    @Test
    @DisplayName("Debe crear mascota correctamente")
    void testCrear() {
        // Arrange
        when(mascotaRepository.save(any(Mascota.class))).thenReturn(mascotaTest);

        // Act
        MascotaDTO resultado = mascotaService.crear(mascotaDTOTest);

        // Assert
        assertNotNull(resultado);
        assertEquals("Max", resultado.getNombre());
        verify(mascotaRepository, times(1)).save(any(Mascota.class));
    }

    @Test
    @DisplayName("Debe actualizar mascota correctamente")
    void testActualizar() {
        // Arrange
        MascotaDTO updateDTO = new MascotaDTO();
        updateDTO.setNombre("MaxUpdated");
        updateDTO.setEspecie("Perro");
        updateDTO.setEdad(6);
        updateDTO.setDueno("Juan");

        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaTest));
        when(mascotaRepository.save(any(Mascota.class))).thenReturn(mascotaTest);

        // Act
        MascotaDTO resultado = mascotaService.actualizar(1L, updateDTO);

        // Assert
        assertNotNull(resultado);
        verify(mascotaRepository, times(1)).findById(1L);
        verify(mascotaRepository, times(1)).save(any(Mascota.class));
    }

    @Test
    @DisplayName("Debe eliminar mascota correctamente")
    void testEliminar() {
        // Arrange
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascotaTest));

        // Act
        mascotaService.eliminar(1L);

        // Assert
        verify(mascotaRepository, times(1)).findById(1L);
        verify(mascotaRepository, times(1)).delete(mascotaTest);
    }

    @Test
    @DisplayName("Debe filtrar mascotas por especie correctamente")
    void testFiltrarPorEspecie() {
        // Arrange
        List<Mascota> mascotas = Arrays.asList(mascotaTest);
        when(mascotaRepository.findByEspecie("Perro")).thenReturn(mascotas);

        // Act
        List<MascotaDTO> resultado = mascotaService.filtrarPorEspecie("Perro");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Perro", resultado.get(0).getEspecie());
    }

    @Test
    @DisplayName("Debe buscar mascota por nombre correctamente")
    void testBuscarPorNombre() {
        // Arrange
        List<Mascota> mascotas = Arrays.asList(mascotaTest);
        when(mascotaRepository.findByNombreContainingIgnoreCase("Max")).thenReturn(mascotas);

        // Act
        List<MascotaDTO> resultado = mascotaService.buscarPorNombre("Max");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Max", resultado.get(0).getNombre());
    }

    @Test
    @DisplayName("Debe calcular promedio de edad correctamente")
    void testObtenerPromedioEdad() {
        // Arrange
        when(mascotaRepository.findAverageAge()).thenReturn(5.5);

        // Act
        PromedioAgeDTO resultado = mascotaService.obtenerPromedioEdad();

        // Assert
        assertNotNull(resultado);
        assertEquals(5.5, resultado.getPromedio());
    }

    @Test
    @DisplayName("Debe calcular promedio por especie correctamente")
    void testObtenerPromedioEdadPorEspecie() {
        // Arrange
        when(mascotaRepository.findAverageAgeByEspecie("Perro")).thenReturn(5.5);

        // Act
        PromedioAgeDTO resultado = mascotaService.obtenerPromedioEdadPorEspecie("Perro");

        // Assert
        assertNotNull(resultado);
        assertEquals(5.5, resultado.getPromedio());
    }

    @Test
    @DisplayName("Debe contar mascotas por especie correctamente")
    void testContarPorEspecie() {
        // Arrange
        when(mascotaRepository.countByEspecie("Perro")).thenReturn(5L);

        // Act
        Long resultado = mascotaService.contarPorEspecie("Perro");

        // Assert
        assertEquals(5L, resultado);
    }
}
