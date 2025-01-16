'use server'
import { Database } from '@/supabase-types';
import { createBrowserClient } from '@supabase/ssr'
import Link from "next/link";


type Status = Database['public']['Tables']['properties']['Row']['status']

function StatusFilter({ status, children, statusFilter }: { status: Status, children: any, statusFilter?: Status }) {
  return <Link href={`?status=${status}`} className={statusFilter === status ? 'font-bold' : ''}>{children}</Link>
}

export default async function Home({ searchParams }: { searchParams: { status?: Status } }) {
  const statusFilter = (await searchParams).status

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
    .eq('status', statusFilter || 'published')
    ;

  if (error) {
    console.error('Error fetching properties:', error);
  }

  return (
    <div>
      <h1 className="font-bold text-xl">Properties Page</h1>

      <div className='flex gap-1'>
        <StatusFilter status='published' statusFilter={statusFilter}>Published</StatusFilter>
        <StatusFilter status='archived' statusFilter={statusFilter}>Archived</StatusFilter>
        <StatusFilter status='draft' statusFilter={statusFilter}>Draft</StatusFilter>
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
