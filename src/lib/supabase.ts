import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Environment variables ONLY - NEVER exposed or stored in UI/localStorage/tables
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    envUrl &&
    envKey &&
    envUrl.startsWith('https://') &&
    !envUrl.includes('your-project')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(envUrl, envKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'sippzo_supabase_auth_session'
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      clientInstance = null;
    }
  }

  return clientInstance;
};

// Supabase Auth Helpers
export const signInWithSupabase = async (email: string, password: string) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpSuperAdmin = async (
  email: string,
  password: string,
  fullName: string = 'Zubair',
  department: string = 'Management'
) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'super_admin',
        title: 'Super Admin',
        department: department
      }
    }
  });

  if (error) {
    throw error;
  }

  // If user created, also attempt to upsert into profiles table
  if (data.user) {
    try {
      await client.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        email: data.user.email,
        role: 'super_admin',
        title: 'Super Admin',
        department: department,
        is_active: true
      });
    } catch (profileErr) {
      console.warn('Profile table insert warning:', profileErr);
    }
  }

  return data;
};

export const signOutSupabase = async () => {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sippzo_supabase_auth_session');
  }
};

export const getSupabaseSession = async (): Promise<Session | null> => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
};

export const onSupabaseAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => {
  const client = getSupabaseClient();
  if (!client) return { unsubscribe: () => {} };
  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return subscription;
};

export const mapSupabaseUserToProfile = async (user: User): Promise<UserProfile> => {
  const client = getSupabaseClient();
  const defaultSuperAdminEmail = 'zubair669262@gmail.com';
  const isSuperAdminEmail = user.email?.toLowerCase() === defaultSuperAdminEmail.toLowerCase();

  if (client) {
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          fullName: data.full_name || user.user_metadata?.full_name || (isSuperAdminEmail ? 'Zubair' : 'Admin User'),
          email: data.email || user.email || defaultSuperAdminEmail,
          phone: data.phone || '+91 98765 43210',
          role: data.role || (isSuperAdminEmail ? 'super_admin' : 'admin'),
          title: data.title || (isSuperAdminEmail ? 'Super Admin' : 'Admin'),
          department: data.department || 'Management',
          isActive: data.is_active !== false,
          avatarUrl: data.avatar_url,
          lastLogin: new Date().toISOString()
        };
      }
    } catch {
      // profiles table might not be initialized yet
    }
  }

  // Fallback to metadata
  return {
    id: user.id,
    fullName: (user.user_metadata?.full_name as string) || (isSuperAdminEmail ? 'Zubair' : user.email?.split('@')[0] || 'Admin User'),
    email: user.email || defaultSuperAdminEmail,
    phone: '+91 98765 43210',
    role: (user.user_metadata?.role as any) || (isSuperAdminEmail ? 'super_admin' : 'admin'),
    title: isSuperAdminEmail ? 'Super Admin' : 'Admin',
    department: 'Management',
    isActive: true,
    lastLogin: new Date().toISOString()
  };
};
