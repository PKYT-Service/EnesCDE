async function fetchToken() {
  const urlToken = 'https://pkyt-database-up.vercel.app/code-source/E-CDE/Secure-token.js'
  const res = await fetch(urlToken)
  if (!res.ok) throw new Error('Impossible de récupérer le token')
  const data = await res.json()
  return data.GITHUB_TOKEN
}

async function fetchStyles(githubToken) {
  // API GitHub pour récupérer un fichier JSON raw dans un repo privé
  // Remplace USER/REPO/PATH par les tiens
  const urlStyles = 'https://api.github.com/repos/EnesCDE/database_EnesCDE/contents/ecde/data/ClassTailwindCss.json'

  const res = await fetch(urlStyles, {
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3.raw' // Pour récupérer le contenu brut
    }
  })

  if (!res.ok) throw new Error('Impossible de récupérer les styles')

  const stylesJson = await res.json()
  return stylesJson
}

function applyStyles(styles) {
  Object.entries(styles).forEach(([id, className]) => {
    const el = document.getElementById(id)
    if (el) {
      // Ajoute les classes sans écraser
      el.classList.add(...className.split(' '))
    } else {
      console.warn(`Élément avec id "${id}" introuvable`)
    }
  })
}

async function init() {
  try {
    const token = await fetchToken()
    const styles = await fetchStyles(token)
    applyStyles(styles)
  } catch (e) {
    console.error('Erreur lors de l\'initialisation des styles :', e)
  }
}

init()
