import { db } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  const categoriesData = [
    { name: 'Latest', slug: 'latest' },
    { name: 'Business News', slug: 'business' },
    { name: 'Money & Markets', slug: 'markets' },
    { name: 'Tech & Innovation', slug: 'tech' },
    { name: 'A.I.', slug: 'ai' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Politics', slug: 'politics' }
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) => 
      db.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: cat
      })
    )
  );

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

  // 3. Posts Generation
  const thumbnailUrl = "https://res.cloudinary.com/docpflk0p/image/upload/v1778279272/aures_thumbnails/ptf5iqkxvv9dyeeiysjb.jpg";
  
  const postsData = [];
  
  for (const category of categories) {
    for (let i = 1; i <= 3; i++) {
      postsData.push({
        title: `${category.name} Story #${i}: The Future of Global Trends`,
        slug: `${category.slug}-story-${i}-${Math.floor(Math.random() * 1000)}`,
        content: `<p>This is a featured story in the ${category.name} section. It explores the latest developments and future implications of current trends.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
        metaDescription: `Exploring the latest in ${category.name}. A deep dive into what matters today.`,
        thumbnail: thumbnailUrl,
        categoryId: category.id,
        authorId: admin.id,
        status: 'PUBLISHED' as any,
        createdAt: new Date(Date.now() - (i * 3600000)) // Spaced out by hours
      });
    }
  }

  // Clear existing posts to avoid clutter (Optional, but good for fresh seed)
  // await db.post.deleteMany({});

  await db.post.createMany({
    data: postsData,
    skipDuplicates: true,
  });

  console.log(`Seed complete: Created ${postsData.length} posts across ${categories.length} categories.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())