import { redirect, notFound } from 'next/navigation';
import { getLinkBySlug, initializeDatabase } from '@/lib/db';

interface RedirectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  // Initialize database if needed
  await initializeDatabase();
  
  // Await params before accessing properties
  const { slug } = await params;
  
  // Get the link by slug
  const link = await getLinkBySlug(slug);
  
  if (!link) {
    notFound();
  }
  
  // Redirect to the destination URL (this throws a special Next.js redirect error)
  redirect(link.destination);
}

// Generate metadata for the page
export async function generateMetadata({ params }: RedirectPageProps) {
  try {
    await initializeDatabase();
    
    // Await params before accessing properties
    const { slug } = await params;
    
    const link = await getLinkBySlug(slug);
    
    if (!link) {
      return {
        title: 'Link Not Found',
      };
    }
    
    return {
      title: `Redirecting to ${link.destination}`,
      description: `You are being redirected to ${link.destination}`,
    };
  } catch {
    return {
      title: 'Link Not Found',
    };
  }
}
