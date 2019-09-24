# koudeoorlog



# App
## development
```sh
$ cp .env.sample .env
$ vi .env
$ docker-compose -f ./docker/docker-compose-prod.yml up -d
```

## Vue graphql client
https://vue-apollo.netlify.com/guide/installation.html#vue-cli-plugin

## Queries
get all points
```graphql
query PoiQuery {
  poi {
    situation
    lng
    lat
    id
    description
    class
  }
}
```

get all photos
```graphql
query AllPhotos {
  photo_upload {
    created_at
    author
    email
    file_key
    id
    poi_id
    title
    year
  }
}
```

Get photos for point
```graphql
query PhotosForPoint($poi_id: Int!) {
  photo_upload(where: {poi_id: {_eq: !$poi_id}}) {
    created_at
    author
    email
    file_key
    id
    poi_id
    title
    year
  }
}
```

Show a foto
```
http://serveraddress:port/storage/file/[file_key]
```

# Server 

### Setup

```sh
$ cd packages/server
$ npm install
```

### Development

```sh
npm run watch
```

Test uploading by going to
```sh
$ cd packages/servertest
$ npm install
$ npm start
```

### Endpoints
- /storage/upload
  - ! file object
  - ! poi_id
  - ! title
  - ! year
  - ? email
  - ? author
- /storage/file/${file_key}
- /data/load?url=${url}


# GraphQL Endpoint
//TODO



# Production
```sh
$ cp .env.sample .env
$ vi .env
$ docker-compose -f ./docker/docker-compose-prod.yml up -d
```