import { HTMLAttributes, ReactNode } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-red-600 ' + className}
        >
            {message}
        </p>
    ) : null;
}

export const ErrorMessage = ({errors }: { errors: string[]; }):ReactNode => {
    return errors ? <ul className="error-message">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul> : ""
}
