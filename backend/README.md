# Blog Backend

Blog uygulamasının backend kısmı. NestJS ve TypeScript kullanarak yapıldı.

Starter template olarak https://dev.to/micalevisk/5-steps-to-create-a-bare-minimum-nestjs-app-from-scratch-5c3b baz alındı.

## Kullanılan Teknolojiler

- NestJS
- TypeScript
- Express
- Bun

## Nasıl Çalıştırılır

```bash
cp .env.example .env

bun install

bun run start:dev
```

Uygulama http://localhost:3000 adresinde açılacak.

## Build

```bash
bun run build
```

## İleride Eklenebilecekler

- Gelişmiş Filteleme ve Sıralama
- Rate Limit
- Loglama