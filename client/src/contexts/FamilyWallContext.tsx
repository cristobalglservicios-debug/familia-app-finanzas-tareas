import React, { createContext, useContext, useState } from 'react';

export interface WallPost {
  id: number;
  childId?: number;
  childName: string;
  author: 'parent' | 'child';
  title: string;
  description: string;
  images: string[];
  likes: number;
  comments: Array<{ id: number; author: string; text: string; emoji: string }>;
  timestamp: string;
  likedBy?: string[];
}

interface FamilyWallContextType {
  posts: WallPost[];
  addPost: (post: Omit<WallPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  addComment: (postId: number, comment: { author: string; text: string; emoji: string }) => void;
  toggleLike: (postId: number, userName: string) => void;
}

const FamilyWallContext = createContext<FamilyWallContextType | undefined>(undefined);

export const FamilyWallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<WallPost[]>([
    {
      id: 1,
      childId: 1,
      childName: "Fabio",
      author: 'child',
      title: "¡Completé todas mis tareas! 🎉",
      description: "Hoy fue un día increíble, completé todas mis tareas y gané 55 puntos",
      images: [],
      likes: 12,
      comments: [
        { id: 1, author: "Frida", text: "¡Qué bien! 🙌", emoji: "👏" },
        { id: 2, author: "Mamá", text: "¡Muy orgullosa de ti!", emoji: "❤️" },
      ],
      timestamp: "Hace 2 horas",
      likedBy: ["Frida", "Mamá"],
    },
    {
      id: 2,
      childId: 2,
      childName: "Frida",
      author: 'child',
      title: "Subí de nivel 🌟",
      description: "¡Acabo de llegar al nivel 4! Gracias a todos por apoyarme",
      images: [],
      likes: 8,
      comments: [
        { id: 1, author: "Julieta", text: "¡Felicidades! 🎊", emoji: "🎉" },
      ],
      timestamp: "Hace 5 horas",
      likedBy: ["Julieta"],
    },
  ]);

  const addPost = (post: Omit<WallPost, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newPost: WallPost = {
      ...post,
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      likes: 0,
      comments: [],
      timestamp: "Ahora",
      likedBy: [],
    };
    setPosts([newPost, ...posts]);
  };

  const addComment = (postId: number, comment: { author: string; text: string; emoji: string }) => {
    setPosts(posts.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [
              ...p.comments,
              { id: p.comments.length + 1, ...comment },
            ],
          }
        : p
    ));
  };

  const toggleLike = (postId: number, userName: string) => {
    setPosts(posts.map(p =>
      p.id === postId
        ? {
            ...p,
            likes: p.likedBy?.includes(userName) ? p.likes - 1 : p.likes + 1,
            likedBy: p.likedBy?.includes(userName)
              ? p.likedBy.filter(name => name !== userName)
              : [...(p.likedBy || []), userName],
          }
        : p
    ));
  };

  return (
    <FamilyWallContext.Provider value={{ posts, addPost, addComment, toggleLike }}>
      {children}
    </FamilyWallContext.Provider>
  );
};

export const useFamilyWall = () => {
  const context = useContext(FamilyWallContext);
  if (!context) {
    throw new Error('useFamilyWall debe ser usado dentro de FamilyWallProvider');
  }
  return context;
};
