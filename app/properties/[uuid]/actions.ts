'use server'
import { Database, Tables } from '@/supabase-types';

import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

interface Cookie {
  name: string;
  value: string;
  options?: any;
}

export const updateProperty = async (formData: FormData): Promise<any> => {
  const property: { [key: string]: any } = {}
  const propertyUUID = formData.get('property_uuid')
  formData.delete('property_uuid')
  formData.forEach((value, key) => value && (property[key] = value))
  const cookieStore = await cookies();
  // hardcode to 1 since we do not have users

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): Cookie[] {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Cookie[]): void {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser()
  property.created_by = user?.id


  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('uuid', propertyUUID)

  if(error === null) {
    revalidatePath(`/properties/${propertyUUID}`)
  }

  if (error) {
    throw new Error(`Error inserting data: ${error.message}`);
  }

  return data;
};

type Status = Database['public']['Tables']['properties']['Insert']['status']
export const updateStatus = async (propertyUUID: string, status: Status): Promise<any> => {
  const cookieStore = await cookies();
  // hardcode to 1 since we do not have users

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): Cookie[] {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Cookie[]): void {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser()



  const { data, error } = await supabase
    .from('properties')
    .update({ status })
    .eq('uuid', propertyUUID)

  if(error === null) {
    revalidatePath(`/properties/${propertyUUID}`)
  }

  if (error) {
    throw new Error(`Error inserting data: ${error.message}`);
  }

  return data;
};