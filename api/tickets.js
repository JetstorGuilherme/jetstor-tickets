export default async function handler(req, res) {
  try {
    // 1. Validar parâmetros
    const userUid = req.query.uid;
    if (!userUid) return res.status(400).json({ error: 'UID do usuário não fornecido' });

    // 2. Configurar autenticação
    const authString = Buffer.from(`${process.env.OUTSETA_API_KEY}:`).toString('base64');
    
    // 3. Buscar tickets
    const response = await fetch(
      `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/support/cases?FromPerson.Uid=${userUid}`,
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}