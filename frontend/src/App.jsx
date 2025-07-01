import { useEffect } from "react";
import { initializeStores } from "./store";

function App() {
	useEffect(() => {
		initializeStores();
	}, []);

	return (
		<div>
			<h1>hey</h1>
		</div>
	);
}

export default App;
