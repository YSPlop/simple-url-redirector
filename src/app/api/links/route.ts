import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllLinks, 
  createLink, 
  updateLink, 
  deleteLink, 
  getLinkBySlug,
  initializeDatabase 
} from '@/lib/db';

// Initialize database on first API call
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDbInitialized();
    const links = await getAllLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('GET /api/links error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const body = await request.json();
    const { slug, destination } = body;

    if (!slug || !destination) {
      return NextResponse.json(
        { error: 'Slug and destination are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingLink = await getLinkBySlug(slug);
    if (existingLink) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Normalize and validate URL format
    let normalizedDestination = destination.trim();
    
    // If URL doesn't start with protocol, add https://
    if (!normalizedDestination.match(/^https?:\/\//i)) {
      normalizedDestination = `https://${normalizedDestination}`;
    }
    
    // Validate the normalized URL
    try {
      new URL(normalizedDestination);
    } catch {
      return NextResponse.json(
        { error: 'Invalid destination URL format' },
        { status: 400 }
      );
    }

    const link = await createLink({ slug, destination: normalizedDestination });
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('POST /api/links error:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const body = await request.json();
    const { id, slug, destination } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    // If updating slug, check for conflicts
    if (slug) {
      const existingLink = await getLinkBySlug(slug);
      if (existingLink && existingLink.id !== id) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // Normalize and validate URL format if destination is being updated
    let normalizedDestination = destination;
    if (destination) {
      normalizedDestination = destination.trim();
      
      // If URL doesn't start with protocol, add https://
      if (!normalizedDestination.match(/^https?:\/\//i)) {
        normalizedDestination = `https://${normalizedDestination}`;
      }
      
      try {
        new URL(normalizedDestination);
      } catch {
        return NextResponse.json(
          { error: 'Invalid destination URL format' },
          { status: 400 }
        );
      }
    }

    const updateData: { slug?: string; destination?: string } = {};
    if (slug !== undefined) updateData.slug = slug;
    if (destination !== undefined) updateData.destination = normalizedDestination;

    const link = await updateLink(id, updateData);
    return NextResponse.json(link);
  } catch (error) {
    console.error('PUT /api/links error:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await deleteLink(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/links error:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
