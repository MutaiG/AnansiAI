using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;
using System.Security.Claims;
using System.Text.Json;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<CoursesController> _logger;

    public CoursesController(AnansiDbContext context, ILogger<CoursesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // POST: api/courses/{courseId}/discussion/posts
    [HttpPost("{courseId}/discussion/posts")]
    public async Task<ActionResult<ApiResponse<DiscussionPostDto>>> CreateDiscussionPost(
        int courseId, 
        [FromBody] CreateDiscussionPostRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if user is enrolled in the course
            var enrollment = await _context.CourseEnrollments
                .FirstOrDefaultAsync(e => e.CourseId == courseId && e.StudentId == userId);

            if (enrollment == null)
            {
                return Forbid("Not enrolled in this course");
            }

            var newPost = new DiscussionPost
            {
                CourseId = courseId,
                AuthorId = userId,
                Title = request.Title,
                Content = request.Content,
                Tags = JsonSerializer.Serialize(request.Tags ?? new List<string>()),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.DiscussionPosts.Add(newPost);
            await _context.SaveChangesAsync();

            // Load the created post with author info
            var createdPost = await _context.DiscussionPosts
                .Include(p => p.Author)
                .FirstAsync(p => p.PostId == newPost.PostId);

            var postDto = new DiscussionPostDto
            {
                Id = createdPost.PostId.ToString(),
                Author = new AuthorDto
                {
                    Name = createdPost.Author.FullName,
                    Role = "student",
                    Avatar = createdPost.Author.PhotoUrl
                },
                Title = createdPost.Title,
                Content = createdPost.Content,
                Timestamp = createdPost.CreatedAt,
                Likes = 0,
                IsPinned = false,
                Tags = JsonSerializer.Deserialize<List<string>>(createdPost.Tags) ?? new List<string>(),
                IsLiked = false,
                Replies = new List<DiscussionReplyDto>()
            };

            return Ok(new ApiResponse<DiscussionPostDto>
            {
                Success = true,
                Data = postDto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating discussion post for course {CourseId}", courseId);
            return Ok(new ApiResponse<DiscussionPostDto>
            {
                Success = false,
                Error = "Failed to create discussion post"
            });
        }
    }

    // POST: api/courses/discussion/posts/{postId}/replies
    [HttpPost("discussion/posts/{postId}/replies")]
    public async Task<ActionResult<ApiResponse<DiscussionReplyDto>>> CreateDiscussionReply(
        int postId, 
        [FromBody] CreateDiscussionReplyRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var post = await _context.DiscussionPosts
                .Include(p => p.Course)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null)
            {
                return NotFound("Discussion post not found");
            }

            // Check if user is enrolled in the course
            var enrollment = await _context.CourseEnrollments
                .FirstOrDefaultAsync(e => e.CourseId == post.CourseId && e.StudentId == userId);

            if (enrollment == null)
            {
                return Forbid("Not enrolled in this course");
            }

            var newReply = new DiscussionReply
            {
                PostId = postId,
                AuthorId = userId,
                Content = request.Content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.DiscussionReplies.Add(newReply);
            await _context.SaveChangesAsync();

            // Load the created reply with author info
            var createdReply = await _context.DiscussionReplies
                .Include(r => r.Author)
                .FirstAsync(r => r.ReplyId == newReply.ReplyId);

            var replyDto = new DiscussionReplyDto
            {
                Id = createdReply.ReplyId.ToString(),
                Author = new AuthorDto
                {
                    Name = createdReply.Author.FullName,
                    Role = "student",
                    Avatar = createdReply.Author.PhotoUrl
                },
                Content = createdReply.Content,
                Timestamp = createdReply.CreatedAt,
                Likes = 0,
                IsLiked = false
            };

            return Ok(new ApiResponse<DiscussionReplyDto>
            {
                Success = true,
                Data = replyDto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating discussion reply for post {PostId}", postId);
            return Ok(new ApiResponse<DiscussionReplyDto>
            {
                Success = false,
                Error = "Failed to create discussion reply"
            });
        }
    }

    // POST: api/courses/discussion/posts/{postId}/like
    [HttpPost("discussion/posts/{postId}/like")]
    public async Task<ActionResult<ApiResponse<bool>>> TogglePostLike(int postId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var post = await _context.DiscussionPosts
                .Include(p => p.PostLikes)
                .FirstOrDefaultAsync(p => p.PostId == postId);

            if (post == null)
            {
                return NotFound("Discussion post not found");
            }

            var existingLike = post.PostLikes.FirstOrDefault(pl => pl.UserId == userId);

            if (existingLike != null)
            {
                // Unlike the post
                _context.PostLikes.Remove(existingLike);
                post.Likes = Math.Max(0, post.Likes - 1);
            }
            else
            {
                // Like the post
                var newLike = new PostLike
                {
                    PostId = postId,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PostLikes.Add(newLike);
                post.Likes++;
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = existingLike == null // true if liked, false if unliked
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like for post {PostId}", postId);
            return Ok(new ApiResponse<bool>
            {
                Success = false,
                Error = "Failed to toggle post like"
            });
        }
    }

    // POST: api/courses/discussion/replies/{replyId}/like
    [HttpPost("discussion/replies/{replyId}/like")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleReplyLike(int replyId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var reply = await _context.DiscussionReplies
                .Include(r => r.ReplyLikes)
                .FirstOrDefaultAsync(r => r.ReplyId == replyId);

            if (reply == null)
            {
                return NotFound("Discussion reply not found");
            }

            var existingLike = reply.ReplyLikes.FirstOrDefault(rl => rl.UserId == userId);

            if (existingLike != null)
            {
                // Unlike the reply
                _context.ReplyLikes.Remove(existingLike);
                reply.Likes = Math.Max(0, reply.Likes - 1);
            }
            else
            {
                // Like the reply
                var newLike = new ReplyLike
                {
                    ReplyId = replyId,
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ReplyLikes.Add(newLike);
                reply.Likes++;
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = existingLike == null // true if liked, false if unliked
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling like for reply {ReplyId}", replyId);
            return Ok(new ApiResponse<bool>
            {
                Success = false,
                Error = "Failed to toggle reply like"
            });
        }
    }
}

// Request DTOs
public class CreateDiscussionPostRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string>? Tags { get; set; }
}

public class CreateDiscussionReplyRequest
{
    public string Content { get; set; } = string.Empty;
}
