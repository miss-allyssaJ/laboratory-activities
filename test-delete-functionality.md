# Delete Functionality Testing Guide

## Prerequisites
- Backend server running on http://localhost:3000
- Frontend server running on http://localhost:3001

## Test Plan

### Phase 1: Backend API Testing (Using curl)

#### Test 1: Register Test Users
```bash
# Register User 1
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser1\",\"email\":\"test1@example.com\",\"password\":\"password123\"}"

# Register User 2
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser2\",\"email\":\"test2@example.com\",\"password\":\"password123\"}"
```

#### Test 2: Login and Get Tokens
```bash
# Login User 1
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test1@example.com\",\"password\":\"password123\"}"

# Save the token from response as TOKEN1

# Login User 2
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test2@example.com\",\"password\":\"password123\"}"

# Save the token from response as TOKEN2
```

#### Test 3: Create Test Post with Comments
```bash
# Create a post as User 1
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d "{\"title\":\"Test Post for Delete\",\"content\":\"This post will be deleted to test cascade delete\"}"

# Save the post ID from response as POST_ID

# Create Comment 1 on the post
curl -X POST http://localhost:3000/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d "{\"content\":\"First comment\"}"

# Create Comment 2 on the post
curl -X POST http://localhost:3000/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN1" \
  -d "{\"content\":\"Second comment\"}"

# Create Comment 3 on the post
curl -X POST http://localhost:3000/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN2" \
  -d "{\"content\":\"Third comment by user 2\"}"
```

#### Test 4: Verify Comments Exist
```bash
# Get all comments for the post
curl -X GET http://localhost:3000/posts/POST_ID/comments

# Expected: Should return 3 comments
```

#### Test 5: Test Comment Deletion Authorization
```bash
# Try to delete User 1's comment as User 2 (should fail with 403)
curl -X DELETE http://localhost:3000/posts/POST_ID/comments/COMMENT1_ID \
  -H "Authorization: Bearer TOKEN2"

# Expected: 403 Forbidden error
```

#### Test 6: Test Successful Comment Deletion
```bash
# Delete User 2's comment as User 2 (should succeed)
curl -X DELETE http://localhost:3000/posts/POST_ID/comments/COMMENT3_ID \
  -H "Authorization: Bearer TOKEN2"

# Expected: {"message": "Comment successfully deleted"}

# Verify comment is deleted
curl -X GET http://localhost:3000/posts/POST_ID/comments

# Expected: Should return only 2 comments now
```

#### Test 7: Test Post Deletion Authorization
```bash
# Try to delete User 1's post as User 2 (should fail with 403)
curl -X DELETE http://localhost:3000/posts/POST_ID \
  -H "Authorization: Bearer TOKEN2"

# Expected: 403 Forbidden error
```

#### Test 8: Test Cascade Delete (Main Test)
```bash
# Get the post with comments before deletion
curl -X GET http://localhost:3000/posts/POST_ID

# Expected: Should show post with 2 remaining comments

# Delete the post as User 1 (should succeed and cascade delete comments)
curl -X DELETE http://localhost:3000/posts/POST_ID \
  -H "Authorization: Bearer TOKEN1"

# Expected: {"message": "Post successfully deleted"}

# Try to get the deleted post (should fail with 404)
curl -X GET http://localhost:3000/posts/POST_ID

# Expected: 404 Not Found error

# Try to get comments for the deleted post (should return empty array or 404)
curl -X GET http://localhost:3000/posts/POST_ID/comments

# Expected: Empty array [] or error
```

#### Test 9: Test Unauthorized Deletion
```bash
# Try to delete without token (should fail with 401)
curl -X DELETE http://localhost:3000/posts/SOME_POST_ID

# Expected: 401 Unauthorized error
```

### Phase 2: Frontend UI Testing (Manual)

#### Test 10: Frontend Post Deletion
1. Open http://localhost:3001 in browser
2. Login as testuser1
3. Create a new post
4. Add 2-3 comments to the post
5. Click "Delete Post" button
6. Confirm deletion in the dialog
7. Verify:
   - Success message is displayed
   - User is redirected to home page
   - Post no longer appears in the list
   - All comments are also deleted (check database or API)

#### Test 11: Frontend Comment Deletion
1. Open a post detail page
2. Add a comment
3. Click "Delete" button on your comment
4. Confirm deletion
5. Verify:
   - Success message or comment disappears
   - Comment is removed from the list
   - Page updates correctly

#### Test 12: Frontend Authorization Check
1. Login as testuser1
2. View a post created by testuser2
3. Verify:
   - "Delete Post" button is NOT visible
   - "Delete" button on testuser2's comments is NOT visible
   - Only your own comments show delete button

### Phase 3: Edge Cases

#### Test 13: Delete Non-existent Post
```bash
curl -X DELETE http://localhost:3000/posts/99999 \
  -H "Authorization: Bearer TOKEN1"

# Expected: 404 Not Found error
```

#### Test 14: Delete Non-existent Comment
```bash
curl -X DELETE http://localhost:3000/posts/1/comments/99999 \
  -H "Authorization: Bearer TOKEN1"

# Expected: 404 Not Found error
```

#### Test 15: Invalid Token
```bash
curl -X DELETE http://localhost:3000/posts/1 \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized error
```

## Expected Results Summary

### ✅ What Should Work:
1. Users can delete their own posts
2. Users can delete their own comments
3. Deleting a post automatically deletes all its comments (cascade)
4. Success messages are returned for successful deletions
5. Proper error messages for unauthorized attempts

### ❌ What Should Fail:
1. Deleting another user's post (403 Forbidden)
2. Deleting another user's comment (403 Forbidden)
3. Deleting without authentication (401 Unauthorized)
4. Deleting non-existent resources (404 Not Found)

## Test Results Checklist

- [ ] User registration works
- [ ] User login works and returns token
- [ ] Post creation works
- [ ] Comment creation works
- [ ] Comment deletion works (authorized user)
- [ ] Comment deletion fails (unauthorized user)
- [ ] Post deletion works (authorized user)
- [ ] Post deletion fails (unauthorized user)
- [ ] Cascade delete works (comments deleted with post)
- [ ] Success messages returned correctly
- [ ] Error messages returned correctly
- [ ] Frontend delete buttons work
- [ ] Frontend shows/hides delete buttons based on ownership
- [ ] Frontend displays success/error messages
