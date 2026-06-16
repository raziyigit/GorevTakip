using System.IO;
using Microsoft.AspNetCore.DataProtection;
using GorevTakip.Components;
using GorevTakip.Services;

var builder = WebApplication.CreateBuilder(args);
var dataProtectionDirectory = Path.Combine(builder.Environment.ContentRootPath, ".app-data-protection");

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddScoped<GorevDurumService>();
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(dataProtectionDirectory));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
