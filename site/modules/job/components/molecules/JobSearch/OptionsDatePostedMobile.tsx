import { Option } from '../../../types';

interface Props {
  options: Array<Option>;
}
function OptionsDatePostedMobile({ options }: Props) {
  return (
    <div className="search-option gap-2 p-4 flex flex-wrap justify-center dark:bg-midnight-800 bg-gray-50">
      {options.map((item, key) => (
        <div
          className="text-[14px] border-2 border-gray-400 px-2 py-1 rounded-full"
          key={key}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
export default OptionsDatePostedMobile;
