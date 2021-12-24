<script context="module">
    export function load({ error, status }) {
        if (error.message) {
            return {
                props: {
                    info: `${status}\n\n ${error.message}`,
                },
            };
        }

        return {
            props: {
                info: `${status}`,
            },
        };
    }
</script>

<script>
    export let info;
</script>

<h2>Хуета, давай по новой</h2>

<p>{info}</p>
