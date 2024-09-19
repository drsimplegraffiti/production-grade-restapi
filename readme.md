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

### Part 4
### A
In this part 4, which will be the final part of this video, we will create the following:
- Deploy what we have to heroku with a script
  - we will create bash file called `deploy.sh` in the root directory of our project
  - Then we run the chmod command to make the file executable `chmod +x deploy.sh`
  - Create a script in the package.json file to deploy the app to heroku `heroku-postbuild` script

&nbsp;

### B
- Create a User
  - DAL (Data Access Layer) or the Service Layer (this is where we will write our CRUD operations), it basically contains the logic for interacting with the database.
  - DTO (Data Transfer Object) (this is where we will define the shape of the data we want to send to the client) or we simple define interfaces for our models.
  - Create a validation class to validate the user input before saving it to the database using joi
  - Encrypt our data using bcrypt before saving it to the database (utils class)
  - Generate access/refresh tokens using jsonwebtoken and save the refresh token in the database (utils class)
  - Controller (this is where we will write our route handlers), but this will be abstracted to the routes folder.
  - Fire and forget using emit and on with eventemitter in nodejs while sending the email to the user

  &nbsp;

### C
- Login a User
  - authenticate a user
  - create a middleware to check if the user is authenticated before accessing a protected route

  &nbsp;

### D
- Misc
  - Create a middleware logger to log the request and response of the user
  - Debugging in VSCode with breakpoints
  - Log with winston logger but we will save our logs in a  separate db using winston-mysql or winston-prisma
  - Add pagination and filtering to our get all users route
  - Call external api using axios and save the data to the database


#### Code
- DAL
- Create a folder called `services` and create a class called UserService
```typescript
import prisma from "../db";
import hashPassword from "../utils/hashPassword";

class UserService {
  public static async createUser(data: IUser) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
        profilepic: data.profilepic,
        isVerified: data.isVerified,
        isBlocked: data.isBlocked,
        role: data.role,
      },
    });
  }

  public static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
```

create a folder called `dto` and create an interface called `IUser`
```typescript
export interface IUser {
  name: string;
  email: string;
  password: string;
  profilepic?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  role?: string;
}

```

create a folder called `validation` and create a class called `UserValidation`
```typescript
import Joi from "joi";

class UserValidation {
    // user registration validation
    public static userRegistrationValidation(data: IUser) {
        const schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            profilepic: Joi.string(),
            isVerified: Joi.boolean(),
            isBlocked: Joi.boolean(),
            role: Joi.string()
        });

        return schema.validate(data);
    }
    // user login validation
    public static userLoginValidation(data: IUser) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        return schema.validate(data);
    }
}
```
