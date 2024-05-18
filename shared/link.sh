rm -rf ../back/src/shared/classes
rm -rf ../back/src/shared/types
mkdir ../back/src/shared/classes
mkdir ../back/src/shared/types

ln src/types/common.ts                  ../back/src/shared/types/common.ts
ln src/classes/app.ts                   ../back/src/shared/classes/app.ts
ln src/classes/app-event.ts             ../back/src/shared/classes/app-event.ts
ln src/classes/bus-middleware.ts        ../back/src/shared/classes/bus-middleware.ts
ln src/classes/event-bus.ts             ../back/src/shared/classes/event-bus.ts

rm -rf ../front/src/shared/classes
rm -rf ../front/src/shared/types
mkdir ../front/src/shared/classes
mkdir ../front/src/shared/types

ln src/types/common.ts                  ../front/src/shared/types/common.ts
ln src/classes/app.ts                   ../front/src/shared/classes/app.ts
ln src/classes/app-event.ts             ../front/src/shared/classes/app-event.ts
ln src/classes/bus-middleware.ts        ../front/src/shared/classes/bus-middleware.ts
ln src/classes/event-bus.ts             ../front/src/shared/classes/event-bus.ts
