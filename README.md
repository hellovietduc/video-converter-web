# video-converter-web

A video converter website

## Setup server

```
cd server
```

### Prerequisites (on Linux only)

Install HandBrakeCLI:

```
sudo add-apt-repository --yes ppa:stebbins/handbrake-releases
sudo apt-get update
sudo apt-get install handbrake-cli
```

### Run in development mode

Create `.env` file:

```
PORT=3000
FILE_LIFETIME=5 # minutes
```

Run:

```
npm run build
npm run dev
```

### Run with Docker Compose

```
docker build --rm -t video-converter-api:latest .
docker-compose -f "docker-compose.yml" up -d
```

### Demo client

Go to `http://localhost:3000`

## APIs

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | /videos       | Upload video to convert      |
| GET    | /videos/:hash | Download the converted video |
| DELETE | /videos/:hash | Cancel the converting video  |

## Socket.IO events

### "progress": video is converting

Example data:

```
{
  hash: "78e731027d8fd50ed642340b7c9a63b3",
  filename: "sample.mp4",
  percentComplete: 70,
  eta: "00h00m15s"
}
```

### "complete": video is converted

Example data:

```
{
  hash: "78e731027d8fd50ed642340b7c9a63b3"
}
```

### "cancelled": video convert is cancelled

Example data:

```
{
  hash: "78e731027d8fd50ed642340b7c9a63b3"
}
```
