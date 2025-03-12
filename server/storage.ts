import {
  users,
  socialAccounts,
  posts,
  platformPosts,
  analytics,
  type User,
  type InsertUser,
  type SocialAccount,
  type InsertSocialAccount,
  type Post,
  type InsertPost,
  type PlatformPost,
  type InsertPlatformPost,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";

// Interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Social account operations
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  getSocialAccounts(userId: number): Promise<SocialAccount[]>;
  getSocialAccount(id: number): Promise<SocialAccount | undefined>;
  disconnectSocialAccount(id: number): Promise<SocialAccount | undefined>;
  reconnectSocialAccount(id: number, accessToken: string, refreshToken?: string): Promise<SocialAccount | undefined>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(userId: number): Promise<Post[]>;
  getPostsByStatus(userId: number, status: string): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  updatePostStatus(id: number, status: string): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  
  // Platform post operations
  createPlatformPost(platformPost: InsertPlatformPost): Promise<PlatformPost>;
  getPlatformPosts(postId: number): Promise<PlatformPost[]>;
  updatePlatformPostMetrics(id: number, metrics: any): Promise<PlatformPost | undefined>;
  
  // Analytics operations
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsForAccount(socialAccountId: number): Promise<Analytics[]>;
  getRecentAnalytics(socialAccountId: number, limit: number): Promise<Analytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private socialAccounts: Map<number, SocialAccount>;
  private posts: Map<number, Post>;
  private platformPosts: Map<number, PlatformPost>;
  private analyticsData: Map<number, Analytics>;
  
  private userCurrentId: number;
  private socialAccountCurrentId: number;
  private postCurrentId: number;
  private platformPostCurrentId: number;
  private analyticsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.socialAccounts = new Map();
    this.posts = new Map();
    this.platformPosts = new Map();
    this.analyticsData = new Map();
    
    this.userCurrentId = 1;
    this.socialAccountCurrentId = 1;
    this.postCurrentId = 1;
    this.platformPostCurrentId = 1;
    this.analyticsCurrentId = 1;
    
    // Create a default user for development
    this.createUser({
      username: "demo",
      password: "password",
      email: "demo@example.com",
      fullName: "Demo User",
      avatarUrl: "https://ui-avatars.com/api/?name=Demo+User&background=random",
    });
    
    // Add some demo social accounts
    this.createSocialAccount({
      userId: 1,
      platform: "twitter",
      accountName: "demo_twitter",
      accountId: "twitter123",
      accessToken: "mock-token",
      isConnected: true,
    });
    
    this.createSocialAccount({
      userId: 1,
      platform: "instagram",
      accountName: "demo_instagram",
      accountId: "instagram123",
      accessToken: "mock-token",
      isConnected: true,
    });
    
    this.createSocialAccount({
      userId: 1,
      platform: "facebook",
      accountName: "demo_facebook",
      accountId: "facebook123",
      accessToken: "mock-token",
      isConnected: true,
    });
    
    this.createSocialAccount({
      userId: 1,
      platform: "linkedin",
      accountName: "demo_linkedin",
      accountId: "linkedin123",
      accessToken: "mock-token",
      isConnected: true,
    });
    
    // Create some example posts
    const post1 = this.createPost({
      userId: 1,
      content: "Announcing our new product feature",
      scheduledFor: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "scheduled",
    });
    
    const post2 = this.createPost({
      userId: 1,
      content: "Behind the scenes: Summer photoshoot",
      scheduledFor: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: "scheduled",
    });
    
    const post3 = this.createPost({
      userId: 1,
      content: "Customer spotlight: Success stories",
      scheduledFor: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      status: "draft",
    });
    
    // Past published posts
    const post4 = this.createPost({
      userId: 1,
      content: "Top 10 productivity hacks for remote teams",
      scheduledFor: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "published",
    });
    
    const post5 = this.createPost({
      userId: 1,
      content: "New product launch: Summer collection", 
      scheduledFor: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: "published",
    });
    
    const post6 = this.createPost({
      userId: 1,
      content: "Industry trends for Q3 2023",
      scheduledFor: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "published", 
    });
    
    // Create platform posts
    this.createPlatformPost({
      postId: post1.id,
      socialAccountId: 1, // Twitter
      platformStatus: "pending",
    });
    
    this.createPlatformPost({
      postId: post2.id,
      socialAccountId: 2, // Instagram
      platformStatus: "pending",
    });
    
    this.createPlatformPost({
      postId: post3.id,
      socialAccountId: 3, // Facebook
      platformStatus: "pending",
    });
    
    // Platform posts for past published posts with metrics
    this.createPlatformPost({
      postId: post4.id,
      socialAccountId: 1, // Twitter
      platformStatus: "published",
      platformPostId: "123456789",
      platformPostUrl: "https://twitter.com/demo_twitter/status/123456789",
      publishedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 3200,
        likes: 845,
        shares: 221,
        engagementRate: 4.8,
        engagementRateChange: 1.2
      },
    });
    
    this.createPlatformPost({
      postId: post5.id,
      socialAccountId: 2, // Instagram
      platformStatus: "published",
      platformPostId: "987654321",
      platformPostUrl: "https://instagram.com/p/987654321",
      publishedAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 5700,
        likes: 1200,
        shares: 342,
        engagementRate: 6.5,
        engagementRateChange: 2.3
      },
    });
    
    this.createPlatformPost({
      postId: post6.id,
      socialAccountId: 4, // LinkedIn
      platformStatus: "published",
      platformPostId: "555555555",
      platformPostUrl: "https://linkedin.com/post/555555555",
      publishedAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      metrics: {
        views: 2900,
        likes: 632,
        shares: 78,
        engagementRate: 3.2,
        engagementRateChange: -0.5
      },
    });
    
    // Create analytics data
    // Twitter analytics
    this.createAnalytics({
      socialAccountId: 1,
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      metrics: { 
        views: 12500,
        engagements: 3200,
        shares: 1400,
        followers: 482,
        followersChange: 7,
        viewsChange: 12,
        engagementsChange: 8,
        sharesChange: 5
      }
    });
    
    // Generate daily analytics for the past week
    const platforms = [1, 2, 3, 4]; // IDs of our social accounts
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      platforms.forEach(platformId => {
        const baseViews = Math.floor(Math.random() * 500) + 1000;
        const baseEngagement = Math.floor(Math.random() * 200) + 400;
        const baseShares = Math.floor(Math.random() * 50) + 100;
        const baseFollowers = Math.floor(Math.random() * 20) + 40;
        
        this.createAnalytics({
          socialAccountId: platformId,
          date,
          metrics: {
            views: baseViews,
            engagements: baseEngagement,
            shares: baseShares,
            followers: baseFollowers,
            dailyGrowth: Math.random() * 0.1 + 0.01
          }
        });
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Social account operations
  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const id = this.socialAccountCurrentId++;
    const socialAccount: SocialAccount = { ...account, id };
    this.socialAccounts.set(id, socialAccount);
    return socialAccount;
  }

  async getSocialAccounts(userId: number): Promise<SocialAccount[]> {
    return Array.from(this.socialAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }

  async getSocialAccount(id: number): Promise<SocialAccount | undefined> {
    return this.socialAccounts.get(id);
  }

  async disconnectSocialAccount(id: number): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (account) {
      const updatedAccount = { ...account, isConnected: false };
      this.socialAccounts.set(id, updatedAccount);
      return updatedAccount;
    }
    return undefined;
  }

  async reconnectSocialAccount(id: number, accessToken: string, refreshToken?: string): Promise<SocialAccount | undefined> {
    const account = this.socialAccounts.get(id);
    if (account) {
      const updatedAccount = { 
        ...account, 
        isConnected: true,
        accessToken,
        ...(refreshToken && { refreshToken })
      };
      this.socialAccounts.set(id, updatedAccount);
      return updatedAccount;
    }
    return undefined;
  }

  // Post operations
  async createPost(post: InsertPost): Promise<Post> {
    const id = this.postCurrentId++;
    const createdAt = new Date();
    const newPost: Post = { 
      id,
      userId: post.userId,
      content: post.content,
      mediaUrls: post.mediaUrls || null,
      status: post.status || "draft",
      scheduledFor: post.scheduledFor || null,
      createdAt
    };
    this.posts.set(id, newPost);
    return newPost;
  }

  async getPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => {
        if (a.scheduledFor && b.scheduledFor) {
          return a.scheduledFor.getTime() - b.scheduledFor.getTime();
        }
        if (a.scheduledFor) return -1;
        if (b.scheduledFor) return 1;
        return 0;
      });
  }

  async getPostsByStatus(userId: number, status: string): Promise<Post[]> {
    return (await this.getPosts(userId)).filter(
      (post) => post.status === status
    );
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async updatePostStatus(id: number, status: string): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (post) {
      const updatedPost = { ...post, status };
      this.posts.set(id, updatedPost);
      return updatedPost;
    }
    return undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    // Delete associated platform posts first
    const platformPostsToDelete = await this.getPlatformPosts(id);
    for (const platformPost of platformPostsToDelete) {
      this.platformPosts.delete(platformPost.id);
    }
    // Delete the post
    return this.posts.delete(id);
  }

  // Platform post operations
  async createPlatformPost(platformPost: InsertPlatformPost): Promise<PlatformPost> {
    const id = this.platformPostCurrentId++;
    const newPlatformPost: PlatformPost = { 
      id,
      postId: platformPost.postId,
      socialAccountId: platformPost.socialAccountId,
      platformStatus: platformPost.platformStatus || "pending",
      platformPostId: platformPost.platformPostId || null,
      platformPostUrl: platformPost.platformPostUrl || null,
      publishedAt: platformPost.publishedAt || null,
      metrics: platformPost.metrics || {}
    };
    this.platformPosts.set(id, newPlatformPost);
    return newPlatformPost;
  }

  async getPlatformPosts(postId: number): Promise<PlatformPost[]> {
    return Array.from(this.platformPosts.values()).filter(
      (platformPost) => platformPost.postId === postId
    );
  }

  async updatePlatformPostMetrics(id: number, metrics: any): Promise<PlatformPost | undefined> {
    const platformPost = this.platformPosts.get(id);
    if (platformPost) {
      const updatedMetrics = { ...platformPost.metrics, ...metrics };
      const updatedPlatformPost = { ...platformPost, metrics: updatedMetrics };
      this.platformPosts.set(id, updatedPlatformPost);
      return updatedPlatformPost;
    }
    return undefined;
  }

  // Analytics operations
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.analyticsCurrentId++;
    const newAnalytics: Analytics = { ...analyticsData, id };
    this.analyticsData.set(id, newAnalytics);
    return newAnalytics;
  }

  async getAnalyticsForAccount(socialAccountId: number): Promise<Analytics[]> {
    return Array.from(this.analyticsData.values())
      .filter((analytics) => analytics.socialAccountId === socialAccountId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getRecentAnalytics(socialAccountId: number, limit: number): Promise<Analytics[]> {
    return (await this.getAnalyticsForAccount(socialAccountId))
      .slice(-limit);
  }
}

export const storage = new MemStorage();
