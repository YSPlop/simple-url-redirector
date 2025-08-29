'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface Link {
  id: string;
  slug: string;
  destination: string;
  created_at: string;
}

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';

export default function HomePage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit dialog state
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    link: Link | null;
    slug: string;
    destination: string;
  }>({
    isOpen: false,
    link: null,
    slug: '',
    destination: '',
  });

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else {
        setError('Failed to fetch links');
      }
    } catch (err) {
      setError('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !destination.trim()) {
      setError('Both slug and destination are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: slug.trim(), destination: destination.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Link created successfully!');
        setSlug('');
        setDestination('');
        await fetchLinks();
      } else {
        setError(data.error || 'Failed to create link');
      }
    } catch {
      setError('Failed to create link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (link: Link) => {
    setEditDialog({
      isOpen: true,
      link,
      slug: link.slug,
      destination: link.destination,
    });
  };

  const handleEditSubmit = async () => {
    if (!editDialog.link) return;

    const { slug: newSlug, destination: newDestination } = editDialog;
    
    if (!newSlug.trim() || !newDestination.trim()) {
      setError('Both slug and destination are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editDialog.link.id,
          slug: newSlug.trim(),
          destination: newDestination.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Link updated successfully!');
        setEditDialog({ isOpen: false, link: null, slug: '', destination: '' });
        await fetchLinks();
      } else {
        setError(data.error || 'Failed to update link');
      }
    } catch {
      setError('Failed to update link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Link deleted successfully!');
        await fetchLinks();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete link');
      }
    } catch {
      setError('Failed to delete link');
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative">
          {/* Theme Toggle - positioned in top right */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            URL Shortener
          </h1>
          <p className="text-muted-foreground">
            Create short links for easy sharing
          </p>
        </div>

        {/* Create Link Form */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Link
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">
                  Short Link
                </label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm mr-2">
                    {DOMAIN}/
                  </span>
                  <Input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      clearMessages();
                    }}
                    placeholder="my-link"
                    className="flex-1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-2">
                  Destination URL
                </label>
                <Input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    clearMessages();
                  }}
                  placeholder="example.com or https://example.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Link'}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Links Table */}
        <div className="bg-card border rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Links</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {links.length} {links.length === 1 ? 'link' : 'links'} created
            </p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading links...
            </div>
          ) : links.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No links created yet. Create your first link above!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short Link</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <a
                        href={`/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {DOMAIN}/{link.slug}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={link.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground hover:underline max-w-xs truncate block"
                      >
                        {link.destination}
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(link.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(link)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialog.isOpen} onOpenChange={(open) => {
          if (!open) {
            setEditDialog({ isOpen: false, link: null, slug: '', destination: '' });
            clearMessages();
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-slug" className="block text-sm font-medium mb-2">
                  Short Link
                </label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm mr-2">
                    {DOMAIN}/
                  </span>
                  <Input
                    id="edit-slug"
                    type="text"
                    value={editDialog.slug}
                    onChange={(e) => {
                      setEditDialog(prev => ({ ...prev, slug: e.target.value }));
                      clearMessages();
                    }}
                    placeholder="my-link"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-destination" className="block text-sm font-medium mb-2">
                  Destination URL
                </label>
                <Input
                  id="edit-destination"
                  type="url"
                  value={editDialog.destination}
                  onChange={(e) => {
                    setEditDialog(prev => ({ ...prev, destination: e.target.value }));
                    clearMessages();
                  }}
                  placeholder="example.com or https://example.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialog({ isOpen: false, link: null, slug: '', destination: '' });
                  clearMessages();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}