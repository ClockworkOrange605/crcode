# Creative Coding NFT's

A service that allows users to create their Creative Coding Artworks and publish them as NFT tokens.

## Deployment

Make sure that docker-compose is installed and your user has the rights to run `docker`:

```bash
$ sudo apt install docker-compose
$ sudo usermod -aG docker $USER
```

Copy .env file and configure your project:

```bash
$ cp .env.exapmle .env
$ nano .env
```

### DEV environment

Run containers:

```bash
$ docker-compose up -d
```
Everything up and running in `live reload` mode, so you can start coding!

<details>
  <summary>Contract deployment</summary>

  ```bash
    $ docker-compose exec rpc bash -c "npx truffle migrate --network [NETWORK]"
  ```
</details>

### STAGE environment

<details>
  <summary>NGINX config</summary>

  ```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root [$project_root]/web/build/;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:[$api_port]/api/;
    }

    location /preview/ {
        proxy_pass http://127.0.0.1:[$api_port]/preview/;
    }
}
```
</details>

Run containers:

```bash
docker-compose -f docker-compose.stage.yml up -d
```

Build web:

```bash
docker-compose -f docker-compose.stage.yml -f docker-compose.stage.web.yml run web
```
