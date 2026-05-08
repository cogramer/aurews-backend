import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  const categoriesData = [
    { name: 'Latest', slug: 'latest' },
    { name: 'Business', slug: 'business' },
    { name: 'Market', slug: 'market' },
    { name: 'Technology', slug: 'technology' },
    { name: 'AI', slug: 'ai' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Politics', slug: 'politics' }
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) => 
      db.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat
      })
    )
  );

  // We'll store a reference to the 'Business' and 'Economy' (now Market) categories for our test posts below
  const business = categories.find(c => c.slug === 'business')!;
  const economy = categories.find(c => c.slug === 'market')!; // mapping old 'economy' to 'market' for the seed posts

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