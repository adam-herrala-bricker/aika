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

## Log-in and Log-out

>[!NOTE]
>Active sessions are automatically pruned from the database after 7 days. 

### POST `/api/login`

Used to log users in.

Checks the provided password against the stored hash. Creates a new active session in the database and returns a bearer token for authenticating requests.

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
