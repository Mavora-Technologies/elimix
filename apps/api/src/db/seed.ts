import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { users } from '../modules/auth/auth.schema.js';
import { tenants } from '../modules/tenant/tenant.schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create Demo Tenant
  let [tenant] = await db.select().from(tenants).where(eq(tenants.name, 'Mavora Academy')).limit(1);

  if (!tenant) {
    [tenant] = await db.insert(tenants).values({
      name: 'Mavora Academy',
      type: 'Primary',
      status: 'active',
      isActive: true,
    }).returning();
    console.log(`✅ Tenant created: ${tenant.name} (ID: ${tenant.id})`);
  } else {
    console.log(`ℹ️ Existing Tenant found: ${tenant.name} (ID: ${tenant.id})`);
  }

  // Common password for demo accounts
  const passwordHash = await bcrypt.hash('Admin@123456', 10);

  // 2. Create Platform Super Admin (No tenantId restriction)
  const superAdminEmail = 'superadmin@elimix.com';
  const [existingSuperAdmin] = await db.select().from(users).where(eq(users.email, superAdminEmail)).limit(1);

  if (!existingSuperAdmin) {
    const [superAdmin] = await db.insert(users).values({
      email: superAdminEmail,
      passwordHash,
      firstName: 'Platform',
      lastName: 'SuperAdmin',
      isSuperAdmin: true,
      isActive: true,
      tenantId: null,
    }).returning();
    console.log(`✅ Platform Super Admin created: ${superAdmin.email}`);
  } else {
    console.log(`ℹ️ Platform Super Admin already exists: ${superAdminEmail}`);
  }

  // 3. Create Tenant Admin
  const tenantAdminEmail = 'admin@mavora.ac.ke';
  const [existingTenantAdmin] = await db.select().from(users).where(eq(users.email, tenantAdminEmail)).limit(1);

  if (!existingTenantAdmin && tenant) {
    const [tenantAdmin] = await db.insert(users).values({
      email: tenantAdminEmail,
      passwordHash,
      firstName: 'School',
      lastName: 'Admin',
      isSuperAdmin: false,
      isActive: true,
      tenantId: tenant.id,
    }).returning();
    console.log(`✅ Tenant Admin created: ${tenantAdmin.email}`);
  } else {
    console.log(`ℹ️ Tenant Admin already exists: ${tenantAdminEmail}`);
  }

  console.log('🎉 Database seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});