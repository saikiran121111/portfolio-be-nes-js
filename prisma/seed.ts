import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Phani Venkata Sai Kiran Vanapalli',
      email: 'admin@example.com',
      role: 'admin',
      password: 'hashed-password-here', // Later replace with real hash
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      headline: 'Backend & Full-Stack Developer | Java, Spring Boot, NestJS',
      summary: '4+ years of experience building scalable backend systems and full-stack applications.',
      location: 'Hyderabad, India',
      phone: '+91-9876543210',
      socials: {
        linkedin: 'https://linkedin.com/in/your-profile',
        github: 'https://github.com/your-profile',
        portfolio: 'https://your-portfolio.com',
      },
    },
  });

  // 2️⃣ Skills
  await prisma.skill.createMany({
    data: [
      { userId: user.id, name: 'Java', category: 'Backend', level: 'Advanced' },
      { userId: user.id, name: 'Spring Boot', category: 'Backend', level: 'Advanced' },
      { userId: user.id, name: 'NestJS', category: 'Backend', level: 'Advanced' },
      { userId: user.id, name: 'TypeScript', category: 'Backend', level: 'Advanced' },
      { userId: user.id, name: 'PostgreSQL', category: 'Database', level: 'Advanced' },
      { userId: user.id, name: 'AWS', category: 'DevOps', level: 'Intermediate' },
      { userId: user.id, name: 'GraphQL', category: 'Backend', level: 'Intermediate' },
    ],
  });

  // 3️⃣ Experience
  await prisma.experience.createMany({
    data: [
      {
        userId: user.id,
        title: 'Senior Backend Developer',
        company: 'TechCorp Solutions',
        location: 'Hyderabad, India',
        startDate: new Date('2021-01-01'),
        endDate: null,
        description: 'Leading backend architecture, API design, and cloud deployments.',
        bullets: [
          'Designed and implemented scalable microservices using Spring Boot',
          'Integrated CI/CD pipelines with Jenkins and GitHub Actions',
          'Optimized PostgreSQL queries improving performance by 30%',
        ],
        techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
        order: 1,
      },
      {
        userId: user.id,
        title: 'Full-Stack Developer',
        company: 'InnovateX Labs',
        location: 'Hyderabad, India',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2020-12-31'),
        description: 'Developed and maintained full-stack applications.',
        bullets: [
          'Built REST APIs with NestJS',
          'Developed responsive UI with React.js and Tailwind CSS',
          'Implemented authentication and authorization using JWT',
        ],
        techStack: ['NestJS', 'TypeScript', 'React', 'PostgreSQL'],
        order: 2,
      },
    ],
  });

  // 4️⃣ Projects
  await prisma.project.createMany({
    data: [
      {
        userId: user.id,
        title: 'Portfolio Website',
        description: 'Personal portfolio showcasing my work, skills, and blog.',
        repoUrl: 'https://github.com/your-portfolio',
        liveUrl: 'https://your-portfolio.com',
        tech: ['NextJS', 'NestJS', 'PostgreSQL', 'Tailwind CSS'],
        highlights: ['SEO optimized', 'Responsive design', 'Blog integration'],
        order: 1,
      },
      {
        userId: user.id,
        title: 'E-commerce API',
        description: 'REST API for managing products, orders, and payments.',
        repoUrl: 'https://github.com/ecommerce-api',
        liveUrl: null,
        tech: ['Spring Boot', 'PostgreSQL', 'AWS S3', 'Stripe API'],
        highlights: ['JWT authentication', 'Cloud storage integration', 'Secure payment handling'],
        order: 2,
      },
    ],
  });

  // 5️⃣ Education
  await prisma.education.create({
    data: {
      userId: user.id,
      institution: 'XYZ University',
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      startDate: new Date('2015-06-01'),
      endDate: new Date('2019-04-30'),
      location: 'Hyderabad, India',
      description: 'Specialized in backend development and cloud computing.',
    },
  });

  // 6️⃣ Certifications
  await prisma.certification.createMany({
    data: [
      {
        userId: user.id,
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: new Date('2022-05-15'),
        link: 'https://aws.amazon.com/certification/',
      },
      {
        userId: user.id,
        title: 'Oracle Certified Java Programmer',
        issuer: 'Oracle',
        date: new Date('2021-03-10'),
        link: 'https://education.oracle.com/',
      },
    ],
  });

  // 7️⃣ Achievements
  await prisma.achievement.createMany({
    data: [
      { userId: user.id, title: 'Employee of the Month - July 2021' },
      { userId: user.id, title: 'Open Source Contributor on GitHub' },
    ],
  });

  // 8️⃣ Languages
  await prisma.language.createMany({
    data: [
      { userId: user.id, name: 'English', level: 'Fluent' },
      { userId: user.id, name: 'Telugu', level: 'Native' },
      { userId: user.id, name: 'Hindi', level: 'Fluent' },
    ],
  });

  // 9️⃣ Scan Reports (sample data)
  await prisma.scanReport.createMany({
    data: [
      {
        userId: user.id,
        type: 'sonar',
        commitSha: 'abc123',
        summary: { qualityGate: 'OK', bugs: 0, vulnerabilities: 0, codeSmells: 2 },
        artifactUrl: 'https://sonarcloud.io/project/your-project',
      },
      {
        userId: user.id,
        type: 'coverage',
        commitSha: 'abc123',
        summary: { coverage: 92 },
        artifactUrl: 'https://codecov.io/gh/your-project',
      },
      {
        userId: user.id,
        type: 'security',
        commitSha: 'abc123',
        summary: { high: 0, medium: 1, low: 3 },
        artifactUrl: 'https://semgrep.dev/orgs/your-org/projects/your-project',
      },
    ],
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
