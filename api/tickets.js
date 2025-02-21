const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // 1. Verificar autenticação
    const userToken = req.headers.authorization?.split(' ')[1];
    if (!userToken) return res.status(401).json({ error: 'Não autorizado' });

    // 2. Buscar usuário na Outseta
    const userResponse = await fetch('https://jetstor.outseta.com/api/v1/auth/currentuser', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    if (!userResponse.ok) throw new Error('Token inválido');
    
    const user = await userResponse.json();

    // 3. Buscar tickets
    const ticketsResponse = await fetch(
      `https://jetstor.outseta.com/api/v1/support/cases?FromPerson.Uid=${user.Uid}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OUTSETA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Retornar resposta
    const tickets = await ticketsResponse.json();
    res.json(tickets);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message || 'Erro interno' });
  }
};