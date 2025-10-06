import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const userOne = await prisma.users.upsert({
        where: { email: "john.doe@example.com" },
        update: {},
        create: {
            id: uuid(),
            name: "John Doe",
            email: "john.doe@example.com",
            password: await hash("securepassword", 10),
        },
    });

    const userTwo = await prisma.users.upsert({
        where: { email: "jane.smith@example.com" },
        update: {},
        create: {
            id: uuid(),
            name: "Jane Smith",
            email: "jane.smith@example.com",
            password: await hash("anotherpassword", 10),
        },
    });

    let mediaOne = await prisma.media.findFirst({
        where: { title: "Matrix Genérica", releaseYear: 2010 },
    });
    if (!mediaOne) {
        mediaOne = await prisma.media.create({
            data: {
                id: uuid(),
                title: "Matrix Genérica",
                description: "Um dev descobre que o mundo é uma simulação e precisa debugá-lo.",
                type: "movie",
                releaseYear: 2010,
                genre: "Sci-Fi",
            },
        });
    }

    let mediaTwo = await prisma.media.findFirst({
        where: { title: "Javamanji", releaseYear: 2020 },
    });
    if (!mediaTwo) {
        mediaTwo = await prisma.media.create({
            data: {
                id: uuid(),
                title: "Javamanji",
                description: "Um jovem descobre um repositório antigo e ao executar o public static void main, é sugado para dentro do código.",
                type: "series",
                releaseYear: 2020,
                genre: "Adventure",
            },
        });
    }

    async function createFavoriteIfNotExists(userId: string, mediaId: string) {
        const exists = await prisma.favorite.findFirst({
            where: { userId, mediaId },
        });
        if (!exists) {
            return prisma.favorite.create({
                data: {
                    id: uuid(),
                    userId,
                    mediaId,
                },
            });
        }
    }

    await createFavoriteIfNotExists(userOne.id, mediaOne.id);
    await createFavoriteIfNotExists(userTwo.id, mediaTwo.id);
    await createFavoriteIfNotExists(userOne.id, mediaTwo.id);

    console.log({ userOne, userTwo, mediaOne, mediaTwo });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

