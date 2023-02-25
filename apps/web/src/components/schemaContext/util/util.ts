import axios from "axios";

export const defaultSchema = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  published Boolean  @default(false)
  viewCount Int      @default(0)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}
          
enum Role {
  USER
  ADMIN
}`;

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);
export const mutator = (url: string, data: any) =>
  axios.post(url, data.arg).then((res) => res.data);
