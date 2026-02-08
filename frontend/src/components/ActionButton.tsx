import './components.css';

type ActionButtonProps = {
  className?: string;
  text: string;
  onClick: () => void;
};

export function ActionButton({
  className = 'action-button',
  text,
  onClick,
}: ActionButtonProps) {
  return (
    <button type='button' className={className} onClick={onClick}>
      {text}
    </button>
  );
}
