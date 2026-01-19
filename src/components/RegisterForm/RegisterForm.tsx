import './RegisterForm.css';

import { Logo } from '../Link/linkIcons';
import { Input, type InputProps } from '../Input/Input';
import { Button, type ButtonProps } from '../Button/Button';

export interface RegisterProps {
  email: InputProps;
  name: InputProps;
  surname: InputProps;
  password: InputProps;
  passConfirm: InputProps;
  registerButton: ButtonProps;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const RegisterForm = ({
  email,
  password,
  name,
  surname,
  registerButton,
  passConfirm,
  onSubmit,
}: RegisterProps) => {
  return (
    <div className="flex modal-register">
      <div className="flex logo-wrapper">
        <Logo />
      </div>
      <form noValidate className="modal-register__form" onSubmit={onSubmit}>
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
            placeholder={name.placeholder}
            type={name.type}
            icoPath={name.icoPath}
            onChange={name.onChange}
            theme={name.theme}
            value={name.value}
            error={name.error}
          />
          <Input
            placeholder={surname.placeholder}
            type={surname.type}
            icoPath={surname.icoPath}
            onChange={surname.onChange}
            theme={surname.theme}
            value={surname.value}
            error={surname.error}
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
          <Input
            placeholder={passConfirm.placeholder}
            type={passConfirm.type}
            icoPath={passConfirm.icoPath}
            onChange={passConfirm.onChange}
            theme={passConfirm.theme}
            value={passConfirm.value}
            error={passConfirm.error}
          />
        </div>
        <div className="flex button-wrapper">
          <Button
            type={registerButton.type}
            title={registerButton.title}
            onClick={registerButton.onClick}
            variant={registerButton.variant}
            subclass={registerButton.subclass}
            width={registerButton.width}
          />
        </div>
      </form>
    </div>
  );
};
