using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Data;
using ParcialDesarrolloWeb.Models;



namespace ParcialDesarrolloWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarrerasController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CarrerasController(AppDbContext context) => _context = context;

        // GET: api/Carreras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Carrera>>> GetAll()
        {
            return await _context.Carreras.ToListAsync();
        }

        // GET: api/Carreras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Carrera>> GetById(int id)
        {
            var carrera = await _context.Carreras.FindAsync(id);
            if (carrera == null) return NotFound();
            return carrera;
        }

        // POST: api/Carreras
        [HttpPost]
        public async Task<ActionResult<Carrera>> Create(Carrera carrera)
        {
            _context.Carreras.Add(carrera);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = carrera.IdCarrera }, carrera);
        }

        // PUT: api/Carreras/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Carrera carrera)
        {
            if (id != carrera.IdCarrera) return BadRequest();

            _context.Entry(carrera).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Carreras.AnyAsync(c => c.IdCarrera == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Carreras/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var carrera = await _context.Carreras.FindAsync(id);
            if (carrera == null) return NotFound();

            _context.Carreras.Remove(carrera);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
