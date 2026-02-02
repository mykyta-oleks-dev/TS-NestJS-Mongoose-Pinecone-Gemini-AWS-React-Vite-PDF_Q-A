import { Button } from '@/components/ui/button';
import { useEmailStore } from './store/email.store';
import AuthForm from './components/auth';

function App() {
	const { email, setEmail } = useEmailStore();

	return (
		<div className="flex h-full flex-col items-center justify-center p-5">
			{email ? (
				<Button onClick={() => setEmail(undefined)}>
					Hello, {email}
				</Button>
			) : (
				<AuthForm />
			)}
		</div>
	);
}

export default App;
