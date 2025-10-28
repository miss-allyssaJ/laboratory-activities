# Complete Guide: Install Git and Push ACTIVITY 5 to GitHub

## Part 1: Installing Git for Windows

### Step 1: Download Git for Windows

1. Open your web browser
2. Go to: **https://git-scm.com/download/win**
3. The download should start automatically (64-bit version recommended)
4. If not, click on "Click here to download manually"
5. Save the installer file (e.g., `Git-2.43.0-64-bit.exe`)

### Step 2: Run the Git Installer

1. Locate the downloaded file (usually in your Downloads folder)
2. Double-click the installer to run it
3. If prompted by User Account Control, click "Yes"

### Step 3: Installation Wizard Settings

Follow these recommended settings during installation:

#### 1. **License Agreement**
   - Click "Next"

#### 2. **Select Destination Location**
   - Keep default: `C:\Program Files\Git`
   - Click "Next"

#### 3. **Select Components**
   - Keep all default selections checked:
     - ✅ Windows Explorer integration
     - ✅ Git Bash Here
     - ✅ Git GUI Here
     - ✅ Associate .git* configuration files
     - ✅ Associate .sh files to be run with Bash
   - Click "Next"

#### 4. **Select Start Menu Folder**
   - Keep default: "Git"
   - Click "Next"

#### 5. **Choosing the default editor**
   - Select "Use Visual Studio Code as Git's default editor" (recommended)
   - Or keep "Use Vim" if you're comfortable with it
   - Click "Next"

#### 6. **Adjusting the name of the initial branch**
   - Select "Let Git decide" or "Override the default branch name for new repositories" and enter "main"
   - Click "Next"

#### 7. **Adjusting your PATH environment**
   - Select "Git from the command line and also from 3rd-party software" (recommended)
   - Click "Next"

#### 8. **Choosing HTTPS transport backend**
   - Select "Use the OpenSSL library"
   - Click "Next"

#### 9. **Configuring the line ending conversions**
   - Select "Checkout Windows-style, commit Unix-style line endings" (recommended for Windows)
   - Click "Next"

#### 10. **Configuring the terminal emulator**
   - Select "Use MinTTY (the default terminal of MSYS2)"
   - Click "Next"

#### 11. **Choose the default behavior of `git pull`**
   - Select "Default (fast-forward or merge)"
   - Click "Next"

#### 12. **Choose a credential helper**
   - Select "Git Credential Manager"
   - Click "Next"

#### 13. **Configuring extra options**
   - Keep defaults:
     - ✅ Enable file system caching
     - ✅ Enable symbolic links
   - Click "Next"

#### 14. **Configuring experimental options**
   - Leave unchecked (unless you want to try experimental features)
   - Click "Install"

### Step 4: Complete Installation

1. Wait for the installation to complete (1-2 minutes)
2. Uncheck "View Release Notes" (optional)
3. Click "Finish"

### Step 5: Verify Git Installation

1. Open a new Command Prompt or PowerShell window
2. Type: `git --version`
3. You should see something like: `git version 2.43.0.windows.1`

---

## Part 2: Configure Git (First Time Setup)

Before using Git, you need to configure your identity:

### Open Command Prompt or PowerShell and run:

```bash
# Set your name (replace with your actual name)
git config --global user.name "Your Name"

# Set your email (use the email associated with your GitHub account)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

**Important:** Use the same email address that you use for your GitHub account (eydi55).

---

## Part 3: Push ACTIVITY 5 Folder to GitHub

Now that Git is installed, let's push your folder to GitHub!

### Step 1: Open Terminal in Your Project Folder

**Option A: Using Command Prompt**
1. Press `Win + R`
2. Type: `cmd`
3. Press Enter
4. Navigate to your folder:
   ```bash
   cd "C:\Users\Sofia\ACTIVITY 5"
   ```

**Option B: Using PowerShell**
1. Press `Win + X`
2. Select "Windows PowerShell" or "Terminal"
3. Navigate to your folder:
   ```powershell
   cd "C:\Users\Sofia\ACTIVITY 5"
   ```

**Option C: Using File Explorer**
1. Open File Explorer
2. Navigate to: `C:\Users\Sofia\ACTIVITY 5`
3. Right-click in the folder (not on a file)
4. Select "Git Bash Here" (if available after Git installation)

### Step 2: Initialize Git Repository

```bash
# Initialize a new Git repository
git init
```

You should see: `Initialized empty Git repository in C:/Users/Sofia/ACTIVITY 5/.git/`

### Step 3: Add Remote Repository

```bash
# Add your GitHub repository as the remote origin
git remote add origin https://github.com/eydi55/ACT5.git
```

### Step 4: Check Current Branch Name

```bash
# Check which branch you're on
git branch
```

If you see `master`, you might want to rename it to `main` (GitHub's default):

```bash
# Rename branch from master to main (if needed)
git branch -M main
```

### Step 5: Add All Files

```bash
# Add all files to staging area
git add .
```

This will add all files except those listed in `.gitignore` (like node_modules).

### Step 6: Commit Your Changes

```bash
# Commit with a message
git commit -m "Initial commit: Blog Platform Project"
```

You should see a summary of files added.

### Step 7: Push to GitHub

```bash
# Push to GitHub (first time)
git push -u origin main
```

**What happens next:**
- You may be prompted to sign in to GitHub
- A browser window might open for authentication
- Sign in with your GitHub credentials (eydi55)
- After authentication, the push will continue
- Wait for the upload to complete (may take a few minutes)

### Step 8: Verify on GitHub

1. Open your browser
2. Go to: **https://github.com/eydi55/ACT5**
3. You should see all your files uploaded!

---

## Common Issues and Solutions

### Issue 1: "Repository not found" or 403 Error

**Solution:**
```bash
# Check if remote is set correctly
git remote -v

