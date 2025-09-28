
using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Data;

namespace ParcialDesarrolloWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("CadenaSQL");
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString)
            );


            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
            });


            // CORS (ajusta el origen según tu frontend)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalFront", policy =>
                {
                    policy.WithOrigins("http://localhost:5500") // puerto del servidor estático (ej: Live Server)
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });



            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }



            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors("AllowLocalFront");

            app.MapControllers();

            app.Run();
        }
    }
}
