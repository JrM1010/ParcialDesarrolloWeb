using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Models;


namespace ParcialDesarrolloWeb.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Estudiante> Estudiantes { get; set; }
        public DbSet<Carrera> Carreras { get; set; }
        public DbSet<Facultad> Facultades { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relación estudiante -> carrera
            modelBuilder.Entity<Estudiante>()
                        .HasOne(e => e.Carrera)
                        .WithMany(c => c.Estudiantes)
                        .HasForeignKey(e => e.IdCarrera)
                        .OnDelete(DeleteBehavior.Restrict);

            // Relación estudiante -> facultad
            modelBuilder.Entity<Estudiante>()
                        .HasOne(e => e.Facultad)
                        .WithMany(f => f.Estudiantes)
                        .HasForeignKey(e => e.IdFacultad)
                        .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }





    }
}
