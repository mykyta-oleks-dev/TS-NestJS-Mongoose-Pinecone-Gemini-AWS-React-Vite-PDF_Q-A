import { useEmailStore } from './store/email.store';
import AuthForm from './components/auth';
import Chat from './components/chat';

function App() {
	const { email } = useEmailStore();

	return (
		<div className="flex h-full flex-col items-center justify-center p-2">
			{email ? <Chat email={email} /> : <AuthForm />}
		</div>
	);
}

export default App;
