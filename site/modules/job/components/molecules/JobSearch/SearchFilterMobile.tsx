import { IconFilter } from '@public/assets/svg';
import OptionsDatePostedMobile from './OptionsDatePostedMobile';
import { Option } from '../../../types';

function SearchFilterMobile() {
  const options: Array<Option> = [
    {
      label: 'Past Month',
      value: 'past_month',
    },
    {
      label: 'Past Week',
      value: 'past_week',
    },
    {
      label: 'Past 24 Hours',
      value: 'past_24_hours',
    },
    {
      label: 'Past Month',
      value: 'past_month',
    },
    {
      label: 'Past Week',
      value: 'past_week',
    },
    {
      label: 'Past 24 Hours',
      value: 'past_24_hours',
    },
  ];
  return (
    <div className="sm:hidden w-full fixed bottom-[21px] left-0 dark:bg-midnight-900 bg-white">
      <div className="grid grid-cols-7 gap-4 py-4 px-4 border-y border-gray-300">
        <div className="dark:text-white text-gray-900 col-span-1">
          <IconFilter />
        </div>
        <div className="col-span-6 flex justify-between">
          <div>Date posted</div>
          <div>Type</div>
          <div>Style</div>
        </div>
      </div>
      <OptionsDatePostedMobile options={options} />
    </div>
  );
}
export default SearchFilterMobile;
