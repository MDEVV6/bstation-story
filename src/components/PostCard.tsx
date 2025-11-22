import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  id: string;
  title: string;
  thumbnail: string | null;
  genre: string;
  authorName: string;
  createdAt: string;
}

export default function PostCard({ id, title, thumbnail, genre, authorName, createdAt }: PostCardProps) {
  const genreColors: Record<string, string> = {
    romance: 'bg-pink-500',
    folklore: 'bg-green-500',
    horror: 'bg-red-500',
    fantasy: 'bg-purple-500',
    teen: 'bg-blue-500',
  };

  return (
    <Link to={`/post/${id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group animate-fade-in h-full">
        <div className="aspect-video overflow-hidden bg-muted">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-card">
              <span className="text-4xl opacity-20">📚</span>
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${genreColors[genre]} text-white`}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </Badge>
          </div>
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}