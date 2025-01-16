import { addProperty } from './actions';

// This should be a popup for now a page is fine
export default function AddProperty() {
  return (
    <form>
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
      <button type="submit" formAction={addProperty}>Add Property</button>
    </form>
  );
}