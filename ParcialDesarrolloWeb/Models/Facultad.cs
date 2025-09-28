using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ParcialDesarrolloWeb.Models
{
    public class Facultad
    {
        [Key]
        public int IdFacultad { get; set; }

        [Required, MaxLength(150)]
        public string? NombreFacultad { get; set; }

        public ICollection<Estudiante> Estudiantes { get; set; } = new List<Estudiante>();



    }
}
