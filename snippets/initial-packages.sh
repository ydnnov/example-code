================================================================================
== back - dev ========================================================================
pnpm i -D \
@swc/cli \
@swc/core \
@types/node \
nodemon \
@types/dotenv-parse-variables \
@types/gm
================================================================================
== back ========================================================================
pnpm i \
dotenv \
dotenv-parse-variables \
eventemitter2 \
fastify \
@fastify/cors \
@fastify/formbody \
@fastify/type-provider-typebox \
ajv \
@sinclair/typebox \
axios \
socket.io \
typeorm \
reflect-metadata \
pg \
winston \
winston-daily-rotate-file \
puppeteer \
gm
================================================================================
== front =======================================================================
pnpm dlx nuxi@latest init front
...
pnpm i \
axios \
socket.io-client \
monaco-editor \
primeicons \
primevue \
@vueuse/core
================================================================================
== front -dev =======================================================================
pnpm i -D \
sass \
nuxt-primevue \
tailwindcss \
postcss \
autoprefixer
================================================================================
== init tailwind ===============================================================
npx tailwindcss init
================================================================================
