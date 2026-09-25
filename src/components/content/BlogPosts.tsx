import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, User, Eye } from 'lucide-react';
import { INITIAL_BLOG_POSTS } from '../../data/sippzoCatalog';
import { formatDate } from '../../lib/formatters';

export const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState(INITIAL_BLOG_POSTS);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">SIPPZO Blog & Food-Tech Stories</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Educate tea lovers and travelers on self-heating engineering and traditional kulhad benefits.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-5">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full md:w-48 h-32 rounded-lg object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Published
              </span>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-1">
                <span>By {post.authorName}</span>
                <span>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
