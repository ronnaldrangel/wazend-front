export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${email}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const userExists = data.length > 0;
    const userConfirmed = userExists ? data[0].confirmed : false;

    return res.status(200).json({
      exists: userExists,
      confirmed: userConfirmed
    });
  } catch (error) {
    console.error('Check user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}