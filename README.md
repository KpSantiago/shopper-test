### Description
This project is for a seletcive process that will be able to receive a base64 image of a water or gas meter, 
covert her and get his measure after send the image to AI.

### Stack

- Node.js
- Fastify
- Vitest
- Docker
- Gemini
- Github Actions
- SQLite
  
### Commands

01. docker compose up

### Routes

- POST:/upload
- PATCH: /confirm
- GET: /:customer_code/list?measure_type=WATER
