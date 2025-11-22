import { useAtom } from 'jotai';

function SelectionButton({ atom, text }: { atom: any, text: string }) {
  const [selection, setSelection] = useAtom(atom);
  
  return (
    <button
      type='button'
      className='profile-button'
      onClick={() => setSelection(text)}
      style={{ backgroundColor: selection === text ? 'lightBlue' : 'transparent' }}
    >
      {text}
    </button>
  )
}

export function ProfileSelectionButtons({ atom, options }: { atom: any, options: string[] }) {
  return (
    <div id='profile-button-container'>
      {options.map((t) => (
        <SelectionButton key={t} atom={atom} text={t} />
      ))}
    </div>
  )
}