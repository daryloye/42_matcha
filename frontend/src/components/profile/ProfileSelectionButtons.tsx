import { useAtom } from 'jotai';
import styles from '../../pages/home/Profile.module.css';

function SelectionButton({ atom, text }: { atom: any; text: string }) {
  const [selection, setSelection] = useAtom(atom);

  return (
    <button
      type='button'
      className={styles.profileSelectionButton}
      onClick={() => setSelection(text)}
      style={{
        backgroundColor: selection === text ? '#b394d6' : 'transparent',
      }}
    >
      {text}
    </button>
  );
}

export function ProfileSelectionButtons({
  atom,
  options,
}: {
  atom: any;
  options: string[];
}) {
  return (
    <div className='row'>
      {options.map((t) => (
        <SelectionButton key={t} atom={atom} text={t} />
      ))}
    </div>
  );
}
