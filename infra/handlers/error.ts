export const handler = async (event: any) => {
	const { errorInfo } = event;
	const key = event.key ?? event.detail?.object?.key;

	console.error(event);

	console.log('Document failed:', key);
	console.log('Error details:', errorInfo);

	return { success: false, key, errorInfo };
};
