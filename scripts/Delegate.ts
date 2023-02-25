
async function delegateScript() {
    console.log("")
}

delegateScript().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
