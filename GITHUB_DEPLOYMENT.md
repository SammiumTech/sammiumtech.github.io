# Deploy to zelop301/Samy-Lopez-Sammium-Tech

Target repository:

`https://github.com/zelop301/Samy-Lopez-Sammium-Tech`

Expected GitHub Pages address after a successful deployment:

`https://zelop301.github.io/Samy-Lopez-Sammium-Tech/`

## Recommended upload method: GitHub Desktop

1. Install and sign in to GitHub Desktop using the `zelop301` account.
2. Clone `zelop301/Samy-Lopez-Sammium-Tech`.
3. Make a backup branch before replacing the existing files:
   - Branch → New branch
   - Name it `backup-before-portfolio-merge`
   - Publish the branch.
4. Return to the `main` branch.
5. Delete the old working-tree files, but do not delete the hidden `.git` folder.
6. Extract the supplied `Sammium_Portfolio_Suite_GitHub_Ready.zip` and copy its contents into the repository root.
7. In GitHub Desktop, review the changes and commit with:

   `Merge QuantumVerse, AgriMind AI, and Research Lab into portfolio`

8. Push the commit to `main`.
9. On GitHub, open **Settings → Pages**.
10. Under **Build and deployment**, set **Source** to **GitHub Actions**.
11. Open the **Actions** tab and watch **Deploy Sammium Portfolio**.

The included workflow runs `npm ci`, TypeScript checks, builds all three project clients, embeds them into the portfolio, and deploys the final static site.

## Command-line alternative

```bash
git clone https://github.com/zelop301/Samy-Lopez-Sammium-Tech.git
cd Samy-Lopez-Sammium-Tech

git switch -c backup-before-portfolio-merge
git push -u origin backup-before-portfolio-merge
git switch main

# Copy the extracted GitHub-ready package contents into this folder.

git add -A
git commit -m "Merge QuantumVerse, AgriMind AI, and Research Lab into portfolio"
git push origin main
```

## GitHub Pages limitation

GitHub Pages hosts static frontend files. The project interfaces and browser-side simulations work there, but Express/Gemini endpoints require a separate Node-compatible backend deployment. Never place provider keys in frontend variables or commit `.env` files.
