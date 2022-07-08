using System;
using API.Extensions;
using API.MiddleWare;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt =>
{
  var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
  opt.Filters.Add(new AuthorizeFilter(policy));
}).AddFluentValidation(config =>
{
  config.RegisterValidatorsFromAssemblyContaining<Create>();
});

var config = builder.Configuration;
var env = builder.Environment;

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Extend to Extension MyCustom
builder.Services.AddApplicationService(config);
builder.Services.AddIdentityService(config);

var app = builder.Build();

//Start custom auto update database 
/* using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
  var context = services.GetRequiredService<DataContext>();
  await context.Database.MigrateAsync();
  await Seed.SeedData(context);
}
catch (Exception ex)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(ex, "An error occurred during migration");
} */
await builder.AddMirageAndSeedData(app);
//End custom auto update database 

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
  .BlockAllMixedContent()
  .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "data:", "sha256-yR2gSI6BIICdRRE2IbNP1SJXeA5NYPbaM32i/Y8eS9o="))
  .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", " https://cdn.jsdelivr.net", "data:"))
  .FormActions(s => s.Self())
  .FrameAncestors(s => s.Self())
  .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "https://www.facebook.com", "https://platform-lookaside.fbsbx.com","data:"))
  .ScriptSources(s => s.Self().CustomSources("sha256-VUoht8cz6GjVqBKNafdvH0USmsN7IAav2ctZx9AnyuQ=", "https://connect.facebook.net"))
  );

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}
else
{
  app.Use(async (context, next) =>
  {
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
    await next.Invoke();
  });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

await app.RunAsync();
