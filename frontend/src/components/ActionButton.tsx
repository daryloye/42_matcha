import './components.css';

type ActionButtonProps = {
  className?: string;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

export function ActionButton({
  className = 'action-button',
  text,
  type = 'button',
  onClick,
}: ActionButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
}
