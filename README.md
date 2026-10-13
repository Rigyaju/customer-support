# Customer Support Feedback Portal

A small Node.js + Express feedback portal. It limits feedback to 100 characters, shows a loading screen for about 8 seconds before submitting, and redirects visitors to a closed notice when submissions are disabled.

## Important hosting note

**GitHub Pages only hosts static files; it cannot run this backend or save feedback by itself.** Keep the code in GitHub, then deploy the app to a Node.js host such as Render. The included `render.yaml` configures a persistent disk so saved feedback can survive restarts on a supported Render plan. Check your host's current plan and disk pricing before deploying.

## 1. Add your logo

Put your white-background company logo at `public/companylogo.png`. Keep that exact filename.

## 2. Run locally

Install Node.js 18 or newer, then run:

```bash
npm install
npm start
```

Open http://localhost:3000. Feedback is saved to `data/feedback.json`.

## 3. Put it on GitHub and deploy

1. Create a new GitHub repository.
2. Upload these project files (including the `public` folder and `render.yaml`).
3. In Render, create a new **Blueprint** and connect the GitHub repository.
4. Review the service and persistent disk settings, then deploy.
5. Open the URL Render provides.

The backend stores the message and submission timestamp in `feedback.json` under `DATA_DIR`. The supplied Render configuration uses `/var/data`.

## 4. Close or reopen feedback

In your hosting provider's environment variables, set:

- `PORTAL_OPEN=false` to close the portal. Visitors are sent to `/closed`, which says feedback is not being accepted.
- `PORTAL_OPEN=true` to reopen it.

Save the environment change and restart/redeploy if the host asks you to. The server checks this setting for every submission, so a person who left the form open cannot submit after it is closed.

## Data and privacy notes

- Feedback text is limited to 100 characters in both the browser and server.
- Anyone with access to the server's data disk or `data/feedback.json` can read submissions. Don't collect passwords, payment details, or other sensitive information.
- This is a minimal starter, not a hardened enterprise support system. Add authentication and a retention policy if feedback needs restricted access or contains personal information.
- Keep the persistent disk mounted at `DATA_DIR`; otherwise many hosting platforms use temporary storage and submissions may disappear after restarts.
