# Checkmark sync

The To do tab saves checkmarks in the browser right away. When `SYNC_URL` in `index.html` is set, it also syncs them through a Google Sheet so every device sees the same list. With `SYNC_URL` empty, checks stay on each device only.

## Setup (one time, about 5 minutes)

1. Open https://sheets.new and name the sheet something like "Wedding checklist sync".
2. In the sheet, go to **Extensions → Apps Script**. Delete the starter code, paste in everything from `sync/apps-script.gs`, and save.
3. Click **Deploy → New deployment**. Choose the type **Web app**, then set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permission prompt (Google warns that the app is unverified; choose Advanced → Go to project), and copy the **Web app URL** (it ends in `/exec`).
5. Paste that URL into `SYNC_URL` in `index.html`, or send it to Claude to add.

The first time each browser loads the synced page, it uploads the checks it already had, so nothing is lost.

## Notes

- The sheet's **Checkmarks** tab has one row per item: `id` (the checkbox `data-id`), `done`, and `updated`. Changing `done` in the sheet shows up on the page within about 30 seconds.
- Anyone with the web app URL can change checkmarks. The URL is in the page source, so treat it the same as the page link.
- If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
