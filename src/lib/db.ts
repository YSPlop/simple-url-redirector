import { neon } from '@neondatabase/serverless';

// Database connection using Neon
const sql = neon(process.env.DATABASE_URL!);

export interface Link {
  id: string;
  slug: string;
  destination: string;
  created_at: string;
}

export type CreateLinkData = {
  slug: string;
  destination: string;
};

export type UpdateLinkData = {
  slug?: string;
  destination?: string;
};

// Database operations
export async function createLinksTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS links (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(255) UNIQUE NOT NULL,
      destination TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

export async function getAllLinks(): Promise<Link[]> {
  const links = await sql`
    SELECT id, slug, destination, created_at 
    FROM links 
    ORDER BY created_at DESC
  `;
  return links as Link[];
}

export async function getLinkBySlug(slug: string): Promise<Link | null> {
  const result = await sql`
    SELECT id, slug, destination, created_at 
    FROM links 
    WHERE slug = ${slug}
  `;
  return result[0] as Link || null;
}

export async function createLink(data: CreateLinkData): Promise<Link> {
  const result = await sql`
    INSERT INTO links (slug, destination)
    VALUES (${data.slug}, ${data.destination})
    RETURNING id, slug, destination, created_at
  `;
  return result[0] as Link;
}

export async function updateLink(id: string, data: UpdateLinkData): Promise<Link> {
  let result;
  
  if (data.slug !== undefined && data.destination !== undefined) {
    result = await sql`
      UPDATE links 
      SET slug = ${data.slug}, destination = ${data.destination}
      WHERE id = ${id}
      RETURNING id, slug, destination, created_at
    `;
  } else if (data.slug !== undefined) {
    result = await sql`
      UPDATE links 
      SET slug = ${data.slug}
      WHERE id = ${id}
      RETURNING id, slug, destination, created_at
    `;
  } else if (data.destination !== undefined) {
    result = await sql`
      UPDATE links 
      SET destination = ${data.destination}
      WHERE id = ${id}
      RETURNING id, slug, destination, created_at
    `;
  } else {
    throw new Error('No update data provided');
  }
  
  return result[0] as Link;
}

export async function deleteLink(id: string): Promise<void> {
  await sql`DELETE FROM links WHERE id = ${id}`;
}

// Initialize database on first run
export async function initializeDatabase() {
  try {
    await createLinksTable();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
