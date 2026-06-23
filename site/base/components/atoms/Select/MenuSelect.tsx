import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const presentationElement = document.getElementById('presentation');
interface Props {
  children: React.ReactNode;
}

function MenuSelect({ children }: Props) {
  const boxElement = document.createElement('div');

  useEffect(() => {
    presentationElement?.appendChild(boxElement);

    return () => {
      presentationElement?.removeChild(boxElement);
    };
  });

  return createPortal(children, boxElement);
}

export default MenuSelect;
