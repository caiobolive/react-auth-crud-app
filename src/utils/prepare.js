import fs from 'fs/promises';

const settingsFile = '.vscode/settings.json';

async function applyCodeSettings() {
  const defaults = fs
    .readFile('.vscode/settings-default.json', 'utf8')
    .then((data) => JSON.parse(data));
  const current = fs
    .readFile(settingsFile, 'utf8')
    .then((src) => JSON.parse(src))
    .catch(() => ({}));

  const allSettings = await Promise.all([defaults, current]).then(
    ([defaultSettings, currentSettings]) => ({
      ...currentSettings,
      ...defaultSettings,
    }),
  );

  return await fs.writeFile(settingsFile, JSON.stringify(allSettings, null, 2));
}

async function applyWebstormSettings() {
  await fs.copyFile('.idea/prettier.xml.template', '.idea/prettier.xml');
}

await Promise.all([applyCodeSettings(), applyWebstormSettings()]);
