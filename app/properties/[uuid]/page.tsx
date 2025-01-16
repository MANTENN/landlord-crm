
import { createBrowserClient } from '@supabase/ssr'
import { updateProperty, updateStatus } from './actions';
import { Database } from '@/supabase-types';

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function PropertyPage({ params }: { params: { uuid: string } }) {
  const propertyUUID = (await params).uuid

  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      zipCode: zip_code,
      propertyImages: property_images ( key, placeholder )
    `)
    .eq('uuid', (await params).uuid)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching properties:', error);
    return <div>Error loading properties</div>;
  }

  if (property === null) {
    return <div>Property not found</div>
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        <div>{property.status}</div>
        <div>{property.address}, {property.city}, {property.state}</div>
        <div>{property.country} {property.zip_code}</div>
      </h1>
      <ul>
        {property.propertyImages.map((image: any) => (
          <li key={image.key}>{image.placeholder}</li>
        ))}
        {property.propertyImages.length == 0 && <div>No property images found.</div>}
      </ul>
      <form>
        <button formAction={updateStatus.bind(null, propertyUUID, 'draft')}>Draft</button>
        <button formAction={updateStatus.bind(null, propertyUUID, 'archived')}>Archive</button>
        <button formAction={updateStatus.bind(null, propertyUUID, 'published')}>Publish</button>
      </form>
      <h2 className='mt-1 font-bold text-xl mb-1'>Update Property</h2>
      <form>
        <input type="hidden" name="property_uuid" value={property.uuid} />
        <div>
          <label>
            Address:
            <input type="text" name="address" />
          </label>
        </div>
        <div>
          <label>
            City:
            <input type="text" name="city" />
          </label>
        </div>
        <div>
          <label>
            State:
            <input type="text" name="state" />
          </label>
        </div>
        <div>
          <label>
            Zip Code:
            <input type="number" name="zip_code" />
          </label>
        </div>
        <div>
          <label>
            Country:
            <input type="text" name="country" />
          </label>
        </div>
        <button type="submit" formAction={updateProperty}>Save Changes</button>
      </form>
    </div>
  );
}