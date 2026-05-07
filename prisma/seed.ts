import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // 1. Categories 
  const business = await db.category.upsert({
    where: { slug: 'business' },
    update: {},
    create: { name: 'Business', slug: 'business' }
  })

  const economy = await db.category.upsert({
    where: { slug: 'economy' },
    update: {},
    create: { name: 'Economy', slug: 'economy' }
  })

  const tech = await db.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Tech', slug: 'tech' }
  })

  const lifestyle = await db.category.upsert({
    where: { slug: 'lifestyle' },
    update: {},
    create: { name: 'Lifestyle', slug: 'lifestyle' }
  })

  const politics = await db.category.upsert({
    where: { slug: 'politics' },
    update: {},
    create: { name: 'Politics', slug: 'politics' }
  })

  // 2. Users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await db.user.upsert({
    where: { email: 'admin@aurews.com' },
    update: {},
    create: {
      email: 'admin@aurews.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN'
    }
  })

  const userPassword = await bcrypt.hash('user123', 10)
  await db.user.upsert({
    where: { email: 'user@aurews.com' },
    update: {},
    create: {
      email: 'user@aurews.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER'
    }
  })

  // 3. Posts
  await db.post.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Channing Tatum regrets missing Beauty and the Beast role",
        content: `<p>
          Channing Tatum revealed he turned down a role in a remake of Beauty and the Beast.
          He later described it as one of the biggest mistakes of his career.
        </p>`,
        thumbnail: "/assets/img/img1.png",
        categoryId: business.id,
        authorId: admin.id,
      },
      {
        title: "Amazon shares surge as AI boosts cloud growth",
        content: `<p>
          Amazon shares climbed after strong AWS performance driven by AI demand.
          Analysts expect continued growth as more companies invest in cloud infrastructure.
        </p>`,
        thumbnail: "/assets/img/img5.png",
        categoryId: business.id,
        authorId: admin.id,
      },
      {
        title: "How mortgage rates are determined",
        content: `<p>
          Mortgage rates are influenced by bond markets, particularly 10-year Treasury yields.
          The Federal Reserve impacts them indirectly through monetary policy.
        </p>`,
        thumbnail: "/assets/img/img3.png",
        categoryId: economy.id,
        authorId: admin.id,
      }
    ]
  })

  console.log('Seed complete')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())