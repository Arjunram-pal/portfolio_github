'use strict';

(function () {
  const config = window.PORTFOLIO_SUPABASE || {};
  const authStorageKey = 'portfolio.supabase.session';

  function normalizeConfig() {
    return {
      url: String(config.url || '').replace(/\/+$/, ''),
      anonKey: String(config.anonKey || '').trim(),
      adminEmail: String(config.adminEmail || '').trim()
    };
  }

  function isConfigured() {
    const normalized = normalizeConfig();
    return Boolean(normalized.url && normalized.anonKey);
  }

  function getStoredSession() {
    try {
      const raw = window.localStorage.getItem(authStorageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function setStoredSession(session) {
    if (!session) {
      window.localStorage.removeItem(authStorageKey);
      return;
    }

    window.localStorage.setItem(authStorageKey, JSON.stringify(session));
  }

  function getHeaders(options) {
    const normalized = normalizeConfig();
    const session = getStoredSession();
    const headers = {
      apikey: normalized.anonKey,
      'Content-Type': 'application/json'
    };

    if (options && options.useAuth && session && session.access_token) {
      headers.Authorization = 'Bearer ' + session.access_token;
    } else {
      headers.Authorization = 'Bearer ' + normalized.anonKey;
    }

    if (options && options.headers) {
      Object.keys(options.headers).forEach(function (key) {
        headers[key] = options.headers[key];
      });
    }

    return headers;
  }

  async function request(path, options) {
    const normalized = normalizeConfig();

    if (!isConfigured()) {
      throw new Error('Supabase is not configured yet.');
    }

    const response = await fetch(normalized.url + path, {
      method: options && options.method ? options.method : 'GET',
      headers: getHeaders(options),
      body: options && options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      let detail = response.statusText;

      try {
        const data = await response.json();
        detail = data.msg || data.message || data.error_description || data.error || detail;
      } catch (error) {
        // Keep the original response text when JSON parsing fails.
      }

      throw new Error(detail || 'Supabase request failed.');
    }

    if (response.status === 204) {
      return null;
    }

    const responseText = await response.text();
    if (!responseText) {
      return null;
    }

    return JSON.parse(responseText);
  }

  function mapBlogPost(post) {
    return {
      id: post.id,
      title: String(post.title || ''),
      category: String(post.category || 'General'),
      content: String(post.content || ''),
      timestamp: post.created_at
    };
  }

  function mapRoutinePost(post) {
    return {
      id: post.id,
      message: String(post.message || ''),
      timestamp: post.created_at,
      replies: []
    };
  }

  async function fetchBlogPosts() {
    const data = await request('/rest/v1/blog_posts?select=id,title,category,content,created_at&order=created_at.desc', {
      method: 'GET'
    });

    return Array.isArray(data) ? data.map(mapBlogPost) : [];
  }

  async function fetchRoutinePosts() {
    const data = await request('/rest/v1/routine_posts?select=id,message,created_at&order=created_at.desc', {
      method: 'GET'
    });

    return Array.isArray(data) ? data.map(mapRoutinePost) : [];
  }

  async function signIn(email, password) {
    const data = await request('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: {
        email: email,
        password: password
      }
    });

    setStoredSession(data);
    return data;
  }

  async function signOut() {
    try {
      await request('/auth/v1/logout', {
        method: 'POST',
        useAuth: true
      });
    } finally {
      setStoredSession(null);
    }
  }

  async function createBlogPost(payload) {
    const data = await request('/rest/v1/blog_posts', {
      method: 'POST',
      useAuth: true,
      headers: {
        Prefer: 'return=representation'
      },
      body: {
        title: payload.title,
        category: payload.category,
        content: payload.content
      }
    });

    return data;
  }

  async function createRoutinePost(payload) {
    const data = await request('/rest/v1/routine_posts', {
      method: 'POST',
      useAuth: true,
      headers: {
        Prefer: 'return=representation'
      },
      body: {
        message: payload.message
      }
    });

    return data;
  }

  window.PortfolioSupabase = {
    isConfigured: isConfigured,
    getConfig: normalizeConfig,
    getSession: getStoredSession,
    fetchBlogPosts: fetchBlogPosts,
    fetchRoutinePosts: fetchRoutinePosts,
    signIn: signIn,
    signOut: signOut,
    createBlogPost: createBlogPost,
    createRoutinePost: createRoutinePost
  };
})();
