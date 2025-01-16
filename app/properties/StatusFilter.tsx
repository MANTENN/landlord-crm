'use client'
import { Database } from '@/supabase-types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export type Status = Database['public']['Tables']['properties']['Row']['status']

export function StatusFilter({ status, children }: { status: Status, children: any }) {
  const statusFilter = useSearchParams().get('status') as Status | null
  const className = statusFilter === status ? 'font-bold' : undefined

  return <Link href={`?status=${status}`} className={className}>{children}</Link>
}