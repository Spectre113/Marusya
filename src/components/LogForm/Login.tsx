import { Logo } from '../Link/linkIcons';
import './Login.css';
import { Input, type InputProps } from '../Input/Input';
import { Button, type ButtonProps } from '../Button/Button';

export interface LogInProps {
  email: InputProps;
  password: InputProps;
  entry: ButtonProps;
  registerButton: ButtonProps;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LogIn = ({ email, password, entry, registerButton, onSubmit }: LogInProps) => {
  return (
    <div className="flex modal-logIn">
      <div className="flex logo-wrapper">
        <Logo />
      </div>
      <form noValidate className="modal-logIn__form" onSubmit={onSubmit}>
        <div className="flex input-wrapper-block">
          <Input
            placeholder={email.placeholder}
            type={email.type}
            icoPath={email.icoPath}
            onChange={email.onChange}
            theme={email.theme}
            value={email.value}
            error={email.error}
          />
          <Input
            placeholder={password.placeholder}
            type={password.type}
            icoPath={password.icoPath}
            onChange={password.onChange}
            theme={password.theme}
            value={password.value}
            error={password.error}
          />
        </div>
        <div className="flex button-wrapper">
          <Button
            type={entry.type}
            title={entry.title}
            onClick={entry.onClick}
            variant={entry.variant}
            subclass={entry.subclass}
            width={entry.width}
          />
        </div>
      </form>
      <button className="btn-reset modal-logIn__regiter" onClick={registerButton.onClick}>
        {registerButton.title}
      </button>
    </div>
  );
};
