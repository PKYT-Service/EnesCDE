// @A-FCT@-LogsD.js // SLPECDE

export function LogsDiscord() {
  try {
    const rules = localStorage.getItem('rules');
    if (rules !== 'true') return;

    const ID = localStorage.getItem('ECDE:ID') || 'null';
    const ID_ip = localStorage.getItem('ECDE:ID_ip') || 'null';
    const ID_df = localStorage.getItem('ECDE:ID_df') || 'null';
    const ID_rp = localStorage.getItem('ECDE:ID_rp') || 'null';

    const url = window.location.href;
    const date = new Date();
    const jour = date.toISOString().split('T')[0];
    const heure = `${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;

    const payload = {
      content: `**[LOGS DETECTED - SLPECDE]**
- ECDE:ID => \`${ID}\`
- ECDE:ID_ip => \`${ID_ip}\`
- ECDE:ID_df => \`${ID_df}\`
- ECDE:ID_rp => \`${ID_rp}\`
- URL => \`${url}\`
- Date => \`${jour}\`
- Heure => \`${heure}\``
    };

    fetch('https://discord.com/api/webhooks/1220132864327159868/f737qxVoYgS6O-B_zqd4ln4mhRHyCafnw3Ex8MSdvu_0IK8V67aSxsRN9bJvvg1qKdja', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error('Erreur LogsD.js :', err);
  }
}
