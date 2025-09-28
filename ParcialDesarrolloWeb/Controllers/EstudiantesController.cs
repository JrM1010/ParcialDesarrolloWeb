using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Data;
using ParcialDesarrolloWeb.Models;


namespace ParcialDesarrolloWeb.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstudiantesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EstudiantesController(AppDbContext context) => _context = context;

        // GET: api/Estudiantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Estudiante>>> GetAll()
        {
            return await _context.Estudiantes
                                 .Include(e => e.Carrera)
                                 .Include(e => e.Facultad)
                                 .ToListAsync();
        }

        // GET: api/Estudiantes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Estudiante>> GetById(int id)
        {
            var e = await _context.Estudiantes
                                  .Include(x => x.Carrera)
                                  .Include(x => x.Facultad)
                                  .FirstOrDefaultAsync(x => x.IdEstudiante == id);

            if (e == null) return NotFound();
            return e;
        }

        // POST: api/Estudiantes
        [HttpPost]
        public async Task<ActionResult<Estudiante>> Create(Estudiante estudiante)
        {
            _context.Estudiantes.Add(estudiante);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = estudiante.IdEstudiante }, estudiante);
        }

        // PUT: api/Estudiantes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Estudiante estudiante)
        {
            if (id != estudiante.IdEstudiante) return BadRequest();

            _context.Entry(estudiante).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Estudiantes.AnyAsync(e => e.IdEstudiante == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Estudiantes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var estudiante = await _context.Estudiantes.FindAsync(id);
            if (estudiante == null) return NotFound();

            _context.Estudiantes.Remove(estudiante);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}