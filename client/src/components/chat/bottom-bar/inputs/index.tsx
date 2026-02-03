import FileInput from './file';
import Message from './message-input';

const Inputs = () => {
	return (
		<div className="flex flex-col gap-3">
			<FileInput />
			<Message />
		</div>
	);
};

export default Inputs;
