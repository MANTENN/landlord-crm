'use server'
import { Database } from '@/supabase-types';
import { createBrowserClient } from '@supabase/ssr'
import Link from "next/link";
import { StatusFilter, Status } from './StatusFilter';

export default async function Home({ searchParams }: { searchParams: { status?: Status } }) {
  const statusFilter = (await searchParams).status?.split(',') as Status[];

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
    .in('status', statusFilter || ['published']);

  if (error) {
    console.error('Error fetching properties:', error);
  }

  return (
    <div>
      <h1 className="font-bold text-xl">Properties Page</h1>

      <div className='flex gap-1'>
        <StatusFilter status='published'>Published</StatusFilter>
        <StatusFilter status='archived'>Archived</StatusFilter>
        <StatusFilter status='draft'>Draft</StatusFilter>
      </div>

      <div className="flex flex-col gap-1">
        {properties?.map((property) => <Link href={"/properties/" + property.uuid} key={property.uuid}>{property.address}, {property.city}, {property.state} {property.country} {property.zip_code}</Link>)}
      </div>
      {properties?.length === 0 && (
        <p>No properties found in the system.</p>
      )}
    </div>
  );
}