# If incorrect, remove and re-add
git remote remove origin
git remote add origin https://github.com/eydi55/ACT5.git
```

### Issue 2: Repository doesn't exist on GitHub

**Solution:**
1. Go to: https://github.com/new
2. Repository name: `ACT5`
3. Description: "Blog Platform Project"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"
7. Then run the push command again

### Issue 3: Authentication Failed

**Solution:**
- Make sure you're using the correct GitHub username (eydi55)
- You may need to use a Personal Access Token instead of password:
  1. Go to: https://github.com/settings/tokens
  2. Click "Generate new token (classic)"
  3. Give it a name: "Git Push Token"
  4. Select scopes: `repo` (full control)
  5. Click "Generate token"
  6. Copy the token (you won't see it again!)
  7. When prompted for password, paste the token instead

### Issue 4: Large Files or Slow Upload

**Solution:**
- The `.gitignore` file already excludes `node_modules/` folders
- If still slow, check file sizes:
  ```bash
  git ls-files | xargs ls -lh | sort -k5 -hr | head -20
  ```

### Issue 5: "fatal: not a git repository"

**Solution:**
```bash
# Make sure you're in the correct directory
cd "C:\Users\Sofia\ACTIVITY 5"

# Then initialize git
git init
```

---

## Quick Reference: Git Commands

```bash
# Check status of your repository
git status

# See what files changed
git diff

# View commit history
git log

# Pull latest changes from GitHub
git pull origin main

# Push new changes to GitHub
git add .
git commit -m "Your commit message"
git push origin main

# Create a new branch
git checkout -b feature-branch-name

# Switch between branches
git checkout main
git checkout feature-branch-name

# See all branches
git branch -a
```

---

## What Gets Uploaded?

### ✅ Files that WILL be uploaded:
- All source code (`.js`, `.ts`, `.jsx`, `.tsx`, `.css`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- Documentation (`.md` files)
- `.gitignore` file
- Public assets (images, icons, etc.)

### ❌ Files that WON'T be uploaded (thanks to .gitignore):
- `node_modules/` folders (can be reinstalled with `npm install`)
- `dist/` or `build/` folders (generated files)
- `.env` files (sensitive data)
- IDE-specific files (`.vscode/`, `.idea/`)
- Log files
- OS-specific files (`.DS_Store`, `Thumbs.db`)

---

## Next Steps After Pushing

1. **Verify Upload:** Check https://github.com/eydi55/ACT5
2. **Add README:** Make sure your README.md is visible on the repository page
3. **Set Repository Settings:**
   - Add description
   - Add topics/tags
   - Choose visibility (public/private)
4. **Share:** Share the repository link with others if needed

---

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify you're in the correct directory
3. Ensure Git is properly installed (`git --version`)
4. Check your internet connection
5. Verify the repository exists on GitHub
6. Make sure you're authenticated with the correct account

**Your Repository URL:** https://github.com/eydi55/ACT5.git
**Local Folder:** C:\Users\Sofia\ACTIVITY 5

---

## Alternative: Using VSCode's Built-in Git

If you have VSCode open:
1. Open the Source Control panel (Ctrl+Shift+G)
2. Click "Initialize Repository"
3. Stage all changes (click the + icon)
4. Enter commit message
5. Click the "..." menu → Remote → Add Remote
6. Enter: `https://github.com/eydi55/ACT5.git`
7. Click "..." menu → Push
