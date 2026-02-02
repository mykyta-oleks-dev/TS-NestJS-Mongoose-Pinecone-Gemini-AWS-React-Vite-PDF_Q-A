import { useEmailStore } from '@/store/email.store';
import { Field, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { isEmail } from '@/lib/validation';
import { useActionState } from 'react';

const auth = (cb: (val: string) => void) => (_: unknown, fd: FormData) => {
	const email = fd.get('email') as string;

	if (!isEmail(email)) {
		return { error: 'Invalid email format' };
	}

	cb(email);
	return { error: undefined };
};

const AuthForm = () => {
	const setEmail = useEmailStore((s) => s.setEmail);

	const [state, formAction] = useActionState(auth(setEmail), {
		error: undefined,
	} as { error: undefined | string });

	return (
		<form
			action={formAction}
			className="flex flex-col gap-3 max-w-sm w-full"
		>
			<Field className="w-full" data-invalid={!!state.error}>
				<FieldLabel htmlFor="email">Email</FieldLabel>
				<Input
					className="w-full"
					id="email"
					name="email"
					placeholder="user@mail.com"
				/>
				{state.error && <FieldError>{state.error}</FieldError>}
			</Field>
			<Button type="submit">Submit</Button>
		</form>
	);
};

export default AuthForm;
