rm -rf ../back/src/shared/classes
rm -rf ../back/src/shared/constants
rm -rf ../back/src/shared/schemas
rm -rf ../back/src/shared/types
mkdir ../back/src/shared/classes
mkdir ../back/src/shared/constants
mkdir ../back/src/shared/schemas
mkdir ../back/src/shared/schemas/parser-task
mkdir ../back/src/shared/types

ln src/classes/app.ts                   ../back/src/shared/classes/app.ts
ln src/classes/app-event.ts             ../back/src/shared/classes/app-event.ts
ln src/classes/bus-middleware.ts        ../back/src/shared/classes/bus-middleware.ts
ln src/classes/event-bus.ts             ../back/src/shared/classes/event-bus.ts
ln src/constants/parsing.ts             ../back/src/shared/constants/parsing.ts
ln src/schemas/common.ts                ../back/src/shared/schemas/common.ts
ln src/schemas/parser-task/create.ts    ../back/src/shared/schemas/parser-task/create.ts
ln src/schemas/parser-task/delete.ts    ../back/src/shared/schemas/parser-task/delete.ts
ln src/schemas/parser-task/read.ts      ../back/src/shared/schemas/parser-task/read.ts
ln src/schemas/parser-task/update.ts    ../back/src/shared/schemas/parser-task/update.ts
ln src/schemas/parsing.ts               ../back/src/shared/schemas/parsing.ts

rm -rf ../front/src/shared/classes
rm -rf ../front/src/shared/constants
rm -rf ../front/src/shared/schemas
rm -rf ../front/src/shared/types
mkdir ../front/src/shared/classes
mkdir ../front/src/shared/constants
mkdir ../front/src/shared/schemas
mkdir ../front/src/shared/schemas/parser-task
mkdir ../front/src/shared/types

ln src/classes/app.ts                   ../front/src/shared/classes/app.ts
ln src/classes/app-event.ts             ../front/src/shared/classes/app-event.ts
ln src/classes/bus-middleware.ts        ../front/src/shared/classes/bus-middleware.ts
ln src/classes/event-bus.ts             ../front/src/shared/classes/event-bus.ts
ln src/schemas/common.ts                ../front/src/shared/schemas/common.ts
ln src/schemas/parser-task/create.ts    ../front/src/shared/schemas/parser-task/create.ts
ln src/schemas/parser-task/delete.ts    ../front/src/shared/schemas/parser-task/delete.ts
ln src/schemas/parser-task/read.ts      ../front/src/shared/schemas/parser-task/read.ts
ln src/schemas/parser-task/update.ts    ../front/src/shared/schemas/parser-task/update.ts
