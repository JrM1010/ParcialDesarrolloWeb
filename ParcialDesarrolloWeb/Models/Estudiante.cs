using System.ComponentModel.DataAnnotations;

namespace ParcialDesarrolloWeb.Models
{
    public class Estudiante
    {

        [Key]
        public int IdEstudiante { get; set; }

        [Required, MaxLength(50)]
        public string? Carnet { get; set; }

        [Required, MaxLength(150)]
        public string? Nombres { get; set; }

        [Required, MaxLength(150)]
        public string? Apellidos { get; set; }

        [EmailAddress, MaxLength(200)]
        public string? Correo { get; set; }

        [MaxLength(50)]
        public string? Telefono { get; set; }




        // Foreign keys
        public int IdCarrera { get; set; }
        public Carrera? Carrera { get; set; }

        public int IdFacultad { get; set; }
        public Facultad? Facultad { get; set; }


    }
}
