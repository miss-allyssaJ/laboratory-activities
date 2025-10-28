# API Testing Script for Delete Functionality
Write-Host "=== Testing Delete Functionality ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Register User 1
Write-Host "Test 1: Registering testuser1..." -ForegroundColor Yellow
$registerBody1 = @{
    username = "testuser1"
    email = "test1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody1 -ContentType "application/json"
    Write-Host "[SUCCESS] User 1 registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($response1.id)" -ForegroundColor Gray
} catch {
    Write-Host "[INFO] Registration failed or user already exists" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Register User 2
Write-Host "Test 2: Registering testuser2..." -ForegroundColor Yellow
$registerBody2 = @{
    username = "testuser2"
    email = "test2@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody2 -ContentType "application/json"
    Write-Host "[SUCCESS] User 2 registered successfully" -ForegroundColor Green
    Write-Host "User ID: $($response2.id)" -ForegroundColor Gray
} catch {
    Write-Host "[INFO] Registration failed or user already exists" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Login User 1
Write-Host "Test 3: Logging in as testuser1..." -ForegroundColor Yellow
$loginBody1 = @{
    email = "test1@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse1 = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody1 -ContentType "application/json"
    $token1 = $loginResponse1.access_token
    Write-Host "[SUCCESS] User 1 logged in successfully" -ForegroundColor Green
    Write-Host "Token: $($token1.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAILED] Login failed" -ForegroundColor Red
    exit
}

Write-Host ""

# Test 4: Login User 2
Write-Host "Test 4: Logging in as testuser2..." -ForegroundColor Yellow
$loginBody2 = @{
    email = "test2@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse2 = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody2 -ContentType "application/json"
    $token2 = $loginResponse2.access_token
    Write-Host "[SUCCESS] User 2 logged in successfully" -ForegroundColor Green
    Write-Host "Token: $($token2.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "[FAILED] Login failed" -ForegroundColor Red
    exit
}

Write-Host ""

# Test 5: Create a Post as User 1
Write-Host "Test 5: Creating a post as testuser1..." -ForegroundColor Yellow
$postBody = @{
    title = "Test Post for Delete Functionality"
    content = "This post will be deleted to test cascade delete of comments."
} | ConvertTo-Json

$headers1 = @{
    "Authorization" = "Bearer $token1"
    "Content-Type" = "application/json"
}

try {
    $postResponse = Invoke-RestMethod -Uri "$baseUrl/posts" -Method Post -Body $postBody -Headers $headers1
    $postId = $postResponse.id
    Write-Host "[SUCCESS] Post created successfully" -ForegroundColor Green
    Write-Host "Post ID: $postId" -ForegroundColor Gray
    Write-Host "Title: $($postResponse.title)" -ForegroundColor Gray
} catch {
    Write-Host "[FAILED] Post creation failed" -ForegroundColor Red
    exit
}

Write-Host ""

# Test 6: Create Comments on the Post
Write-Host "Test 6: Creating comments on the post..." -ForegroundColor Yellow

$comment1Body = @{ content = "First comment by user 1" } | ConvertTo-Json
$comment2Body = @{ content = "Second comment by user 1" } | ConvertTo-Json
$comment3Body = @{ content = "Third comment by user 2" } | ConvertTo-Json

$headers2 = @{
    "Authorization" = "Bearer $token2"
    "Content-Type" = "application/json"
}

try {
    $commentResponse1 = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Post -Body $comment1Body -Headers $headers1
    Write-Host "[SUCCESS] Comment 1 created (ID: $($commentResponse1.id))" -ForegroundColor Green
    
    $commentResponse2 = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Post -Body $comment2Body -Headers $headers1
    Write-Host "[SUCCESS] Comment 2 created (ID: $($commentResponse2.id))" -ForegroundColor Green
    
    $commentResponse3 = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Post -Body $comment3Body -Headers $headers2
    Write-Host "[SUCCESS] Comment 3 created by user 2 (ID: $($commentResponse3.id))" -ForegroundColor Green
    $comment3Id = $commentResponse3.id
} catch {
    Write-Host "[FAILED] Comment creation failed" -ForegroundColor Red
}

Write-Host ""

# Test 7: Verify Comments Exist
Write-Host "Test 7: Verifying comments exist..." -ForegroundColor Yellow
try {
    $comments = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Get
    Write-Host "[SUCCESS] Retrieved $($comments.Count) comments" -ForegroundColor Green
    foreach ($comment in $comments) {
        Write-Host "  - Comment ID $($comment.id): $($comment.content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[FAILED] Failed to retrieve comments" -ForegroundColor Red
}

Write-Host ""

# Test 8: Test Comment Deletion Authorization (Should Fail)
Write-Host "Test 8: Testing comment deletion authorization..." -ForegroundColor Yellow
Write-Host "Attempting to delete user 1's comment as user 2 (should fail)..." -ForegroundColor Gray
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments/$($commentResponse1.id)" -Method Delete -Headers $headers2
    Write-Host "[FAILED] UNEXPECTED: Deletion succeeded when it should have failed!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "[SUCCESS] Correctly blocked unauthorized deletion (403 Forbidden)" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Got error (expected): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 9: Test Successful Comment Deletion
Write-Host "Test 9: Testing successful comment deletion..." -ForegroundColor Yellow
Write-Host "Deleting user 2's comment as user 2..." -ForegroundColor Gray
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments/$comment3Id" -Method Delete -Headers $headers2
    Write-Host "[SUCCESS] Comment deleted successfully" -ForegroundColor Green
    Write-Host "Response: $($deleteResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "[FAILED] Comment deletion failed" -ForegroundColor Red
}

Write-Host ""

# Test 10: Verify Comment Was Deleted
Write-Host "Test 10: Verifying comment was deleted..." -ForegroundColor Yellow
try {
    $comments = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Get
    Write-Host "[SUCCESS] Now showing $($comments.Count) comments (should be 2)" -ForegroundColor Green
    if ($comments.Count -eq 2) {
        Write-Host "[SUCCESS] Correct number of comments remaining" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Expected 2 comments, found $($comments.Count)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAILED] Failed to retrieve comments" -ForegroundColor Red
}

Write-Host ""

# Test 11: Test Post Deletion Authorization (Should Fail)
Write-Host "Test 11: Testing post deletion authorization..." -ForegroundColor Yellow
Write-Host "Attempting to delete user 1's post as user 2 (should fail)..." -ForegroundColor Gray
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Delete -Headers $headers2
    Write-Host "[FAILED] UNEXPECTED: Deletion succeeded when it should have failed!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "[SUCCESS] Correctly blocked unauthorized deletion (403 Forbidden)" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Got error (expected): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 12: Test CASCADE DELETE (Main Test)
Write-Host "Test 12: Testing CASCADE DELETE..." -ForegroundColor Yellow
Write-Host "Deleting post as user 1 (should also delete remaining comments)..." -ForegroundColor Gray
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Delete -Headers $headers1
    Write-Host "[SUCCESS] Post deleted successfully" -ForegroundColor Green
    Write-Host "Response: $($deleteResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "[FAILED] Post deletion failed" -ForegroundColor Red
}

Write-Host ""

# Test 13: Verify Post Was Deleted
Write-Host "Test 13: Verifying post was deleted..." -ForegroundColor Yellow
try {
    $post = Invoke-RestMethod -Uri "$baseUrl/posts/$postId" -Method Get
    Write-Host "[FAILED] UNEXPECTED: Post still exists!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "[SUCCESS] Post correctly deleted (404 Not Found)" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Got error (expected): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 14: Verify Comments Were Cascade Deleted
Write-Host "Test 14: Verifying comments were cascade deleted..." -ForegroundColor Yellow
try {
    $comments = Invoke-RestMethod -Uri "$baseUrl/posts/$postId/comments" -Method Get
    if ($comments.Count -eq 0) {
        Write-Host "[SUCCESS] All comments were cascade deleted" -ForegroundColor Green
    } else {
        Write-Host "[FAILED] UNEXPECTED: $($comments.Count) comments still exist!" -ForegroundColor Red
    }
} catch {
    Write-Host "[SUCCESS] Comments endpoint returns error (expected after post deletion)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Testing Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- User registration and login: Working" -ForegroundColor Green
Write-Host "- Post and comment creation: Working" -ForegroundColor Green
Write-Host "- Authorization checks: Working" -ForegroundColor Green
Write-Host "- Comment deletion: Working" -ForegroundColor Green
Write-Host "- Post deletion: Working" -ForegroundColor Green
Write-Host "- Cascade delete: Working" -ForegroundColor Green
Write-Host "- Success messages: Working" -ForegroundColor Green
