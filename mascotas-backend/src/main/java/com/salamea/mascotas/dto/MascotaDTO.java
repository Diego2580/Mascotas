package com.salamea.mascotas.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MascotaDTO {
    
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100)
    private String nombre;
    
    @NotBlank(message = "La especie es obligatoria")
    @Size(min = 2, max = 50)
    private String especie;
    
    @NotNull(message = "La edad es obligatoria")
    @Min(0)
    @Max(100)
    private Integer edad;
    
    @NotBlank(message = "El dueño es obligatorio")
    @Size(min = 2, max = 100)
    private String dueno;
}
