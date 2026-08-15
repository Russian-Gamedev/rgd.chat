<script lang="ts">
import { page } from '$app/state';

let { data } = $props();
</script>

<pre>
{JSON.stringify(
	{
		pageDataKeys: Object.keys(page.data),
		authIsSet: page.data.auth != null,
		authUsername: page.data.auth?.username ?? null,
		ownData: data
	},
	null,
	2
)}
</pre>
