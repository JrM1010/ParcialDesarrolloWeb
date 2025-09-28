using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Data;
using ParcialDesarrolloWeb.Models;

namespace ParcialDesarrolloWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FacultadesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FacultadesController(AppDbContext context) => _context = context;

        // GET: api/Facultades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Facultad>>> GetAll()
        {
            return await _context.Facultades.ToListAsync();
        }

        // GET: api/Facultades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Facultad>> GetById(int id)
        {
            var facultad = await _context.Facultades.FindAsync(id);
            if (facultad == null) return NotFound();
            return facultad;
        }

        // POST: api/Facultades
        [HttpPost]
        public async Task<ActionResult<Facultad>> Create(Facultad facultad)
        {
            _context.Facultades.Add(facultad);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = facultad.IdFacultad }, facultad);
        }

        // PUT: api/Facultades/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Facultad facultad)
        {
            if (id != facultad.IdFacultad) return BadRequest();

            _context.Entry(facultad).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Facultades.AnyAsync(f => f.IdFacultad == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Facultades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var facultad = await _context.Facultades.FindAsync(id);
            if (facultad == null) return NotFound();

            _context.Facultades.Remove(facultad);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
