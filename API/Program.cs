using System;
using API.Extensions;
using API.MiddleWare;
using Application.Activities;
using FluentValidation.AspNetCore;
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

builder.Services.AddControllers(opt => {
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
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
