using Microsoft.AspNetCore.Mvc;
using AnansiAI.Api.Services;
using AnansiAI.Api.Models.DTOs;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = false,
                    Error = "Invalid credentials"
                });
            }

            return Ok(new ApiResponse<LoginResponse>
            {
                Success = true,
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return Ok(new ApiResponse<LoginResponse>
            {
                Success = false,
                Error = "Login failed"
            });
        }
    }

    [HttpPost("super-admin/login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> SuperAdminLogin([FromBody] SuperAdminLoginRequest request)
    {
        try
        {
            var result = await _authService.SuperAdminLoginAsync(request);

            if (result == null)
            {
                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = false,
                    Error = "Invalid super admin credentials"
                });
            }

            return Ok(new ApiResponse<LoginResponse>
            {
                Success = true,
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during super admin login");
            return Ok(new ApiResponse<LoginResponse>
            {
                Success = false,
                Error = "Super admin login failed"
            });
        }
    }
}
