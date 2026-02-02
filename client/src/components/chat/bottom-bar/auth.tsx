import { Button } from '@/components/ui/button';
import { useEmailStore } from '@/store/email.store';

const Auth = () => {
	const { email, setEmail } = useEmailStore();
	return (
		<div className="flex items-center gap-3">
			<div>
				Welcome, <span className="italic">{email}</span>
			</div>
			<Button variant="secondary" onClick={() => setEmail(undefined)}>
				Log Out
			</Button>
		</div>
	);
};

export default Auth;
