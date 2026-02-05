package com.salamea.mascotas.service;

import static java.lang.Math.log;

import com.salamea.mascotas.dto.MascotaDTO;
import com.salamea.mascotas.dto.PromedioAgeDTO;
import com.salamea.mascotas.entity.Mascota;
import com.salamea.mascotas.exception.MascotaNotFoundException;
import com.salamea.mascotas.repository.MascotaRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;

    public List<MascotaDTO> listarTodas() {
        log.info("Listando todas las mascotas");
        return mascotaRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public MascotaDTO obtenerPorId(Long id) {
        log.info("Obteniendo mascota con id: {}", id);
        Mascota mascota = mascotaRepository.findById(id)
            .orElseThrow(() -> new MascotaNotFoundException("Mascota no encontrada con id: " + id));
        return convertToDTO(mascota);
    }

    public MascotaDTO crear(MascotaDTO mascotaDTO) {
        log.info("Creando nueva mascota: {}", mascotaDTO.getNombre());
        Mascota mascota = convertToEntity(mascotaDTO);
        Mascota guardada = mascotaRepository.save(mascota);
        return convertToDTO(guardada);
    }

    public MascotaDTO actualizar(Long id, MascotaDTO mascotaDTO) {
        log.info("Actualizando mascota con id: {}", id);
        Mascota mascota = mascotaRepository.findById(id)
            .orElseThrow(() -> new MascotaNotFoundException("Mascota no encontrada con id: " + id));
        
        mascota.setNombre(mascotaDTO.getNombre());
        mascota.setEspecie(mascotaDTO.getEspecie());
        mascota.setEdad(mascotaDTO.getEdad());
        mascota.setDueno(mascotaDTO.getDueno());
        
        Mascota actualizada = mascotaRepository.save(mascota);
        return convertToDTO(actualizada);
    }

    public void eliminar(Long id) {
        log.info("Eliminando mascota con id: {}", id);
        Mascota mascota = mascotaRepository.findById(id)
            .orElseThrow(() -> new MascotaNotFoundException("Mascota no encontrada con id: " + id));
        mascotaRepository.delete(mascota);
    }

    public List<MascotaDTO> filtrarPorEspecie(String especie) {
        log.info("Filtrando mascotas por especie: {}", especie);
        return mascotaRepository.findByEspecie(especie)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<MascotaDTO> buscarPorNombre(String nombre) {
        log.info("Buscando mascotas por nombre: {}", nombre);
        return mascotaRepository.findByNombreContainingIgnoreCase(nombre)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public PromedioAgeDTO obtenerPromedioEdad() {
        log.info("Calculando promedio de edad de todas las mascotas");
        Double promedio = mascotaRepository.findAverageAge();
        
        if (promedio == null) {
            promedio = 0.0;
        }
        
        return new PromedioAgeDTO(
            Math.round(promedio * 100.0) / 100.0,
            "Promedio de edad calculado correctamente"
        );
    }

    public PromedioAgeDTO obtenerPromedioEdadPorEspecie(String especie) {
        log.info("Calculando promedio de edad para la especie: {}", especie);
        Double promedio = mascotaRepository.findAverageAgeByEspecie(especie);
        
        if (promedio == null) {
            promedio = 0.0;
        }
        
        return new PromedioAgeDTO(
            Math.round(promedio * 100.0) / 100.0,
            "Promedio de edad para " + especie + " calculado correctamente"
        );
    }

    public Long contarPorEspecie(String especie) {
        log.info("Contando mascotas de la especie: {}", especie);
        return mascotaRepository.countByEspecie(especie);
    }

    private MascotaDTO convertToDTO(Mascota mascota) {
        MascotaDTO dto = new MascotaDTO();
        dto.setId(mascota.getId());
        dto.setNombre(mascota.getNombre());
        dto.setEspecie(mascota.getEspecie());
        dto.setEdad(mascota.getEdad());
        dto.setDueno(mascota.getDueno());
        return dto;
    }

    private Mascota convertToEntity(MascotaDTO dto) {
        Mascota mascota = new Mascota();
        mascota.setNombre(dto.getNombre());
        mascota.setEspecie(dto.getEspecie());
        mascota.setEdad(dto.getEdad());
        mascota.setDueno(dto.getDueno());
        return mascota;
    }
}
