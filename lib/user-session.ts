/**
 * User Session Management
 * Manages current user identity across the app
 */

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const USER_SESSION_KEY = 'qora_user_session';

export interface UserSession {
  userId: string;
  username: string;
  createdAt: string;
  tonWallet?: string;
  ethWallet?: string;
}

/**
 * Get or create user session from localStorage
 */
export function getUserSession(): UserSession {
  if (typeof window === 'undefined') {
    // Server-side: return demo user
    return {
      userId: 'demo-user',
      username: 'demo_user',
      createdAt: new Date().toISOString(),
    };
  }

  // Client-side: get from localStorage
  const stored = localStorage.getItem(USER_SESSION_KEY);
  
  if (stored) {
    try {
      const session = JSON.parse(stored);
      // Убеждаемся что пользователь есть в userProfiles
      ensureUserInProfiles(session);
      return session;
    } catch (e) {
      console.error('Failed to parse user session:', e);
    }
  }

  // Create new session
  const newSession: UserSession = {
    userId: generateUUID(),
    username: `user_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newSession));
  
  // Добавляем пользователя в userProfiles
  ensureUserInProfiles(newSession);
  
  console.log('🆕 Created new user session:', newSession);
  
  return newSession;
}

/**
 * Ensure user exists in userProfiles
 */
function ensureUserInProfiles(session: UserSession) {
  if (typeof window === 'undefined') return;
  
  const profilesData = localStorage.getItem('qora_user_profiles');
  let profiles = [];
  
  try {
    profiles = profilesData ? JSON.parse(profilesData) : [];
  } catch (e) {
    console.error('Failed to parse profiles:', e);
  }
  
  // Проверяем есть ли пользователь
  const exists = profiles.some((p: any) => p.id === session.userId);
  
  if (!exists) {
    profiles.push({
      id: session.userId,
      username: session.username,
      tonWallet: session.tonWallet,
      ethWallet: session.ethWallet,
      createdAt: new Date(session.createdAt)
    });
    
    localStorage.setItem('qora_user_profiles', JSON.stringify(profiles));
    console.log('👤 Added user to profiles:', session.username);
  }
}

/**
 * Update user session (e.g., when wallet connected)
 */
export function updateUserSession(updates: Partial<UserSession>) {
  if (typeof window === 'undefined') return;

  const current = getUserSession();
  const updated = { ...current, ...updates };
  
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
  
  console.log('🔄 Updated user session:', updated);
}

/**
 * Clear user session (logout)
 */
export function clearUserSession() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(USER_SESSION_KEY);
  console.log('🔓 Cleared user session');
}

/**
 * Get current user ID
 */
export function getCurrentUserId(): string {
  return getUserSession().userId;
}
