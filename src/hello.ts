console.log(`
%cSuper Simple Clones %cby Adam Jurczyk
`, `
font-size: 3em;
padding: 10px;
font-family: fantasy;
`, `
font-size: 2em;
padding: 10px;
font-family: cursive;
`);

if (import.meta.env.PROD) {
    console.log(`
    Hi! I'm flattered you thought it's worthwile to poke around here.

    BUT if you really want to look under the hood, you can as well just check unminified sources at https://github.com/ajur/ssc

    Have fun and stay safe!
    `);
}

