'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Share2, Plus, X } from 'lucide-react';

interface ShareDialogProps {
  wishlistId: string;
  wishlistName: string;
}

export function ShareDialog({ wishlistId, wishlistName }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddEmail = () => {
    if (emails.length < 10) {
      setEmails([...emails, '']);
    }
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleShare = async () => {
    setError(null);
    setSuccess(null);

    // Filter out empty emails
    const validEmails = emails.filter((email) => email.trim() !== '');

    if (validEmails.length === 0) {
      setError('Please enter at least one email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishlist_id: wishlistId,
          recipient_emails: validEmails,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to share wishlist');
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(
        `Wishlist shared successfully with ${data.sent_count} recipient${data.sent_count > 1 ? 's' : ''}!`
      );
      setEmails(['']);
      setIsLoading(false);

      // Close dialog after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Wishlist</DialogTitle>
            <DialogDescription>
              Send "{wishlistName}" to friends and family via email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`email-${index}`} className="sr-only">
                    Email {index + 1}
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="recipient@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEmail(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {emails.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEmail}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Recipient (max 10)
              </Button>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {success}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


