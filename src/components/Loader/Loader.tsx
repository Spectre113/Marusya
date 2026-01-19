import './Loader.css';

export interface LoaderProps {
  color?: 'blue' | 'white';
}

export const Loader = ({ color = 'blue' }: LoaderProps) => {
  return (
    <div className="loader" data-color={color} aria-label="Loading">
      <div className="loader__segment" />
      <div className="loader__segment" />
      <div className="loader__segment" />
    </div>
  );
};
