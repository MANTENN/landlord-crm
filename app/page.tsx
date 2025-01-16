'use server'
import Image from "next/image";
import { cookies, headers } from 'next/headers';
import { createBrowserClient } from '@supabase/ssr'
import Link from "next/link";
import { Database } from "@/supabase-types";

export default async function Home() {

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      *,
      property_images ( key, placeholder )
    `)
    .eq('status', 'published')
    .limit(20);

  if (error) {
    console.error('Error fetching properties:', error);
  }

  return (
    <div>
      <Link href="/properties/add">Add</Link>
      <h2 className="font-bold text-xl">Properties</h2>
      <div className="flex flex-col gap-1">
        {properties?.map((property) => <Link href={"/properties/" + property.uuid} key={property.uuid}>{property.address}, {property.city}, {property.state} {property.country} {property.zip_code}</Link>)}
      </div>
      {properties?.length === 0 && (
        <p>No properties found in the system.</p>
      )}
    </div>
  );
}
