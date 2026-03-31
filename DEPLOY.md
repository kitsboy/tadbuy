# TadBuy Metrics Deployment — tools.giveabit.io/tadbuy
# Created: 2026-03-13

## Architecture

```
Internet → Cloudflare Tunnel → nginx (:8888) → TadBuy (:3002)
                                      ↓
                               /stranded (:3003) [future]
```

## Step 1: Build TadBuy Docker Image

```bash
cd /data/.openclaw/workspace/tadbuy-metrics
docker build -t tadbuy-metrics:latest .
```

## Step 2: Run TadBuy on Port 3002

```bash
docker run -d \
  --name tadbuy-metrics \
  --restart unless-stopped \
  -p 127.0.0.1:3002:8080 \
  -v /home/umbrel/tadbuy-data:/data/tadbuy-metrics \
  -e PORT=8080 \
  -e DATA_DIR=/data/tadbuy-metrics \
  -e BRAVE_API_KEY="" \
  tadbuy-metrics:latest
```

## Step 3: Install nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

## Step 4: Create nginx Config

File: `/etc/nginx/sites-available/tools-giveabit`

```nginx
server {
    listen 8888;
    server_name _;

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # TadBuy Metrics — /tadbuy routes to port 3002
    location /tadbuy {
        rewrite ^/tadbuy/(.*) /$1 break;
        rewrite ^/tadbuy$ / break;
        
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Prefix /tadbuy;
    }

    # TadBuy API endpoints (explicit paths)
    location /tadbuy/api/ {
        rewrite ^/tadbuy/(.*) /$1 break;
        
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Future: Stranded Canada — /stranded routes to port 3003
    # location /stranded {
    #     rewrite ^/stranded/(.*) /$1 break;
    #     rewrite ^/stranded$ / break;
    #     proxy_pass http://127.0.0.1:3003;
    #     proxy_http_version 1.1;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # }

    # Default: return 404
    location / {
        return 404;
    }
}
```

Enable the site:
```bash
sudo ln -sf /etc/nginx/sites-available/tools-giveabit /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## Step 5: Configure Cloudflare Tunnel

The tunnel should point to `http://localhost:8888`

Verify tunnel config:
```bash
cat ~/.cloudflared/config.yml
```

Should contain:
```yaml
tunnel: 8ee77271-b9a6-4f44-a669-3db3f6a5251f
credentials-file: /home/umbrel/.cloudflared/8ee77271-b9a6-4f44-a669-3db3f6a5251f.json

ingress:
  - hostname: tools.giveabit.io
    service: http://localhost:8888
  - service: http_status:404
```

Restart tunnel:
```bash
sudo systemctl restart cloudflared
```

## Step 6: Verify Deployment

```bash
# Test locally
curl http://localhost:3002/health
curl http://localhost:8888/tadbuy/health

# Test via Cloudflare
curl https://tools.giveabit.io/tadbuy/health
```

## Systemd Services

### TadBuy Container Service

Create `/etc/systemd/system/tadbuy-metrics.service`:

```ini
[Unit]
Description=TadBuy Metrics Dashboard
After=docker.service
Requires=docker.service

[Service]
Restart=always
RestartSec=5
ExecStartPre=-/usr/bin/docker rm -f tadbuy-metrics
ExecStart=/usr/bin/docker run \
    --name tadbuy-metrics \
    -p 127.0.0.1:3002:8080 \
    -v /home/umbrel/tadbuy-data:/data/tadbuy-metrics \
    -e PORT=8080 \
    -e DATA_DIR=/data/tadbuy-metrics \
    -e BRAVE_API_KEY=%i \
    tadbuy-metrics:latest
ExecStop=/usr/bin/docker stop -t 30 tadbuy-metrics
ExecStopPost=-/usr/bin/docker rm -f tadbuy-metrics

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable tadbuy-metrics
sudo systemctl start tadbuy-metrics
```

---

## Monitoring

Check logs:
```bash
# TadBuy logs
docker logs -f tadbuy-metrics

# nginx logs
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log

# Cloudflare tunnel logs
sudo journalctl -u cloudflared -f
```

---

**Status:** Ready for deployment
