# API Guide

## User Creation and Deletion

### POST `/api/users`
Creates a new user. Passwords are stored in the database as hashes (via bcrypt).

>[!NOTE]
>When a new user is created, the provided email must be confirmed before the user is able to log in (see below).

#### Parameters:
- `username`
  - type: string 
  - required: true
  - unique: true
- `firstName`
  - type: string 
  - required: true
  - unique: false
- `lastName`
  - type: string 
  - required: true
  - unique: false
- `email`
  - type: string 
  - required: true
  - unique: true
  - validation: isEmail  
- `password`
  - type: string 
  - required: true
  - unique: false

#### Returns:
- `id`
  -  type: UUID v4
-  `username`
-  `firstName`
-  `lastName`
-  `email`

### POST `/confirm/:key`

Path used for links sent to new users to confirm the provided email address.

When a new user is created, a unique key is stored in the database, and a link containing this key is sent to provided email. Before activating an account with this link, it cannot be used to log in.

The user has 30 minutes to follow the link and confirm the provided email. If the email is not confirmed within 30 minutes, the link expires and the user data is removed from the database.

#### Parameters:
- None

#### Returns:
- `Status 200` (no body)

### DELETE `/api/users`

Deletes user identified in token. (This means that users can only authorize requests to delete themselves).

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- None

#### Returns:
- `Status 204` (no body)

## Log-in and Log-out

>[!NOTE]
>Active sessions are automatically pruned from the database after 7 days. 

### POST `/api/login`

Used to log users in.

Checks the provided password against the stored hash. Creates a new `ActiveSession` instance in the database and returns a bearer token for authenticating requests.

#### Parameters:
- `username`
  - type: string
- `password`
  - type: string

#### Returns:
- `id`
  - UUID of user in database
- `username`
- `token`
  - Bearer token for authenticating user requests

### DELETE `/api/login`

Used to log users out.

Removes active session corresponding with the provided token from the database.

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- None

#### Returns:
- `Status 204` (no body)

## Permission Setting

Enables sharing of slices with others.

### PUT `/api/permissions/:id`

Creates or modifies a `StreamUser` instance, which stores user permissions for the stream given with `id`. 

(Stream id is passed in the path because this route uses the same authorization middleware as requests to create new streams.)

>[!IMPORTANT]
>Creating or modifying permissions requires that the creating/modifying user has admin rights for that stream. These are assigned to the creator of a stream by default.

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- `userId`
  - id of the user whose permissions are being created or modified
  - type: UUID v4
  - required: true
- `read`
  - permission to read slices on the stream
  - type: boolean
  - required: false
  - default: true
- `write`
  - permission to add new slices to the stream
  - type: boolean
  - required: false
  - default: false
- `deleteOwn`
  - permission to delete any slices from the stream that were added by the user sending the delete request
  - type: boolean
  - required: false
  - default: false
- `deleteAll`
  - permission to delete all slices from the stream, regardless of who created them, as well as to delete the entire stream
  - type: boolean
  - required: false
  - default: false
- `admin`
  - permission to create or modify user permissions for this stream
  - type: boolean
  - required: false
  - default: false

#### Returns:
- `id`
  - UUID of the `StreamUser` instance
- `userId`
- `streamId`
- `read`
- `write`
- `deleteOwn`
- `deleteAll`
- `admin`
- `createdAt`
- `updatedAt`  

## Stream Creation and Deletion

### POST `/api/streams`

Creates a new stream with the give name. 

Creating user's information is sent via bearer token.

>[!NOTE]
>When a user creates a new stream, maximal permissions for that user/stream are concurrently added to `StreamUser` in the database. 

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- `name`
  - type: string
  - required: true
  - unique: false

#### Returns:
- `id`
  - type: UUID v4 
- `creatorId`
  - UUID of user that created the stream
- `name` 

### DELETE `/api/streams/id`

If authorized, deletes stream with the given id from the database.

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
  - None

#### Returns:
  - `Status 204` (no body)

## Slice Creation and Deletion

### POST `/api/slices/:id`

Adds a new slice to the stream with the given `id` (if user has `write` permissions on that stream).

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- `title`
  - type: string
  - required: false
  - validation:
    - maximum length: 32
- `text`
  - type: string
  - required: false
  - validation:
    - maximum length: 512
- `isPublic`
  - type: boolean
  - required: false
  - default: false
- `isMilestone`
  - type boolean
  - required: false
  - default: false

#### Returns:
- `id`
  - type: UUID v4
- `creatorId`
  - UUID of user that created slice
- `streamId`
  - UUID of stream that slice is on
- `title`
- `text`
- `isPublic`
- `isMilestone` 
- `createdAt`
- `updatedAt`    

### DELETE `/api/slices/:id`

Deletes slice with the given id.

>[!NOTE]
>Deleting requires either `deleteOwn` permissions, which enables deletion for slices that a user has created, or `deleteAll` permissions, which allows a user to delete any slices on the stream.

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- None

#### Returns:
  - `Status 204` (no body)

## Stream and Slice Access

### GET `/api/streams/read`

Gets permission and stream data for all streams that the user has `read` permissions for.

The user is identified via bear token.

>[!NOTE]
>This does not return the data for any slices in the stream. Use GET `/api/slices/:id` for that.

#### Headers:
- `Authorization: Bearer <token>`

#### Parameters:
- None

#### Returns:
Array of `StreamUser` instances joined with their corresponding `Stream`:
- `id`
  - type: UUID v4
  - note that this is the id for the `StreamUser` instance that stores user permissions, not the user or stream id
- `read`
  - type: boolean
- `write`
  - type: boolean
- `deleteOwn`
  - type: boolean
- `deleteAll`
  - type: boolean
- `admin`
  - type: boolean
- `createdAt`
- `updatedAt`
- `Stream` instance:
  - `id`
    - UUID for the stream
  - `name`
    - type: string
  - `creatorID`
    - UUID for the creator of the stream, not necessarily the user accessing it now
  - `createdAt`
  - `updatedAt`   

