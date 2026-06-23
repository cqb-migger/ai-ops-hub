import TextField from '@base/components/atoms/TextField/TextField';
import { SearchNormal } from '@public/assets/svg';

function SearchInput() {
  return (
    <div className="flex">
      <div className="feature w-full">
        <TextField
          label="Search"
          placeholder="Search for jobs"
          startAdornment={<SearchNormal />}
        />
      </div>
      <button className="btn-outline w-[136px] ml-3 !px-[16px] rounded-md sm:after:content-['job'] after:content-[''] after:ml-1">
        Search
      </button>
    </div>
  );
}
export default SearchInput;
