# This should be easy, right?

Right now pipeline is easy:

- Analytics

  ```sh
  cd deploy/plausible
  docker-compose up -d
  ```

- Backend (Database and Storage)

  ```sh
  cd deploy/supabase
  docker-compose up -d -p supabase
  ```

And then you start our frontend:

```sh
# Build image of frontend
docker build -t rgd-chat .
# Start container
docker run -it -d --name rgd-chat rgd-chat
```
