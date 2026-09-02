import { useState, useEffect } from 'react'
import type { FakePost } from '@/lib/data/fake-data'
import cn from '@/lib/utils/cn'
import { getLikedPosts, toggleLikedPost } from '@/lib/utils/localStorage'

interface PostCardProps {
  post: FakePost
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  useEffect(() => {
    const likedPosts = getLikedPosts()
    setLiked(likedPosts.has(post.id))
  }, [post.id])

  const handleLike = () => {
    const newLikedState = toggleLikedPost(post.id)
    setLiked(newLikedState)
    setLikes((prev) => (prev + (newLikedState ? 1 : -1)))
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.avatar}
          alt={post.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{post.username}</span>
            {post.verified && (
              <span className="text-accent" title="Verified (Fake)">
                ✓
              </span>
            )}
            <span className="text-primary/50 text-sm">· {post.timestamp}</span>
          </div>
        </div>
      </div>

      <p className="text-primary mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="flex items-center gap-6 text-primary/70">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-2 hover:text-accent transition',
            liked && 'text-red-500'
          )}
        >
          <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
          <span className="text-sm">
            {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <span className="text-sm">
            {post.comments.toLocaleString()} {post.comments === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔁</span>
          <span className="text-sm">
            {post.shares.toLocaleString()} {post.shares === 1 ? 'share' : 'shares'}
          </span>
        </div>
      </div>
    </div>
  )
}

