import { Separator } from '@/components/ui/separator';
import Auth from './auth';
import Inputs from './inputs';

const BottomBar = () => {
	return (
		<div className="p-3 rounded-md flex flex-col gap-3 text-gray-200 bg-gray-800">
			<Inputs />
			<Separator />
			<Auth />
		</div>
	);
};

export default BottomBar;
