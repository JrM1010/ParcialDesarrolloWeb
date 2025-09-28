using Microsoft.EntityFrameworkCore;
using ParcialDesarrolloWeb.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });


builder.Services.AddEndpointsApiExplorer();


// Conexion a base de datos SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CadenaSQL")));

// CORS 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Auto-aplicar migraciones en arranque (útil en desarrollo).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Si no trabajas con migraciones usa EnsureCreated(), sino usa Migrate()
    // db.Database.EnsureCreated();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Servir index.html y archivos estáticos desde wwwroot (o la raíz si los tienes ahí)
app.UseDefaultFiles(); // sirve index.html por defecto
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();
