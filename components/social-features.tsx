"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Share2, Heart, MessageCircle, Send, Crown, Medal } from "lucide-react"

interface Friend {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  currentWorkout?: string
  weeklyScore: number
  streak: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: string
  shared: boolean
}

interface Post {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  achievement?: Achievement
  likes: number
  comments: number
  timestamp: string
  liked: boolean
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    currentWorkout: "Morning Yoga",
    weeklyScore: 850,
    streak: 12,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    currentWorkout: "Pushup Challenge",
    weeklyScore: 720,
    streak: 8,
  },
  {
    id: "3",
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    weeklyScore: 650,
    streak: 15,
  },
]

const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just completed my 50th yoga session this month! 🧘‍♀️",
    achievement: {
      id: "yoga-master",
      title: "Yoga Master",
      description: "Complete 50 yoga sessions",
      icon: "🧘‍♀️",
      date: "2024-01-15",
      shared: true,
    },
    likes: 24,
    comments: 8,
    timestamp: "2 hours ago",
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "New personal record: 100 pushups in one session! 💪",
    likes: 18,
    comments: 5,
    timestamp: "4 hours ago",
    liked: true,
  },
]

export function SocialFeatures() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends)
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [newPostContent, setNewPostContent] = useState("")

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleShare = (achievement: Achievement) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `Just earned the ${achievement.title} achievement! ${achievement.icon}`,
      achievement,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      liked: false,
    }
    setPosts([newPost, ...posts])
  }

  const addFriend = () => {
    // Simulate adding a friend
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: "New Friend",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      weeklyScore: 0,
      streak: 0,
    }
    setFriends([...friends, newFriend])
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Share your fitness achievement..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <Button size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="font-medium">{post.user.name}</p>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                    <p className="text-gray-700">{post.content}</p>

                    {post.achievement && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{post.achievement.icon}</span>
                          <div>
                            <p className="font-medium text-yellow-800">{post.achievement.title}</p>
                            <p className="text-sm text-yellow-600">{post.achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={post.liked ? "text-red-500" : ""}
                      >
                        <Heart className={`mr-1 h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-1 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Friends ({friends.length})</CardTitle>
                <Button onClick={addFriend} size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Friend
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-gray-500">{friend.currentWorkout || `${friend.streak} day streak`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{friend.weeklyScore} pts</p>
                    <p className="text-sm text-gray-500">This week</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
              <CardDescription>Top performers this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {friends
                  .sort((a, b) => b.weeklyScore - a.weeklyScore)
                  .map((friend, index) => (
                    <div key={friend.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8">
                        {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                        {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                        {index === 2 && <Medal className="h-5 w-5 text-orange-600" />}
                        {index > 2 && <span className="font-medium text-gray-500">#{index + 1}</span>}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-gray-500">{friend.streak} day streak</p>
                      </div>
                      <Badge variant="secondary">{friend.weeklyScore} pts</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
