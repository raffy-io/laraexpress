global.dd = (data, res) => {
  const output = JSON.stringify(data, null, 2);
  if (res) {
    res.status(200).send(`
      <style>
        body { font-family: monospace; background: #111; color: #0f0; padding: 1rem; }
      </style>
      <pre>🧠 DUMP: ${output}</pre>
    `);
  } else {
    console.log("🧠 DUMP:", data);
  }
};
