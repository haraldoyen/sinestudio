// Viser hvilke felter Vinmonopolets åpne API gir. Skriver aldri ut nøkkelen.
// Kjør med: node scripts/vmp-probe.mjs
process.loadEnvFile(".env.local");

const key = process.env.VINMONOPOLET_API_KEY?.trim();
if (!key) {
  console.error("Mangler VINMONOPOLET_API_KEY i .env.local");
  process.exit(1);
}

const ENDPOINTS = [
  "https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=1",
  "https://apis.vinmonopolet.no/stores/v0/details?maxResults=1",
];

function describe(value, path = "") {
  if (Array.isArray(value)) {
    console.log(`${path}[] (${value.length})`);
    if (value.length > 0) describe(value[0], `${path}[0]`);
  } else if (value && typeof value === "object") {
    for (const [name, child] of Object.entries(value)) {
      describe(child, path ? `${path}.${name}` : name);
    }
  } else {
    console.log(`${path}: ${typeof value}`);
  }
}

for (const url of ENDPOINTS) {
  const response = await fetch(url, {
    headers: { "Ocp-Apim-Subscription-Key": key },
  });
  console.log(`\n${new URL(url).pathname} -> ${response.status}`);

  if (response.ok) describe(await response.json());
  else console.log((await response.text()).slice(0, 300));
}
