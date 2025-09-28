using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;


namespace ParcialDesarrolloWeb.Models
{
    public class Carrera
    {

        [Key]
        public int IdCarrera { get; set; }

        [Required, MaxLength(150)]
        public string NombreCarrera { get; set; }

        public ICollection<Estudiante> Estudiantes { get; set; }

    }
}
