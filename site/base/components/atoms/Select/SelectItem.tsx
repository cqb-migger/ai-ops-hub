export interface SelectItemProps {
  value: string;
  textDisplay: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
}

function SelectItem({ selected, onClick, children }: SelectItemProps) {
  return (
    <li
      className={`px-4 py-2 leading-tight cursor-pointer select-none ${
        selected ? 'bg-blue-50 dark:bg-midnight-500' : ''
      } hover:bg-gray-100 dark:hover:bg-midnight-700 active:bg-gray-100 dark:active:bg-midnight-700`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

export default SelectItem;
