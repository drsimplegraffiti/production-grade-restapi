# using OOP

## Prisma

```bash
npm install @prisma/client
```

##### init prisma

```bash
npx prisma init
```

This will create a new directory called `prisma` in your project root . Also it will create a new file called `schema.prisma` in the `prisma` directory.
Then the .env file will be created in the root directory of your project.

Change the provider to `mysql` in the `schema.prisma` file.

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

To run a mysql server in docker, run the following command:
Create a docker-compose.yml file in the root directory of your project.

```yaml
version: "3.1"

services:
  mysql:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_USER: root
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: prisma_db
    ports:
      - "3306:3306" #the first port is the port on the host machine  ie the machine running the docker container and the second port is the port on the container itself ie the mysql container in this case
```

you can also change the port tp `3307:3306` if you have a mysql server running on your machine.

Then run the following command:

```bash
docker-compose up -d
```

Then then configure the DATABASE_URL in the .env file to the following:

```env
DATABASE_URL="mysql://root:password@localhost:3306/prisma_db?schema=public"
```

Before we run our prisma migrate command, let's create our model in the `schema.prisma` file.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  name  String @unique
  email String  @unique // this will make the email field unique
  password String
  profilepic String? // this will make the profilepic field optional
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isVerified Boolean @default(false)
  isBlocked Boolean @default(false)
  role Role @default(USER)


    blogs Blog[] // this will create a one to many relationship between the user and the blog model

  @@map("users") // so this will be the name of the table in the database
}

model Blog {
  id Int @id @default(autoincrement())
  title String
  content String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean @default(false)

    user User @relation(fields: [userId], references: [id])
    userId Int

    @@map("blogs")
}

enum Role {
  ADMIN
  USER
  SUPERADMIN
}

```

Then run the following command:

```bash
npx prisma migrate dev --name init #the name is optional but it is good to give it a name
```

This will create a new directory called `migrations` in the `prisma` directory. Also it will create a new file called `migration_timestamp_init` in the `migrations` directory.

So let's create our secret file `secrets.ts` in the root directory of our project.


##### without oop and without environment variables



#### use oop and ensure you capture the environment variables in the .env file. so that you can switch between development and production environments.

```typescript
import dotenv from "dotenv";
dotenv.config();

enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

class Config {
  private static instance: Config;
  private readonly environment: Environment;
  private readonly dbConfig: {
    host: string;
    user: string;
    password: string;
    database: string;
  };

  private constructor() {
    this.environment =
      (process.env.NODE_ENV as Environment) || Environment.DEVELOPMENT;

    this.dbConfig = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "mydatabase",
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  public getDbConfig() {
    return this.dbConfig;
  }

  public isDevelopment(): boolean {
    return this.environment === Environment.DEVELOPMENT;
  }

  public isProduction(): boolean {
    return this.environment === Environment.PRODUCTION;
  }
}

export default Config;
```

Then in .env file, add the following:

```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=prisma_db
```

Then create a new file called `db.ts` in the root directory of your project.

```typescript
import { PrismaClient } from "@prisma/client";

import Config from "./secrets";

const config = Config.getInstance();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `mysql://${config.getDbConfig().user}:${
        config.getDbConfig().password
      }@${config.getDbConfig().host}/${
        config.getDbConfig().database
      }?schema=public`,
    },
  },
});

export default prisma;
```

Then in index you can log the environment and the dbConfig.

```typescript
import Config from "./secrets";

const config = Config.getInstance();

console.log(config.getEnvironment());
console.log(config.getDbConfig());
```



Then create a file utils/seed.ts in the root directory of your project.

````typescript
import prisma from "../db";

// const seed = async () => {
//     // check if the user table is empty
//     const users = await prisma.user.findMany();
//     if (users.length === 0) {

//     await prisma.user.create({
//         data: {
//             name: "John Doe",
//             email: "b@c.com",
//             password: "password",
//             profilepic: "https://www.google.com",
//             isVerified: true,
//             isBlocked: false,
//             role: "ADMIN",
//             blogs: {
//                 create: {
//                     title: "My first blog",
//                     content: "This is my first blog",
//                     published: true
//                 }
//             }
//         }
//     });

//     }

// };

// export default seed;

// turn the above to a class. make it a simple singleton class
class Seed {
    private static instance: Seed;

    private constructor() {}

    public static getInstance(): Seed {
        if (!Seed.instance) {
            Seed.instance = new Seed();
        }
        return Seed.instance;
    }

    public async seed() {
        // check if the user table is empty
        const users = await prisma.user.findMany();
        if (users.length === 0) {

        await prisma.user.create({
            data: {
                name: "John Doe",
                email: "a@b.c",
                password: "password",
                profilepic: "https://www.google.com",
                isVerified: true,
                isBlocked: false,
                role: "ADMIN",
                blogs: {
                    create: {
                        title: "My first blog",
                        content: "This is my first blog",
                        published: true
                    }
                }
            }
        });

            }
    }
}


Then write a script in the package.json file to seed the database.

```json
"scripts": {
    "seed": "ts-node src/utils/seed.ts"
}
`````

Then run the following command:

```bash
npm run seed
```


