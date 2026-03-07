import { Form, Input } from 'rsuite';

export type FormFieldProps = {
  name: string;
  label?: string;
  accepter?: any;
  placeholder?: string;
};

export const FormField = ({
  name,
  label,
  accepter = Input,
  ...props
}: FormFieldProps) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control name={name} accepter={accepter} {...props} />
  </Form.Group>
);
