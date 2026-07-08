# Cutover runbook — EC2 + Caddy

One-time steps to move the site from **EC2 + nginx** to **EC2 + Caddy** serving the
static export. After this, every future deploy is just `./deploy/deploy.sh`.

The site stays on the **same EC2 box**, so DNS almost certainly already points here —
the cutover is really just "swap nginx for Caddy on this machine." No new server, no
migration.

---

## 0. Prerequisites (check first)

- SSH access to the EC2 box (you have this today for the current site).
- The box's **security group allows inbound 80 and 443** (nginx already uses them).
- DNS: `www.evanshwu.com` **A record → this box's public IP** (already true — the live
  site runs here). Add an **A record for the apex `evanshwu.com` → same IP** if it
  isn't set, so the apex→www redirect works. Confirm with:
  ```bash
  dig +short www.evanshwu.com
  dig +short evanshwu.com
  ```
  Both should return this box's IP.

## 1. Point the deploy script at your box (local, ~1 min)

Edit `deploy/deploy.sh` and set:

- `REMOTE_USER` — your SSH user (e.g. `ubuntu`, `ec2-user`)
- `REMOTE_HOST` — the EC2 **public DNS or IP** (the SSH target, e.g.
  `ec2-…​.compute.amazonaws.com`)
- `REMOTE_PATH` — leave as `/var/www/portfolio` unless you change it in the Caddyfile
- `SSH_KEY` — path to the key that logs into the box (or export `SSH_KEY=…​`)

Verify you can log in: `ssh -i <key> <user>@<host>`

## 2. Install Caddy on the box (SSH, ~2 min)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

Create the web root:

```bash
sudo mkdir -p /var/www/portfolio
sudo chown -R "$USER":"$USER" /var/www/portfolio   # so rsync can write without sudo
```

Install the config (copy `deploy/Caddyfile` from this repo to the box):

```bash
# from your laptop:
scp deploy/Caddyfile <user>@<host>:/tmp/Caddyfile
# on the box:
sudo mv /tmp/Caddyfile /etc/caddy/Caddyfile
```

## 3. Push the site (local)

```bash
./deploy/deploy.sh        # builds ./out and rsyncs it to /var/www/portfolio
```

At this point the files are on the box but **nginx is still serving port 80/443**.

## 4. Cutover: nginx → Caddy (SSH, ~30s of downtime)

Caddy needs ports 80/443 to bind and to complete the Let's Encrypt HTTP challenge, so
nginx has to release them first.

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx        # keep it from restarting on reboot
sudo systemctl enable --now caddy   # start Caddy + auto-start on boot
sudo systemctl reload caddy         # (no-op if it just started; use after config edits)
```

Caddy will fetch HTTPS certificates automatically within a few seconds. Watch it:

```bash
sudo journalctl -u caddy -f         # look for "certificate obtained successfully"
```

## 5. Verify (local)

```bash
curl -sI https://www.evanshwu.com/                     # 200
curl -sI https://www.evanshwu.com/projects/fridgepi    # 200
curl -sI https://www.evanshwu.com/projects/fridgepi.html   # 301 -> /projects/fridgepi
curl -sI https://evanshwu.com/                         # 301 -> https://www.evanshwu.com/
curl -s  https://www.evanshwu.com/sitemap.xml | head   # lists all pages
```

Then open the site in a browser, and paste `https://www.evanshwu.com/projects/fridgepi`
into a chat app (Slack/iMessage/Discord) to confirm the link preview (OG image + title).

## Rollback

If anything is wrong, nginx is untouched on the box:

```bash
sudo systemctl stop caddy
sudo systemctl start nginx
```

You're back to the old site instantly. Fix, then retry from step 4.

## Everyday deploys, after cutover

```bash
./deploy/deploy.sh
```

That's it. Build + upload, ~30 seconds, no downtime (rsync updates files in place;
Caddy serves the new ones immediately).
