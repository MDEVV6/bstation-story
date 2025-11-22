import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Copy, Download, Calendar, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string | null;
  genre: string;
  created_at: string;
  author_id: string;
  profiles: {
    full_name: string | null;
  };
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();

    if (!error && data) {
      setPost(data);
    } else {
      toast.error('Post not found');
      navigate('/');
    }
    setLoading(false);
  };

  const copyText = () => {
    if (post) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard!');
    }
  };

  const downloadImages = async () => {
    if (!post) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const images = tempDiv.getElementsByTagName('img');

    if (images.length === 0) {
      toast.info('No images found in this post');
      return;
    }

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const url = img.src;
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${i + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast.success(`Downloaded ${images.length} image(s)!`);
  };

  const deletePost = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (!error) {
      toast.success('Post deleted successfully');
      navigate('/');
    } else {
      toast.error('Failed to delete post');
    }
  };

  const genreColors: Record<string, string> = {
    romance: 'bg-pink-500',
    folklore: 'bg-green-500',
    horror: 'bg-red-500',
    fantasy: 'bg-purple-500',
    teen: 'bg-blue-500',
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {post.thumbnail_url && (
          <div className="aspect-video w-full overflow-hidden rounded-2xl mb-8 shadow-xl">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <Badge className={`${genreColors[post.genre]} text-white mb-4`}>
            {post.genre.charAt(0).toUpperCase() + post.genre.slice(1)}
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-balance">{post.title}</h1>
          
          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{post.profiles.full_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            <Button onClick={copyText} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Text
            </Button>
            <Button onClick={downloadImages} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Images
            </Button>
            {user && userRole === 'admin' && (
              <>
                <Button variant="destructive" onClick={deletePost} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="pt-8">
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-foreground prose-img:rounded-xl prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      </article>
    </Layout>
  );
}