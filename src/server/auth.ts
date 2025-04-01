import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSidePropsContext } from "next";
import { type UserRole } from "@prisma/client";
import { env } from "~/env.mjs";

// Define session types for Supabase
declare module '@supabase/auth-helpers-nextjs' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: UserRole;
      groupId: number;
    };
  }
}

// Create a server-side Supabase client
export const createServerSupabase = (context: GetServerSidePropsContext) => {
  return createServerSupabaseClient({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    context,
  });
};

// Helper to get server-side session
export const getServerAuthSession = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabase(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

// Helper to check if user is authenticated and has required role
export const checkUserAccess = async (
  ctx: GetServerSidePropsContext,
  requiredRoles?: UserRole[]
) => {
  const supabase = createServerSupabase(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (requiredRoles && requiredRoles.length > 0) {
    // Get user role from your database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || !userData || !requiredRoles.includes(userData.role as UserRole)) {
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

// Example of protected page wrapper
export const withAuth = (
  getServerSideProps?: (context: GetServerSidePropsContext) => Promise<any>,
  requiredRoles?: UserRole[]
) => {
  return async (ctx: GetServerSidePropsContext) => {
    const authCheck = await checkUserAccess(ctx, requiredRoles);

    if ('redirect' in authCheck) {
      return authCheck;
    }

    if (getServerSideProps) {
      const props = await getServerSideProps(ctx);
      
      // If the page's getServerSideProps returns a redirect, respect it
      if ('redirect' in props) {
        return props;
      }

      // Merge the auth props with the page's props
      return {
        props: {
          ...props.props,
          ...authCheck.props,
        },
      };
    }

    return authCheck;
  };
};
