using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoBooksController : ControllerBase
    {
        private readonly TodoBookContext _context;

        public TodoBooksController(TodoBookContext context)
        {
            _context = context;
        }

        // GET: api/TodoBooks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoBookDTO>>> GetTodoBooks()
        {
            return await _context.TodoBooks.Select(x => BookToDTO(x)).ToListAsync();
        }

        // GET: api/TodoBooks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoBookDTO>> GetTodoBook(long id)
        {
            var todoBook = await _context.TodoBooks.FindAsync(id);

            if (todoBook == null)
            {
                return NotFound();
            }

            return BookToDTO(todoBook);
        }

        // PUT: api/TodoBooks/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoBook(long id, TodoBookDTO todoBookDTO)
        {
            if (id != todoBookDTO.Id)
            {
                return BadRequest();
            }

            var todoBook = await _context.TodoBooks.FindAsync(id);
            if (todoBook == null)
            {
                return NotFound();
            }
            todoBook.Title = todoBookDTO.Title;
            todoBook.Author = todoBookDTO.Author;
            todoBook.IsAvailable = todoBookDTO.IsAvailable;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when
            (!TodoBookExists(id))
                {
                    return NotFound();
                }


            return NoContent();
        }

        // POST: api/TodoBooks
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<TodoBookDTO>> PostTodoBook(TodoBookDTO todoBookDTO)
        {
            var todoBook = new TodoBook
            {
                IsAvailable = todoBookDTO.IsAvailable,
                Title = todoBookDTO.Title,
                Author = todoBookDTO.Author
            };

            _context.TodoBooks.Add(todoBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodoBook), new { id = todoBook.Id }, BookToDTO(todoBook));
        }

        // DELETE: api/TodoBooks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TodoBook>> DeleteTodoBook(long id)
        {
            var todoBook = await _context.TodoBooks.FindAsync(id);
            if (todoBook == null)
            {
                return NotFound();
            }

            _context.TodoBooks.Remove(todoBook);
            await _context.SaveChangesAsync();

            return todoBook;
        }

        private bool TodoBookExists(long id)
        {
            return _context.TodoBooks.Any(e => e.Id == id);
        }
        private static TodoBookDTO BookToDTO(TodoBook todoBook) =>
        new TodoBookDTO
        {
            Id = todoBook.Id,
            Title = todoBook.Title,
            Author = todoBook.Author,
            IsAvailable = todoBook.IsAvailable
        };

    }
}
