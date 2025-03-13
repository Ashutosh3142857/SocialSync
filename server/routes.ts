import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPostSchema,
  insertSocialAccountSchema,
  postFormSchema,
  platformSchema,
} from "@shared/schema";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import passport from "passport";
import TwitterStrategy from "passport-twitter";
import FacebookStrategy from "passport-facebook";
import InstagramStrategy from "passport-instagram";
import LinkedInStrategy from "passport-linkedin-oauth2";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = app.route("/api");

  // Get current user
  app.get("/api/user", async (req, res) => {
    // In a real app, this would be fetched from session
    // For demo purposes, we'll use the default user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Get social accounts for user
  app.get("/api/accounts", async (req, res) => {
    // For demo we'll use the default user
    const userId = 1;
    const accounts = await storage.getSocialAccounts(userId);
    res.json(accounts);
  });

  // Connect a new social account
  app.post("/api/accounts", async (req, res) => {
    try {
      const userId = 1; // Default user
      const accountData = insertSocialAccountSchema.parse({
        ...req.body,
        userId,
      });
      
      const account = await storage.createSocialAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid account data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Disconnect a social account
  app.post("/api/accounts/:id/disconnect", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid account ID" });
      }
      
      const account = await storage.disconnectSocialAccount(id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect account" });
    }
  });

  // Reconnect a social account
  app.post("/api/accounts/:id/reconnect", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid account ID" });
      }
      
      const { accessToken, refreshToken } = req.body;
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is required" });
      }
      
      const account = await storage.reconnectSocialAccount(id, accessToken, refreshToken);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to reconnect account" });
    }
  });

  // Get all posts for user
  app.get("/api/posts", async (req, res) => {
    const userId = 1; // Default user
    const status = req.query.status as string | undefined;
    
    let posts;
    if (status) {
      posts = await storage.getPostsByStatus(userId, status);
    } else {
      posts = await storage.getPosts(userId);
    }
    
    // For each post, get the platform posts
    const postsWithPlatforms = await Promise.all(
      posts.map(async (post) => {
        const platformPosts = await storage.getPlatformPosts(post.id);
        return {
          ...post,
          platforms: platformPosts,
        };
      })
    );
    
    res.json(postsWithPlatforms);
  });

  // Create a new post
  app.post("/api/posts", async (req, res) => {
    try {
      const userId = 1; // Default user
      
      console.log("Post creation request body:", req.body);
      
      // Convert scheduledFor from string to Date object if it's a string
      let parsedBody = { ...req.body };
      if (typeof parsedBody.scheduledFor === 'string' && parsedBody.scheduledFor) {
        parsedBody.scheduledFor = new Date(parsedBody.scheduledFor);
        console.log("Parsed scheduledFor date:", parsedBody.scheduledFor);
      }
      
      const { content, mediaUrls, platforms, scheduledFor } = postFormSchema.parse(parsedBody);
      
      // Create the post
      const postData = insertPostSchema.parse({
        userId,
        content,
        mediaUrls,
        scheduledFor,
        status: scheduledFor ? "scheduled" : "draft",
      });
      
      console.log("Creating post with data:", postData);
      const post = await storage.createPost(postData);
      console.log("Created post:", post);
      
      // Create platform posts for each selected platform
      const platformPromises = platforms.map((platformId) => 
        storage.createPlatformPost({
          postId: post.id,
          socialAccountId: platformId,
          platformStatus: "pending",
        })
      );
      
      const platformPosts = await Promise.all(platformPromises);
      
      res.status(201).json({
        ...post,
        platforms: platformPosts,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation error:", JSON.stringify(error.errors, null, 2));
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      console.log("Server error:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Get a specific post
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const platformPosts = await storage.getPlatformPosts(id);
      
      res.json({
        ...post,
        platforms: platformPosts,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get post" });
    }
  });

  // Update post status
  app.post("/api/posts/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const { status } = req.body;
      if (!status || !["draft", "scheduled", "published", "failed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const post = await storage.updatePostStatus(id, status);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const platformPosts = await storage.getPlatformPosts(id);
      
      res.json({
        ...post,
        platforms: platformPosts,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update post status" });
    }
  });

  // Delete a post
  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const success = await storage.deletePost(id);
      if (!success) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Get analytics for current user
  app.get("/api/analytics", async (req, res) => {
    try {
      const userId = 1; // Default user
      
      // Get all social accounts for user
      const accounts = await storage.getSocialAccounts(userId);
      
      // For each account, get the analytics data
      const analyticsData = await Promise.all(
        accounts.map(async (account) => {
          const analytics = await storage.getAnalyticsForAccount(account.id);
          return {
            accountId: account.id,
            platform: account.platform,
            accountName: account.accountName,
            analytics,
          };
        })
      );
      
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  // Get recent analytics for a specific account
  app.get("/api/analytics/:accountId", async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      if (isNaN(accountId)) {
        return res.status(400).json({ message: "Invalid account ID" });
      }
      
      const limit = parseInt(req.query.limit as string || "7");
      
      const analytics = await storage.getRecentAnalytics(accountId, limit);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get account analytics" });
    }
  });

  // Get summary statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = 1; // Default user
      
      // Get all accounts for user
      const accounts = await storage.getSocialAccounts(userId);
      
      // Get latest analytics for each account
      const latestAnalytics = await Promise.all(
        accounts.map(async (account) => {
          const analytics = await storage.getRecentAnalytics(account.id, 1);
          return analytics[0];
        })
      );
      
      // Combine metrics from all platforms
      const summary = latestAnalytics.reduce((acc, curr) => {
        if (!curr) return acc;
        
        return {
          views: (acc.views || 0) + (curr.metrics.views || 0),
          engagements: (acc.engagements || 0) + (curr.metrics.engagements || 0),
          shares: (acc.shares || 0) + (curr.metrics.shares || 0),
          followers: (acc.followers || 0) + (curr.metrics.followers || 0),
          viewsChange: curr.metrics.viewsChange || 0,
          engagementsChange: curr.metrics.engagementsChange || 0,
          sharesChange: curr.metrics.sharesChange || 0,
          followersChange: curr.metrics.followersChange || 0,
        };
      }, {});
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to get statistics" });
    }
  });

  // Platform-specific routes

  // Get recent post performance
  app.get("/api/performance", async (req, res) => {
    try {
      const userId = 1; // Default user
      
      // Get published posts
      const publishedPosts = await storage.getPostsByStatus(userId, "published");
      
      // Get the platform posts for each post and include post details
      const postPerformance = await Promise.all(
        publishedPosts.slice(0, 3).map(async (post) => {
          const platformPosts = await storage.getPlatformPosts(post.id);
          return {
            ...post,
            platforms: platformPosts,
          };
        })
      );
      
      res.json(postPerformance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get post performance" });
    }
  });

  // Get upcoming posts
  app.get("/api/upcoming", async (req, res) => {
    try {
      const userId = 1; // Default user
      
      // Get scheduled posts
      const scheduledPosts = await storage.getPostsByStatus(userId, "scheduled");
      
      // Get the platform posts for each post
      const upcomingPosts = await Promise.all(
        scheduledPosts.slice(0, 3).map(async (post) => {
          const platformPosts = await storage.getPlatformPosts(post.id);
          return {
            ...post,
            platforms: platformPosts,
          };
        })
      );
      
      res.json(upcomingPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get upcoming posts" });
    }
  });

  // Setup session middleware
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error, undefined);
    }
  });

  // OAuth routes for Twitter
  app.get('/auth/twitter', (req, res, next) => {
    // We would normally use passport.authenticate here but need keys first
    res.json({ message: "Twitter OAuth requires API keys" });
  });

  app.get('/auth/twitter/callback', (req, res, next) => {
    res.redirect('/dashboard');
  });

  // OAuth routes for Facebook
  app.get('/auth/facebook', (req, res, next) => {
    // We would normally use passport.authenticate here but need keys first
    res.json({ message: "Facebook OAuth requires API keys" });
  });

  app.get('/auth/facebook/callback', (req, res, next) => {
    res.redirect('/dashboard');
  });

  // OAuth routes for Instagram
  app.get('/auth/instagram', (req, res, next) => {
    // We would normally use passport.authenticate here but need keys first
    res.json({ message: "Instagram OAuth requires API keys" });
  });

  app.get('/auth/instagram/callback', (req, res, next) => {
    res.redirect('/dashboard');
  });

  // OAuth routes for LinkedIn
  app.get('/auth/linkedin', (req, res, next) => {
    // We would normally use passport.authenticate here but need keys first
    res.json({ message: "LinkedIn OAuth requires API keys" });
  });

  app.get('/auth/linkedin/callback', (req, res, next) => {
    res.redirect('/dashboard');
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server for real-time data streaming
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Connected clients
  const clients = new Set<WebSocket>();

  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    // Add client to the set
    clients.add(ws);
    console.log('New WebSocket client connected');

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to SocialSync WebSocket server'
    }));

    // Handle messages from client
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Client subscribing to updates for specific data
            ws.send(JSON.stringify({
              type: 'subscribed',
              channel: data.channel,
              message: `Successfully subscribed to ${data.channel}`
            }));
            break;

          case 'ping':
            // Client ping to keep connection alive
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now()
            }));
            break;

          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
  });

  // Function to broadcast data to all connected clients
  const broadcastData = (data: any) => {
    const message = JSON.stringify(data);
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Simulate real-time analytics updates
  setInterval(() => {
    // Only send if we have connected clients
    if (clients.size > 0) {
      const analyticsUpdate = {
        type: 'analytics_update',
        timestamp: Date.now(),
        data: {
          platform: ['twitter', 'facebook', 'instagram', 'linkedin'][Math.floor(Math.random() * 4)],
          metrics: {
            views: Math.floor(Math.random() * 100) + 1,
            engagements: Math.floor(Math.random() * 50) + 1,
            shares: Math.floor(Math.random() * 20) + 1,
            likes: Math.floor(Math.random() * 30) + 1
          }
        }
      };
      
      broadcastData(analyticsUpdate);
    }
  }, 10000); // Every 10 seconds

  return httpServer;
}
