export interface FakePost {
  id: string
  username: string
  avatar: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  verified: boolean
}

export interface FakeUser {
  username: string
  displayName: string
  avatar: string
  bio: string
  followers: number
  following: number
  posts: number
  verified: boolean
  achievements: string[]
}

export interface FakeMetric {
  label: string
  value: number
  change: number
  unit: string
}

export const fakeUser: FakeUser = {
  username: 'you',
  displayName: 'You (Obviously Fake)',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
  bio: '✨ Professional fake influencer | 🎯 100% authentic fake engagement | 💰 Sponsored by fake brands | 📈 Numbers go up (trust me)',
  followers: 124789,
  following: 42,
  posts: 1337,
  verified: true,
  achievements: [
    '🏆 Bought 100K followers',
    '💎 Fake engagement master',
    '🔥 Viral (in my dreams)',
    '⭐ Top 0.1% of fake influencers',
    '🎪 CloutHub Premium Member',
  ],
}

export const fakePosts: FakePost[] = [
  {
    id: '1',
    username: 'influencer_pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
    content: 'Just hit 1M followers! 🎉 (Definitely not bought) #authentic #real #notfake',
    image: 'https://picsum.photos/800/600?random=1',
    likes: 125000,
    comments: 4200,
    shares: 890,
    timestamp: '2h',
    verified: true,
  },
  {
    id: '2',
    username: 'lifestyle_guru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru',
    content: 'My morning routine: Wake up, check fake engagement, post fake inspirational quote, repeat. ✨',
    image: 'https://picsum.photos/800/600?random=2',
    likes: 89000,
    comments: 2100,
    shares: 450,
    timestamp: '5h',
    verified: true,
  },
  {
    id: '3',
    username: 'fitness_fake',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness',
    content: 'Day 1 of my fitness journey! (This is my 1000th "Day 1" post) 💪 #fitness #journey #day1again',
    likes: 67000,
    comments: 1800,
    shares: 320,
    timestamp: '8h',
    verified: false,
  },
  {
    id: '4',
    username: 'travel_fake',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel',
    content: 'Living my best life in Bali! (Stock photo, I\'m actually at home) 🌴 #travel #wanderlust #fake',
    image: 'https://picsum.photos/800/600?random=4',
    likes: 156000,
    comments: 5600,
    shares: 1200,
    timestamp: '12h',
    verified: true,
  },
  {
    id: '5',
    username: 'foodie_fake',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=food',
    content: 'This avocado toast changed my life! (Paid $50 for this photo) 🥑 #foodie #avocadotoast #sponsored',
    image: 'https://picsum.photos/800/600?random=5',
    likes: 98000,
    comments: 3200,
    shares: 780,
    timestamp: '1d',
    verified: false,
  },
  {
    id: '6',
    username: 'tech_bro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    content: 'Just launched my 47th "revolutionary" app that does nothing! 🚀 #startup #tech #innovation #fake',
    likes: 45000,
    comments: 890,
    shares: 120,
    timestamp: '2d',
    verified: true,
  },
]

export const fakeMetrics: FakeMetric[] = [
  { label: 'Fake Followers', value: 124789, change: 2341, unit: '' },
  { label: 'Fake Likes', value: 2345678, change: 45678, unit: '' },
  { label: 'Fake Comments', value: 123456, change: 2345, unit: '' },
  { label: 'Engagement Rate', value: 0.05, change: -0.01, unit: '%' },
  { label: 'Reach (Fake)', value: 456789, change: 12345, unit: '' },
  { label: 'Impressions (Also Fake)', value: 1234567, change: 23456, unit: '' },
]

export const fakeFollowers = [
  { username: 'bot_account_1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot1', verified: false },
  { username: 'bot_account_2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot2', verified: false },
  { username: 'bot_account_3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot3', verified: false },
  { username: 'fake_celebrity', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=celeb', verified: true },
  { username: 'bot_account_4', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot4', verified: false },
]

export const followerPackages = [
  { amount: 1000, price: 9.99, bonus: 0 },
  { amount: 5000, price: 39.99, bonus: 500 },
  { amount: 10000, price: 69.99, bonus: 2000 },
  { amount: 50000, price: 299.99, bonus: 15000 },
  { amount: 100000, price: 499.99, bonus: 50000 },
]

