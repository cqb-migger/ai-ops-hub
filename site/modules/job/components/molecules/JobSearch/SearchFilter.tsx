import TextField from '@base/components/atoms/TextField/TextField';
import { IconPagingBottom } from '@public/assets/svg';

function SearchFilter() {
  return (
    <div className="hidden sm:flex grid grid-cols-6 gap-4 mt-4">
      <TextField
        label="Date posted"
        placeholder="Ex: Any time"
        endAdornment={<IconPagingBottom />}
      />
      <TextField
        label="Type"
        placeholder="Ex: Full time"
        endAdornment={<IconPagingBottom />}
      />
      <TextField
        label="Style"
        placeholder="Ex: On-site"
        endAdornment={<IconPagingBottom />}
      />
    </div>
  );
}
export default SearchFilter;
