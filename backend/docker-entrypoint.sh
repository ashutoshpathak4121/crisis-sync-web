#!/bin/sh
set -e

echo "==> Waiting for database to be ready..."
echo "==> Pushing Prisma schema to PostgreSQL..."
npx prisma db push --skip-generate

echo "==> Checking if initial seed data is required..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.user.count();
  if (count === 0) {
    console.log('==> Database is empty. Seeding hospitals, ambulances, and demo accounts...');
    const cp = require('child_process');
    cp.execSync('node prisma/seed.js', { stdio: 'inherit' });
    try {
      cp.execSync('node prisma/seedPortals.js', { stdio: 'inherit' });
    } catch (err) {
      console.log('Portal seed completed or skipped:', err.message);
    }
    console.log('==> Seeding completed successfully.');
  } else {
    console.log('==> Database already populated (' + count + ' users). Skipping seed.');
  }
  await prisma.\$disconnect();
}
main().catch(err => {
  console.error('Seed check error:', err);
  process.exit(0);
});
"

echo "==> Starting CrisisSync Backend Server..."
exec "$@"
