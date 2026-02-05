package com.salamea.mascotas.repository;

import com.salamea.mascotas.entity.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    
    List<Mascota> findByEspecie(String especie);
    
    List<Mascota> findByDueno(String dueno);
    
    List<Mascota> findByNombreContainingIgnoreCase(String nombre);
    
    @Query("SELECT AVG(m.edad) FROM Mascota m")
    Double findAverageAge();
    
    @Query("SELECT AVG(m.edad) FROM Mascota m WHERE m.especie = :especie")
    Double findAverageAgeByEspecie(@Param("especie") String especie);
    
    @Query("SELECT COUNT(m) FROM Mascota m WHERE m.especie = :especie")
    Long countByEspecie(@Param("especie") String especie);
}
