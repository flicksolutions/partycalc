<script lang="ts">
	import articles from '$lib/articles.json';
	import Recursive from './Recursive.svelte';
</script>

<div>
	<div>
		List of items
		<Recursive items={articles} />
	</div>
	<div>calculations</div>
</div>
